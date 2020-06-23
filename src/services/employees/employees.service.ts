/* tslint:disable */
import { MongoClient as mongo } from 'mongodb';
import query from '../../util/mongoClient';
import AWS from 'aws-sdk';
import { injectable } from 'inversify';
import IEmployeesService from './employees.interface';
import Employee from '@models/Employee';
import CreateEmployeeRequest from '@models/CreateEmployeeRequest';
import { employees, employee } from './employees.mockData';
import Name from '@models/Name';
import Title from '@models/Title';
import Practice from '@models/Practice';

@injectable()
class EmployeesService implements IEmployeesService {
  async getEmployees(): Promise<Employee[]> {
    // should be Promise<Employee[]>
    const something = await query();
    return something;
  }
  getEmployeeById(id: number): Employee | undefined {
    if (id === 1234) {
      return employee;
    }
    return undefined;
  }
  createEmployee(createEmployeeRequest: CreateEmployeeRequest): Employee {
    const createdEmployee: Employee = {
      id: Math.floor(Math.random() * 10000),
      name: createEmployeeRequest.name,
      email: createEmployeeRequest.email,
      title: Title.AN,
      practice: Practice.OE,
    };
    mongo.connect(
      'mongodb://localhost:27017',
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
      async (err, client) => {
        if (err) {
          console.error(err);
          return;
        }
        const collection = await client.db('test').collection('asdf');
        collection.insertOne(createdEmployee, (err, result) => {
          console.log(`Inserted ${createEmployeeRequest.name}`);
        });
        collection.find().toArray((err, items) => {
          console.log(items);
        });
      }
    );
    return createdEmployee;
  }
  updateEmployeeName(name: Name): Employee {
    const updatedEmployee: Employee = {
      id: 6789,
      name,
      email: 'example1234@company.com',
      title: Title.SP,
      practice: Practice.DA,
    };
    return updatedEmployee;
  }
  updateEmployeeEmail(email: string): Employee {
    const updatedEmployee: Employee = {
      id: 6789,
      name: {
        firstName: 'John',
        lastName: 'Smith',
      },
      email,
      title: Title.SA,
      practice: Practice.DL,
    };
    return updatedEmployee;
  }
  deleteEmployee(id: number): boolean {
    if (id !== 1234) throw new Error('Employee not found.');
    return true;
  }
}

export default EmployeesService;
