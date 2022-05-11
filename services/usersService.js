const boom = require('@hapi/boom');
const pool = require('../libs/postgresPool');
const bcrypt = require("bcrypt");

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
    return this.findOne(data.username);
  }

  //Get user
  async findOne(username) {
    const query = "select usersid,username,created_at from users where username = '"+username+"';";
    const foundUser =  await this.pool.query(query);
    if (foundUser.rowCount===0) {
      throw boom.notFound('User not found');
    }
    return foundUser.rows[0];
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
      throw boom.notFound('Incorrect password');
    }
    return this.findOne(data.username);
  }
}

module.exports = UsersService;
