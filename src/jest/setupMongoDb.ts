import {format} from 'date-fns';
import mongoose from 'mongoose';
import {IAppVariables} from '../resources/appVariables';

export async function setupMongoDb(vars: Partial<IAppVariables>, testType = 'test') {
  let dbName = vars.mongoDbURI;
  const mongoDbURI = vars.mongoDbURI;
  if (!mongoDbURI) {
    return;
  }

  if (!dbName) {
    const formattedDate = format(new Date(), 'MMM-d-YYY');
    dbName = `fimidara-node-${testType}-${formattedDate}`;
    vars.mongoDbURI = dbName;
    process.env['MONGODB_URI'] = dbName;
    const mongoClient = new mongoose.mongo.MongoClient(mongoDbURI);
    await mongoClient.connect();
    mongoClient.db(dbName);
    await mongoClient.close();
  }
}
