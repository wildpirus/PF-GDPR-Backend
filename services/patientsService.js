const boom = require('@hapi/boom');
const pool = require('../libs/postgresPool');

class PatientsService {

  constructor(){
    this.pool = pool;
    this.pool.on('error', (err) => console.error(err));
  }

  //Register
  async create(data) {
    const foundPatient = await this.pool.query(
      "select * from patient where numberid='"+data.numberid+"';"
    );
    if (foundPatient.rowCount>0) {
      throw boom.conflict('numberid in use');
    }
    const newPatient = data;//await new model(data);
    return {"message":"faker"}; //newPatient.rows;
  }

  //Get patient
  async findOne(numberid) {
    const query = "select * from patient where numberid = '"+numberid+"';";
    const patient =  await this.pool.query(query);
    if (patient.rowCount===0) {
      throw boom.notFound('Patient not found');
    }
    return {"message":"faker"}//patient;
  }

  /*async update(id, changes) {
    const patient = await this.findOne(id);
    const rta = await patient.update(changes);
    return rta;
  }

  async delete(id) {
    const patient = await this.findOne(id);
    await patient.destroy();
    return { id };
  }*/
}

module.exports = PatientsService;
