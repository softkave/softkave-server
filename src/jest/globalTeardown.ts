import _ = require('lodash');
import mongoose from 'mongoose';
import {appVariables, IAppVariables} from '../resources/appVariables';
import logger from '../utilities/logger';
import {dropMongoConnection} from '../utilities/mongo';

async function waitOnPromises(promises: Promise<any>[]) {
  (await Promise.allSettled(promises)).forEach(
    result => result.status === 'rejected' && logger.error(result.reason)
  );
}

async function dropMongoCollections(globals: IAppVariables) {
  const mongoURI = globals.mongoDbURI;
  const appDbName = globals.dbName;
  if (!mongoURI) {
    return;
  }

  async function dropFn(name?: string) {
    if (!name) {
      return;
    }

    logger.info(`Dropping db - ${name}`);
    const connection = await mongoose.createConnection(mongoURI, {dbName: name}).asPromise();
    dropMongoConnection(connection);
  }

  await waitOnPromises([dropFn(appDbName)]);
}

async function jestGlobalTeardown() {
  const dropMongoPromise = dropMongoCollections(appVariables);
  await waitOnPromises([dropMongoPromise]);
}

module.exports = jestGlobalTeardown;
