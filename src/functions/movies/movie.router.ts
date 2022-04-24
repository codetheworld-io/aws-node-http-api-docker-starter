import { IRouter } from '@libs/api-gateway';
import * as controller from './movie.controller';

const ROOT_PATH = '/movies';

const routers: IRouter[] = [
  {
    method: 'GET',
    resource: `${ROOT_PATH}/{year}`,
    handler: controller.getMoviesByYear,
  },
  {
    method: 'GET',
    resource: `${ROOT_PATH}/{title}/{year}`,
    handler: controller.getMovieDetail,
  },
  {
    method: 'POST',
    resource: `${ROOT_PATH}`,
    handler: controller.createMovie,
  },
  {
    method: 'DELETE',
    resource: `${ROOT_PATH}/{title}/{year}`,
    handler: controller.deleteMove,
  },
  {
    method: 'PUT',
    resource: `${ROOT_PATH}/{title}/{year}`,
    handler: controller.updateMovieInfo,
  },
];

export default routers;
