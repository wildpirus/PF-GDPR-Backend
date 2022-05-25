const boom = require('@hapi/boom');
const pool = require('../libs/postgresPool');

class PersonsService {

  constructor(){
    this.pool = pool;
    this.pool.on('error', (err) => console.error(err));
  }

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

  async findPersonByUserId(user_id) {
    const person = await this.pool.query("select * from v_persons where user_id = '"+user_id+"';");
    return person.rows[0];
  }

  async findPersonById(person_id){
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
  }

}

module.exports = PersonsService;

