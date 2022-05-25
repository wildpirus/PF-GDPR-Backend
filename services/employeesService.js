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
    const {person, employee} = await personsService.isIdRegistered(data.person.id_number);
    if (person || employee){
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

  //-------------------------------Private methods-------------------------------//
  async findEmployeeByPersonId(person_id) {
    const foundEmployee = await this.pool.query(
      "select * from employees where person_id = '"+person_id+"';"
    );
    return foundEmployee.rows[0];
  }
}

module.exports = EmployeesService;
