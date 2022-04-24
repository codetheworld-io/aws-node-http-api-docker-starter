/* eslint-disable global-require */
import { DocumentClient } from 'aws-sdk/clients/dynamodb';

jest.mock('aws-sdk/clients/dynamodb');

describe('DdbDoc', () => {
  it('should create instance with option when IS_OFFLINE="true"', () => {
    jest.isolateModules(() => {
      const endpoint = 'endpoint';
      const region = 'region';
      process.env.IS_OFFLINE = 'true';
      process.env.DYNAMO_ENDPOINT = endpoint;
      process.env.REGION = region;

      require('./ddb-doc');

      expect(DocumentClient).toHaveBeenCalledWith({
        endpoint,
        region,
        logger: {
          log: console.log,
        },
      });
    });
  });

  it('should create instance without option when IS_OFFLINE is falsy', () => {
    jest.isolateModules(() => {
      delete process.env.IS_OFFLINE;

      require('./ddb-doc');

      expect(DocumentClient).toHaveBeenCalledWith({});
    });
  });
});
