/* eslint-disable no-useless-constructor */
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import ddbDoc from '@libs/ddb-doc';

export type QueryInput = Omit<DocumentClient.QueryInput, 'TableName'>;

export interface IPagingData<TModel, TKey extends DocumentClient.Key = DocumentClient.Key> {
  data: TModel[],
  lastEvaluatedKey?: TKey;
}

export default abstract class BaseRepository<TKey extends DocumentClient.Key, TModel extends TKey> {
  protected abstract readonly tableName: string;

  async upsert(item: TKey & Partial<TModel>): Promise<TModel> {
    const params: DocumentClient.PutItemInput = {
      TableName: this.tableName,
      Item: item,
    };

    await ddbDoc.put(params).promise();

    return item as TModel;
  }

  async getByKey(key: TKey): Promise<TModel | null> {
    const params: DocumentClient.GetItemInput = {
      TableName: this.tableName,
      Key: key,
    };

    const response = await ddbDoc.get(params).promise();

    return response.Item as TModel;
  }

  async updateByKey(key: TKey, updateObject: Partial<TModel>): Promise<TModel> {
    const updateExpressions: string[] = [];
    const expressionAttributeNames: DocumentClient.ExpressionAttributeNameMap = {};
    const expressionAttributeValues: DocumentClient.ExpressionAttributeValueMap = {};

    for (const [name, value] of Object.entries(updateObject)) {
      const attributeName = `#${name}`;
      const attributeValue = `:${name}`;
      expressionAttributeNames[attributeName] = name;
      expressionAttributeValues[attributeValue] = value;
      updateExpressions.push(`${attributeName}=${attributeValue}`);
    }

    const params: DocumentClient.UpdateItemInput = {
      TableName: this.tableName,
      Key: key,
      UpdateExpression: `SET ${updateExpressions.join(', ')}`,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: 'ALL_NEW',
    };

    const { Attributes } = await ddbDoc.update(params).promise();

    return Attributes as TModel;
  }

  async deleteByKey(key: TKey): Promise<void> {
    const params: DocumentClient.DeleteItemInput = {
      TableName: this.tableName,
      Key: key,
    };

    await ddbDoc.delete(params).promise();
  }

  protected async query(query: QueryInput): Promise<IPagingData<TModel, TKey>> {
    const params: DocumentClient.QueryInput = {
      TableName: this.tableName,
      ...query,
    };

    const { Items, LastEvaluatedKey } = await ddbDoc.query(params).promise();

    return {
      data: Items as TModel[],
      lastEvaluatedKey: LastEvaluatedKey as TKey,
    };
  }
}
