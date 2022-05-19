const boom = require('@hapi/boom');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const pool = require('../libs/postgresPool');
const { config } = require('../config/config');

class UsersService {

  constructor(){
    this.pool = pool;
    this.pool.on('error', (err) => console.error(err));
  }

  //Register
  async create(data) {
    const foundUser = await this.pool.query(
      "select usersid from users where username = '"+data.username+"';"
    );
    if (foundUser.rowCount>0) {
      throw boom.conflict('Username in use');
    }
    const salt = await bcrypt.genSalt(10);
    data.password = await bcrypt.hash(data.password, salt);
    await this.pool.query(
      "insert into users values('0','"+data.username+"','"+data.password+"',CURRENT_DATE)"
    );
    return this.findByUsername(data.username);
  }

  //Login
  async login(data) {
    const foundUser = await this.pool.query(
      "select * from users where username='"+data.username+"';"
    );
    if (foundUser.rowCount===0) {
      throw boom.notFound('Username not found');
    }
    const matchedPassword = await bcrypt.compare(data.password, foundUser.rows[0].password);
    if (!matchedPassword){
      throw boom.unauthorized('Incorrect password');
    }
    return this.findByUsername(data.username);
  }

  //Create JWT
  signToken(user){
    const payload = {
      sub: user.usersid
    }
    const token = jwt.sign(payload, config.jwtSecret);
    return {
      user,
      token
    };
  }

  // Send Recover Mail
  async sendRecoveryMail(email) {
    const user = await this.findUserByEmail(email);
    if (!user) {
      throw boom.unauthorized();
    }
    const payload = { sub: user.usersid };
    const token = jwt.sign(payload, config.jwtSecret, {expiresIn: '15min'});
    const link = `http://myfrontend.com/recovery?token=${token}`;
    const query = "update users \n" +
                  "set recovery_token = '"+token+"' \n" +
                  "where usersid = '"+user.usersid+"';";
    await this.pool.query(query);
    const mail = {
      from: config.smtpEmail,
      to: `${user.email}`,
      subject: "Email para recuperar contraseña",
      html: `<b>Ingresa a este link => ${link}</b>`,
    }
    const rta = await this.sendMail(mail);
    return rta;
  }

  // Send mail
  async sendMail(infoMail) {
    const transporter = nodemailer.createTransport({
      host: config.mailHost,
      secure: true, // true for 465, false for other ports
      port: 465,
      auth: {
        user: config.mailUser,
        pass: config.mailPassword
      }
    });
    await transporter.sendMail(infoMail);
    return { message: 'mail sent' };
  }

  // Recover password
  async recoverPassword(token, newPassword) {
    try {
      const payload = jwt.verify(token, config.jwtSecret);
      const user = await this.findById(payload.sub);
      if (user.recovery_token !== token) {
        throw boom.unauthorized();
      }
      const hash = await bcrypt.hash(newPassword, 10);
      const query = "update users \n" +
                    "set recovery_token = null, password = '"+hash+"' \n" +
                    "where usersid = '"+user.usersid+"';";
      await this.pool.query(query);
      return { message: 'password changed' };
    } catch (error) {
      throw boom.unauthorized();
    }
  }

  // Get user
  async findByUsername(username) {
    const query = "select * from users where username = '"+username+"';";
    const foundUser =  await this.pool.query(query);
    if (foundUser.rowCount===0) {
      throw boom.notFound('User not found');
    }
    delete foundUser.rows[0].password;
    return foundUser.rows[0];
  }

  async findById(id){
    const query = "select * from users where usersid = '"+id+"';";
    const foundUser =  await this.pool.query(query);
    if (foundUser.rowCount===0) {
      throw boom.notFound('User not found');
    }
    delete foundUser.rows[0].password;
    return foundUser.rows[0];
  }
  async findUserByEmail(email){
    const query = "select users.usersid, v_person.email \n" +
                  "from users \n" +
                  "join person \n" +
                  "	on person.usersid = users.usersid \n" +
                  "join v_person \n" +
                  "	on v_person.patientid = person.personid	 \n" +
                  "where v_person.email = '"+email+"' \n" +
                  "limit 1";
    const user =  await this.pool.query(query);
    return user.rows[0];
  }

}

module.exports = UsersService;
