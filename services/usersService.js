const boom = require('@hapi/boom');
const sequelize = require('../libs/sequelize');
const bcrypt = require("bcrypt");

class UsersService {

  //Register
  async create(data) {
    const foundUser = null;//await model.findOne({ username: data.username });
    if (foundUser) {
      throw boom.conflict('Username in use');
    }
    const salt = await bcrypt.genSalt(10);
    data.password = await bcrypt.hash(data.password, salt);
    const newUser = null;//await new model(data);
    return newUser;
  }

  //Get user
  async findOne(id_) {
    const query = 'select * from public.person where id_ = '+id_;
    const [data] =  await sequelize.query(query);
    if (data.length===0) {
      throw boom.notFound('User not found');
    }
    return {data};
  }

  //Login
  async login(data) {
    const foundUser = null;//await model.findOne({ username: data.username });
    if (!foundUser) {
      throw boom.notFound('Username not found');
    }
    const matchedPassword = await bcrypt.compare(data.password, foundUser.password);
    if (!matchedPassword){
      throw boom.notFound('Incorrect password');
    }
    return foundUser;
  }
}

module.exports = UsersService;
