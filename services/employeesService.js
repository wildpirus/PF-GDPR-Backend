const boom = require('@hapi/boom');
const pool = require('../libs/postgresPool');
const jwt = require('jsonwebtoken');

const { config } = require('../config/config');

const UsersService = require('../services/usersService');
const PersonsService = require('../services/personsService');

const usersService = new UsersService();
const personsService = new PersonsService();

class EmployeesService {

  constructor(){
    this.pool = pool;
    this.pool.on('error', (err) => console.error(err));
  }

  //-------------------------------Public methods--------------------------------//
  //Register all new employee
  async createAllNewEmployee(data) {
    const {person_id, employee_id} = await personsService.isIdRegistered(data.person.id_number);
    if (person_id || employee_id){
      await personsService.sendWarningEmail(person_id);
      throw boom.conflict("There's someone already registered.");
    } else {
      const newUser = await usersService.create(data.user, data.person.email);
      const newPerson = await personsService.create(data.person, newUser.user_id);
      return await this.create(data.employee,newPerson.person_id);
    }
  }

  //Register new employee
  async create(newEmployee,person_id){
    const foundEmployee = await this.findEmployeeByPersonId(person_id);
    if (foundEmployee) {
      throw boom.conflict('A employee already exist for this person.');
    }
    await this.pool.query(
      "insert into employees values('0','"+
        newEmployee.role_name+"','"+
        person_id+"');"
    );
    return { created: true };//this.viewEmployeeData(data.person_id);
  }

  //get employee data
  async getEmployeeData(employee_id){
    const query = (
      "select v_persons.*, employees.* \n"+
      "from employees \n"+
      "join v_persons \n"+
      "    on v_persons.person_id = employees.person_id \n"+
      "where employees.employee_id = '"+employee_id+"' \n"+
      "limit 1;"
    );
    const result = await this.pool.query(query);
    const data = result.rows[0];
    if (data){
      delete data.person_id;
      delete data.user_id;
      delete data.attendant_id;
      delete data.employee_id;
      return data;
    } else {
      throw boom.notFound("Employee not found");
    }
  }

  // Get appointments info
  async getAppointmentInfo(employee_id){
    const query = (
      "select care.careid, \n"+
      "       care.patient_id, \n"+
      "       v_persons.first_name, \n"+
      "       v_persons.last_name, \n"+
      "       date_part('year', age(v_persons.birth_date::date))::int, \n"+
      "       care.reason, \n"+
      "       care.care_date \n"+
      "from care \n"+
      "join patients \n"+
      "    on patients.patient_id = care.patient_id \n"+
      "join v_persons \n"+
      "    on v_persons.person_id = patients.person_id \n"+
      "where care.employee_id = '"+employee_id+"';"
    );
    const result = await this.pool.query(query);
    const data = result.rows;
    if (data){
      return data;
    } else {
      throw boom.notFound("You have no appointments");
    }
  }
  //-------------------------------Private methods-------------------------------//
  async findEmployeeByPersonId(person_id) {
    const foundEmployee = await this.pool.query(
      "select * from employees where person_id = '"+person_id+"';"
    );
    return foundEmployee.rows[0];
  }
}

module.exports = EmployeesService;
