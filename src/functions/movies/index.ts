import { handlerPath } from '@libs/handler-resolver';
import routers from './movie.router';

export const manageMovies = {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: routers.map((router) => {
    return {
      http: {
        path: router.resource,
        method: router.method,
      },
    };
  }),
};
