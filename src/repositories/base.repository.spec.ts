import BaseRepository from '@repositories/base.repository';
import ddbDoc from '@libs/ddb-doc';
import { AWSError, Request } from 'aws-sdk';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';

describe('BaseRepository', () => {
  const tableName = 'table-name';
  const key = { id: 'record-id' };
  const data = { ...key, attribute: 'some-attribute-value' };
  let repository: BaseRepository<typeof key, typeof data>;

  beforeEach(() => {
    repository = new class extends BaseRepository<typeof key, typeof data> {
      protected tableName = tableName;
    }();
  });

  describe('upsert()', () => {
    it('should call ddbDoc with correct parameters', async () => {
      jest.spyOn(ddbDoc, 'put').mockReturnValue({
        promise: jest.fn().mockResolvedValue(data),
      } as unknown as Request<DocumentClient.PutItemOutput, AWSError>);

      const actual = await repository.upsert(data);

      expect(ddbDoc.put).toHaveBeenCalledWith({
        TableName: tableName,
        Item: data,
      } as DocumentClient.PutItemInput);
      expect(actual).toBe(data);
    });
  });

  describe('getByKey()', () => {
    it('should call ddbDoc with correct parameters', async () => {
      jest.spyOn(ddbDoc, 'get').mockReturnValue({
        promise: jest.fn().mockResolvedValue({ Item: data } as DocumentClient.GetItemOutput),
      } as unknown as Request<DocumentClient.GetItemOutput, AWSError>);

      const actual = await repository.getByKey(key);

      expect(ddbDoc.get).toHaveBeenCalledWith({
        TableName: tableName,
        Key: key,
      } as DocumentClient.GetItemOutput);
      expect(actual).toBe(data);
    });
  });

  describe('updateByKey()', () => {
    it('should call ddbDoc with correct parameters', async () => {
      const updateObject = { attribute: 'new-attribute' };
      jest.spyOn(ddbDoc, 'update').mockReturnValue({
        promise: jest.fn().mockResolvedValue(
          { Attributes: data } as DocumentClient.UpdateItemOutput,
        ),
      } as unknown as Request<DocumentClient.UpdateItemOutput, AWSError>);

      const actual = await repository.updateByKey(key, updateObject);

      expect(ddbDoc.update).toHaveBeenCalledWith({
        TableName: tableName,
        Key: key,
        UpdateExpression: 'SET #attribute=:attribute',
        ExpressionAttributeNames: {
          '#attribute': 'attribute',
        },
        ExpressionAttributeValues: {
          ':attribute': 'new-attribute',
        },
        ReturnValues: 'ALL_NEW',
      } as DocumentClient.UpdateItemOutput);
      expect(actual).toBe(data);
    });
  });

  describe('deleteByKey()', () => {
    it('should call ddbDoc with correct parameters', async () => {
      jest.spyOn(ddbDoc, 'delete').mockReturnValue({
        promise: jest.fn().mockResolvedValue(Promise.resolve()),
      } as unknown as Request<DocumentClient.DeleteItemOutput, AWSError>);

      await repository.deleteByKey(key);

      expect(ddbDoc.delete).toHaveBeenCalledWith({
        TableName: tableName,
        Key: key,
      } as DocumentClient.GetItemOutput);
    });
  });
});
