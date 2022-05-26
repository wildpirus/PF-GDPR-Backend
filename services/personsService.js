const boom = require('@hapi/boom');
const { query } = require('express');
const pool = require('../libs/postgresPool');

const { config } = require('../config/config');
const UsersService = require('../services/usersService');

const usersService = new UsersService();

class PersonsService {

  constructor(){
    this.pool = pool;
    this.pool.on('error', (err) => console.error(err));
  }

  //-------------------------------Public methods--------------------------------//
  // get person by person id
  async getPersonById(person_id){
    const data = await this.pool.query("select * from v_persons where person_id = '"+person_id+"';");
    const person = data.rows[0];
    if (person) {
      return person;
    } else {
      throw boom.notFound('There is no person with that person id.')
    }
  }

  // get person by id number
  async getPersonByIdNumber(id_number){
    const data = await this.pool.query("select * from v_persons where id_number = '"+id_number+"' limit 1;");
    const person = data.rows[0];
    if (person) {
      return person
    } else {
      throw boom.notFound("Person not found");
    }
  }

  // verification on id is in the db
  async isIdRegistered(id_number){
    const query = (
      "select v_persons.person_id, \n"+
      "       patients.patient_id, \n"+
      "       employees.employee_id \n"+
      "from v_persons \n"+
      "left join patients \n"+
      "    on patients.person_id = v_persons.person_id \n"+
      "left join employees \n"+
      "    on employees.person_id = v_persons.person_id \n"+
      "where v_persons.id_number = '"+id_number+"' \n"+
      "limit 1;"
      );
    const data = await this.pool.query(query);
    const result = data.rows[0];
    if (result){
      return {
        person_id: result.person_id,
        patient_id: result.patient_id? result.patient_id:false,
        employee_id: result.employee_id? result.employee_id:false
      };
    }else {
      return {
        person_id: false,
        patient_id: false,
        employee_id: false
      };
    }
  }
  //------------------------------Protected methods------------------------------//
  async create(data,user_id) {
    const foundPatient = await this.findPersonByUserId(user_id);
    if (foundPatient){
      throw boom.conflict('A patient is already asociated with the account');
    } else {
      const query = "insert into persons values ('0', '"+
        data.first_name+"', '"+
        data.last_name+"', '"+
        data.gender+"', '"+
        data.id_type+"', '"+
        data.id_number+"','"+
        data.id_expedition_place+"','"+
        data.civil_status+"','"+
        data.email+"','"+
        data.phone_number+"','"+
        user_id+"',null,'"+
        data.birth_date+"', '"+
        data.id_expedition_date+"');";
      await this.pool.query(query);
      return this.findPersonByUserId(user_id);
    }
  }

  async sendWarningEmail(person_id){
    const query = "select email from v_persons where person_id = '"+person_id+"';";
    const data = await this.pool.query(query);
    const email = data.rows[0].email;
    if (email){
      const mail = {
        from: config.smtpEmail,
        to: `${email}`,
        subject: "Aviso de brecha de datos",
        html: `<b>Alguien ha intentado crear una cuenta con su numero de identificación. Contáctese con nosotros para más información.</b>`,
      }
      await usersService.sendMail(mail);
    }
  }

  //-------------------------------Private methods-------------------------------//
  async findPersonByUserId(user_id) {
    const person = await this.pool.query("select * from v_persons where user_id = '"+user_id+"';");
    return person.rows[0];
  }
  /*
    const personUser = await this.pool.query(
      "select persons.user_id, users.consent \n"+
      "from persons \n"+
      "join users \n"+
      "    on users.user_id = persons.user_id \n"+
      "where persons.person_id = '"+person_id+"' \n"+
      "limit 1;");
    const userInfo = personUser.rows[0]
    if (userInfo){
      if (userInfo.consent){
        return await this.findPersonByUserId(userInfo.user_id);
      } else {
        throw boom.unauthorized("User has not given consent.")
      }
    }else {
      throw boom.notFound("Person not found.")
    }
    */

}

module.exports = PersonsService;

