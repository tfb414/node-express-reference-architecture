import 'reflect-metadata';
import express from 'express';
import bodyParser from 'body-parser';
import Controller from './controller';
import container from './inversify.config';
import { TYPES } from './types';
import { createConnection } from 'typeorm';
import { Meeting as MeetingEntity } from './entity/Meeting';
import { Employee as EmployeeEntity } from './entity/Employee';

class App {
  public app!: express.Application;

  constructor() {
    createConnection()
      .then(async (connection) => {
        this.app = express();
        this.app.use(bodyParser.json());
        const controllers = [
          container.get<Controller>(TYPES.EmployeesController),
          container.get<Controller>(TYPES.MeetingsController),
        ];
        controllers.forEach((controller) => {
          this.app.use(controller.basePath, controller.router);
        });
        this.app.get('/', (req, res, next) => {
          res.send('Healthy');
        });
        this.app.listen(8080, () => {
          // tslint:disable-next-line:no-console
          console.log(`Server listening http://localhost:8080/`);
        });
        // insert new users for test
        const meeting = {
          scheduledTime: '2020-09-08T04:46:46+0000',
        };
        const meetingRepository = connection.getRepository(MeetingEntity);
        await meetingRepository.save(meeting);
        console.log('saved meeting');
        const employee = {
          id: 1234,
        };
        const employeeRepository = connection.getRepository(EmployeeEntity);
        await employeeRepository.save(employee);
        console.log('saved employee');
      })
      // tslint:disable-next-line:no-console
      .catch((error) => console.log(error));
  }
}

const app: App = new App();
