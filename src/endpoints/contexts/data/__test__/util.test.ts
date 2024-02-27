import {FilterQuery} from 'mongoose';
import {DataQuery} from '../types';
import {BaseMongoDataProvider} from '../utils';

describe('data provider util', () => {
  test('BaseMongoDataProvider.getMongoQuery', async () => {
    type T = {
      outer01: {inner01: boolean; inner02: number};
      outer02: {inner01: number};
      comp01: string;
      num01: number;
      arr01: Array<{inner01: boolean; inner02: number}>;
    };
    const DataQuery: DataQuery<T> = {
      outer01: {$objMatch: {inner01: true, inner02: 1}},
      outer02: {$objMatch: {inner01: {$eq: 2}}},
      comp01: {$eq: 'empty'},
      num01: {$gt: 1},
      arr01: {
        $elemMatch: {
          inner01: {$eq: true},
          inner02: {$in: [1]},
        },
      },
    };

    const mongoQuery = BaseMongoDataProvider.getMongoQuery(DataQuery);
    const expectedQuery: FilterQuery<T> = {
      'outer01.inner01': true,
      'outer01.inner02': 1,
      'outer02.inner01': {$eq: 2},
      comp01: {$eq: 'empty'},
      num01: {$gt: 1},
      arr01: {
        $elemMatch: {
          inner01: {$eq: true},
          inner02: {$in: [1]},
        },
      },
    };

    expect(mongoQuery).toStrictEqual(expectedQuery);
  });
});
