import {faker} from '@faker-js/faker';
import * as argon2 from 'argon2';
import {IClient} from '../../../mongo/client/definitions';
import {IToken} from '../../../mongo/token/definitions';
import {IUser} from '../../../mongo/user/definitions';
import {getDateString} from '../../../utilities/fns';
import {IBaseContext} from '../../contexts/IBaseContext';
import {IBaseTokenData} from '../../contexts/TokenContext';
import {testData} from '../data/data';
import {setupTestClient} from './setupTestClient';
import {setupTestToken} from './setupTestToken';

export interface ISetupTestUserResult {
  user: IUser;
  client: IClient;
  token: IToken;
  incomingTokenData: IBaseTokenData;
  context: IBaseContext;
}

export async function setupTestUser(context: IBaseContext): Promise<ISetupTestUserResult> {
  const inputUser: Omit<IUser, 'customId'> = {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    email: faker.internet.email(),
    hash: await argon2.hash(testData.testUser00.password),
    createdAt: getDateString(),
    forgotPasswordHistory: [],
    passwordLastChangedAt: '',
    workspaces: [],
    color: faker.color.rgb({format: 'hex', casing: 'lower'}),
    notificationsLastCheckedAt: '',
  };

  const user = await context.user.saveUser(context, inputUser);
  const {client} = await setupTestClient(context);
  const {token, incomingTokenData} = await setupTestToken(context, {
    user,
    client,
  });

  const result: ISetupTestUserResult = {
    context,
    user,
    client,
    token,
    incomingTokenData,
  };

  return result;
}
