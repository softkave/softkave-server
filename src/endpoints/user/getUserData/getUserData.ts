import {clientToClientUserView} from '../../clients/utils';
import {JWTTokenScope} from '../../types';
import {fireAndForgetPromise} from '../../utils';
import {getPublicUserData} from '../utils';
import {GetUserDataEndpoint} from './types';

const getUserData: GetUserDataEndpoint = async (ctx, reqData) => {
  const user = await ctx.session.getUser(ctx, reqData, JWTTokenScope.Login, true);
  const tokenData = await ctx.session.getTokenData(ctx, reqData, true);
  const token = ctx.token.encodeToken(ctx, tokenData.customId);
  const client = await ctx.session.getClient(ctx, reqData);
  fireAndForgetPromise(ctx.unseenChats.removeEntry(ctx, user.customId));
  return {
    token,
    user: getPublicUserData(user),
    client: clientToClientUserView(client, user.customId),
  };
};

export default getUserData;
9;
