import { ICustomAPIGatewayProxyEvent } from '@libs/api-gateway';
import { ICreateMovieDTO, UpdateMovieInfoDTO } from '@repositories/movie.repository';
import * as movieService from '@functions/movies/movie.service';

export function createMovie(event: ICustomAPIGatewayProxyEvent<ICreateMovieDTO>) {
  const { body } = event;

  return movieService.createMovie(body);
}

export function getMoviesByYear(event: ICustomAPIGatewayProxyEvent) {
  const year = Number(event.pathParameters?.year);
  const nextPageToken = event.queryStringParameters?.nextPageToken;

  return movieService.getMoviesByYear(year, nextPageToken);
}

export function getMovieDetail(event: ICustomAPIGatewayProxyEvent) {
  const title = event.pathParameters?.title as string;
  const year = Number(event.pathParameters?.year);

  return movieService.getMoviesByTitleAndYear(title, year);
}

export function deleteMove(event: ICustomAPIGatewayProxyEvent) {
  const title = event.pathParameters?.title as string;
  const year = Number(event.pathParameters?.year);

  return movieService.deleteMovieByTitleAndYear(title, year);
}

export function updateMovieInfo(event: ICustomAPIGatewayProxyEvent<UpdateMovieInfoDTO>) {
  const title = event.pathParameters?.title as string;
  const year = Number(event.pathParameters?.year);

  return movieService.updateMovieInfoByTitleAndYear(title, year, event.body);
}
