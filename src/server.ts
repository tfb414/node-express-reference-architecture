import 'reflect-metadata';
import express from 'express';
import bodyParser from 'body-parser';
import Controller from './controller';
import container from './inversify.config';
import { TYPES } from './types';
import { createConnection } from 'typeorm';
import { User } from './entity/User';

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
        await connection.manager.save(
          connection.manager.create(User, {
            firstName: 'thisis',
            lastName: 'atest',
            age: 27,
          })
        );
        await connection.manager.save(
          connection.manager.create(User, {
            firstName: 'asdfasdf',
            lastName: 'alsoatest',
            age: 24,
          })
        );
      })
      // tslint:disable-next-line:no-console
      .catch((error) => console.log(error));
  }
}

const app: App = new App();
