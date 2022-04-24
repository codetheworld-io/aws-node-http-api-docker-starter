import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import {
  createAPIGatewayProxyHandler,
  ICustomAPIGatewayProxyHandler,
  IRouter,
} from './api-gateway';
import AppError from './app.error';
import * as utils from './helpers';

describe('ApiGateway', () => {
  const greeting = { message: 'Hello World!!!' };
  const router: IRouter = {
    handler: jest.fn().mockName('handler') as unknown as ICustomAPIGatewayProxyHandler,
    method: 'POST',
    resource: '/hello',
  };
  const body = { from: 'aws-node-http-api-docker-starter' };
  const event = {
    httpMethod: 'POST',
    resource: '/hello',
    body: JSON.stringify(body),
  } as APIGatewayProxyEvent;
  const context = {} as Context;
  const callback = jest.fn();

  const apiGatewayResponse = {
    statusCode: 200,
    body: 'json-string',
  } as APIGatewayProxyResult;

  beforeEach(() => {
    jest.mocked(router.handler).mockResolvedValue(greeting);
    jest.spyOn(console, 'error');
    jest.spyOn(utils, 'formatJSONResponse').mockReturnValue(apiGatewayResponse);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('createAPIGatewayProxyHandler()', () => {
    it.each([
      { httpMethod: 'GET' },
      { resource: '/hi' },
    ])('should response with status 404 when router is not found', async (partialEvent) => {
      const newEvent = { ...event, ...partialEvent } as APIGatewayProxyEvent;
      const actual = await createAPIGatewayProxyHandler([router])(
        newEvent,
        context,
        callback,
      );

      expect(router.handler).not.toHaveBeenCalled();
      expect(utils.formatJSONResponse)
        .toHaveBeenCalledWith({ message: `${newEvent.httpMethod} ${newEvent.resource} not found!` }, 404);
      expect(actual).toEqual(apiGatewayResponse);
    });

    it('should pass body to handler when event body is existed', async () => {
      await createAPIGatewayProxyHandler([router])(event, context, callback);

      expect(router.handler).toHaveBeenCalledWith({
        ...event,
        body,
      });
    });

    it('should pass body as {} to handler when event body is not existed', async () => {
      await createAPIGatewayProxyHandler([router])({ ...event, body: null }, context, callback);

      expect(router.handler).toHaveBeenCalledWith({
        ...event,
        body: {},
      });
    });

    it('should response handler result when found a router', async () => {
      const actual = await createAPIGatewayProxyHandler([router])(event, context, callback);

      expect(utils.formatJSONResponse).toHaveBeenCalledWith(greeting);
      expect(actual).toEqual(apiGatewayResponse);
    });

    it('should response with status 400 when handler throw AppError', async () => {
      const error = new AppError('Something went wrong!');
      jest.mocked(router.handler).mockRejectedValue(error);

      const actual = await createAPIGatewayProxyHandler([router])(event, context, callback);

      expect(console.error).toHaveBeenCalledWith(error);
      expect(utils.formatJSONResponse).toHaveBeenCalledWith({ message: error.message }, 400);
      expect(actual).toEqual(apiGatewayResponse);
    });

    it('should response with status 500 when handler throw unexpected exception', async () => {
      const error = new Error('Something went wrong!');
      jest.mocked(router.handler).mockRejectedValue(error);

      const actual = await createAPIGatewayProxyHandler([router])(event, context, callback);

      expect(console.error).toHaveBeenCalledWith(error);
      expect(utils.formatJSONResponse).toHaveBeenCalledWith({ message: error.message }, 500);
      expect(actual).toEqual(apiGatewayResponse);
    });
  });
});
