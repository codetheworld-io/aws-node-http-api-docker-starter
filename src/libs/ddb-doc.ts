import DynamoDB, { DocumentClient } from 'aws-sdk/clients/dynamodb';

let options: DocumentClient.DocumentClientOptions & DynamoDB.Types.ClientConfiguration = {};

if (process.env.IS_OFFLINE === 'true') {
  options = {
    endpoint: process.env.DYNAMO_ENDPOINT,
    region: process.env.REGION,
    logger: {
      log: console.log,
    },
  };
}

export default new DocumentClient(options);
