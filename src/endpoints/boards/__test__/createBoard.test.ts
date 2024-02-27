import {IBoard} from '../../../mongo/block/board';
import {getTestBaseContext} from '../../testUtils/contexts/TestBaseContext';
import {chance} from '../../testUtils/data/data';
import {setupTestBoardWithEndpoint} from '../../testUtils/setups/setupTestBoardWithEndpoint';
import {setupTestExpressRequestWithToken} from '../../testUtils/setups/setupTestExpressRequest';
import {setupTestOrganizationWithEndpoint} from '../../testUtils/setups/setupTestOrganizationWithEndpoint';
import {setupTestUser} from '../../testUtils/setups/setupTestUser';
import {INewBoardInput} from '../types';
import {assertBoard} from '../utils';

const context = getTestBaseContext();

afterAll(async () => {
  await context.close();
});

describe('create board', () => {
  test('can create board', async () => {
    const {token} = await setupTestUser(context);
    const {req} = setupTestExpressRequestWithToken({token});
    const {organization} = await setupTestOrganizationWithEndpoint(context, req);
    const input: INewBoardInput = {
      name: chance.company(),
      description: chance.sentence({words: 15}),
      color: chance.color({format: 'hex'}),
      workspaceId: organization.customId,
      boardLabels: [],
      boardResolutions: [],
      boardStatuses: [],
    };

    const result = await setupTestBoardWithEndpoint(context, req, organization.customId, input);
    expect(result?.board).toMatchObject(input);
    const board = await context.data.board.getOneByQuery<IBoard>(context, {
      customId: result?.board.customId,
    });
    assertBoard(board);
    expect(result?.board.customId).toEqual(board.customId);
  });
});
