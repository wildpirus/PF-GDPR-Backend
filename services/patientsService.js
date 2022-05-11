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
      "select * from v_patient where numberid='"+data.numberid+"';"
    );
    if (foundPatient.rowCount>0) {
      throw boom.conflict('numberid in use');
    }
    await this.pool.query(
      "insert into patient values"+
      "('0','"+data.firstname+
      "','"+data.lastname+
      "','"+data.typeid+
      "','"+data.numberid+
      "','"+data.expeditiondateid+
      "','"+data.birthdate+
      "','"+data.expeditionplaceid+
      "','"+data.civilstate+
      "','"+data.email+
      "','"+data.userid+
      "');"
    );
    return this.findOne(data.numberid);
  }

  //Get patient
  async findOne(numberid) {
    const query = "select * from v_patient where numberid = '"+numberid+"';";
    const patient =  await this.pool.query(query);
    if (patient.rowCount===0) {
      throw boom.notFound('Patient not found');
    }
    return patient.rows[0];//patient;
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
