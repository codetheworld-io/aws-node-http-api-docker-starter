import { createAPIGatewayProxyHandler } from '@libs/api-gateway';
import routers from './movie.router';

export const main = createAPIGatewayProxyHandler(routers);
