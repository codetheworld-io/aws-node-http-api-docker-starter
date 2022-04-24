import { APIGatewayProxyResult } from 'aws-lambda';
import { formatJSONResponse } from './helpers';

describe('Helpers', () => {
  describe('formatJSONResponse()', () => {
    it('should return APIGatewayProxyResult with default status code and json string as body', () => {
      const actual = formatJSONResponse({ message: 'Hello!' });

      expect(actual).toEqual({
        statusCode: 200,
        body: '{"message":"Hello!"}',
      } as APIGatewayProxyResult);
    });

    it('should return APIGatewayProxyResult with custom status code', () => {
      const actual = formatJSONResponse({ message: 'Hello!' }, 400);

      expect(actual).toEqual({
        statusCode: 400,
        body: '{"message":"Hello!"}',
      } as APIGatewayProxyResult);
    });
  });
});
