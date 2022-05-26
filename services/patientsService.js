const boom = require('@hapi/boom');
const pool = require('../libs/postgresPool');
const jwt = require('jsonwebtoken');

const { config } = require('../config/config');

const UsersService = require('../services/usersService');
const PersonsService = require('../services/personsService');

const usersService = new UsersService();
const personsService = new PersonsService();

class PatientsService {

  constructor(){
    this.pool = pool;
    this.pool.on('error', (err) => console.error(err));
  }

  //-------------------------------Public methods--------------------------------//
  //Register all new patient
  async createAllNewPatient(data) {
    const {person_id, patient_id} = await personsService.isIdRegistered(data.person.id_number);
    if (person_id || patient_id){
      throw boom.conflict("There's someone already registered.");
    } else {
      const newUser = await usersService.create(data.user, data.person.email);
      const newPerson = await personsService.create(data.person, newUser.user_id);
      return await this.create(data.patient,newPerson.person_id);
    }
  }
  //Register new patient
  async create(newPatient,person_id){
    const foundPatient = await this.findPatientByPersonId(person_id);
    if (foundPatient) {
      throw boom.conflict('A patient already exist for this person.');
    }
    await this.pool.query(
      "insert into patients values('0','"+
        newPatient.height+"','"+
        newPatient.weight+"','"+
        newPatient.rh+"','"+
        person_id+"');"
    );
    return { created: true };//this.viewPatientData(data.person_id);
  }

  //-------------------------------Private methods-------------------------------//
  async findPatientByPersonId(person_id) {
    const foundPatient = await this.pool.query(
      "select * from patients where person_id = '"+person_id+"';"
    );
    return foundPatient.rows[0];
  }
  async viewPatientData(person_id){
    const query = "select * from view_all_patient_data_desencrypted('"+person_id+"');"
    const result = await this.pool.query(query);
    return result.rows[0];
  }
  /*
  async viewPatientDataForEmployee(person_id){
    const foundPatient = this.findPatientByPersonId(person_id);
    if (!foundPatient) {
      throw boom.notFound('Patient not found');
    } else {
      try {
        const payload = jwt.verify(foundPatient.consent_token, config.jwtSecret);
        const patient = await this.viewPatientData(payload.person_id);
        if (patient.rowCount===0) {
          throw boom.unauthorized();
        }
        return patient.rows[0];
      } catch (error) {
        throw boom.unauthorized();
      }
    }
  }
  */
}

module.exports = PatientsService;
