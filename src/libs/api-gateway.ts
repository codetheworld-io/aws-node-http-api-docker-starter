import { APIGatewayProxyHandler, APIGatewayProxyEvent } from 'aws-lambda';
import AppError from './app.error';
import { formatJSONResponse } from './helpers';

export interface ICustomAPIGatewayProxyEvent<TBody = unknown> extends Omit<APIGatewayProxyEvent, 'body'> {
  body: TBody;
}

export interface ICustomAPIGatewayProxyHandler<TBody = unknown, TResult = unknown> {
  (event: ICustomAPIGatewayProxyEvent<TBody>): Promise<TResult>;
}

export interface IRouter {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
  resource: string,
  handler: ICustomAPIGatewayProxyHandler;
}

export function createAPIGatewayProxyHandler(
  routers: IRouter[],
): APIGatewayProxyHandler {
  return async (event) => {
    try {
      const { httpMethod, resource } = event;
      const foundRouter = routers.find((router) => {
        return router.method === httpMethod && router.resource === resource;
      });

      if (!foundRouter) {
        return formatJSONResponse({ message: `${httpMethod.toUpperCase()} ${resource} not found!` }, 404);
      }

      const result = await foundRouter.handler({
        ...event,
        body: event.body ? JSON.parse(event.body) : {},
      });

      return formatJSONResponse(result);
    } catch (e: unknown) {
      console.error(e);

      const error = e as Error;
      let statusCode = 500;

      if (error instanceof AppError) {
        statusCode = 400;
      }

      return formatJSONResponse({ message: error.message }, statusCode);
    }
  };
}
