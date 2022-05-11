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
      "select * from users where username='"+data.username+"';"
    );
    if (foundUser.rowCount>0) {
      throw boom.conflict('Username in use');
    }
    const salt = await bcrypt.genSalt(10);
    data.password = await bcrypt.hash(data.password, salt);
    const newUser = data/*await this.pool.query(
      "insert into users values('"+data.username+"','"+data.password+"',CURRENT_DATE)"
    );*/
    return {"message":"faker"};//newUser.rows
  }

  //Get user
  async findOne(userid) {
    const query = "select * from users where userid = '"+userid+"';";
    const foundUser =  await this.pool.query(query);
    if (foundUser.rowCount===0) {
      throw boom.notFound('User not found');
    }
    return {"message":"faker"};//foundUser.rows;
  }

  //Login
  async login(data) {
    const foundUser = await this.pool.query(
      "select * from users where username='"+data.username+"';"
    );
    if (foundUser.rowCount===0) {
      throw boom.notFound('Username not found');
    }
    const matchedPassword = await bcrypt.compare(data.password, foundUser.password);
    if (!matchedPassword){
      throw boom.notFound('Incorrect password');
    }
    return {"message":"faker"};//foundUser.rows;
  }
}

module.exports = UsersService;
