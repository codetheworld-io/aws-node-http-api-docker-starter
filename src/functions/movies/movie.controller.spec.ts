import {
  APIGatewayProxyEventPathParameters,
  APIGatewayProxyEventQueryStringParameters,
} from 'aws-lambda/trigger/api-gateway-proxy';

import * as movieService from '@functions/movies/movie.service';
import { IMoviesByYearResponse } from '@functions/movies/movie.service';
import {
  ICreateMovieDTO,
  IMovie,
  UpdateMovieInfoDTO,
} from '@repositories/movie.repository';
import { ICustomAPIGatewayProxyEvent } from '@libs/api-gateway';
import * as controller from './movie.controller';

describe('MovieController', () => {
  describe('createMovie()', () => {
    it('should return create a new movie', async () => {
      const newMovie = 'new-movie' as unknown as IMovie;
      const dto = { title: 'new-movie-title', year: 2000 } as ICreateMovieDTO;
      jest.spyOn(movieService, 'createMovie')
        .mockName('movieService.createMovie')
        .mockResolvedValue(newMovie);

      const actual = await controller.createMovie({
        body: dto,
      } as ICustomAPIGatewayProxyEvent<ICreateMovieDTO>);

      expect(movieService.createMovie).toHaveBeenCalledWith(dto);
      expect(actual).toBe(newMovie);
    });
  });

  describe('getMoviesByYear()', () => {
    it('should return moves by year', async () => {
      const movies = {
        data: ['movies'] as unknown as IMovie[],
        nextPageToken: 'next-page-token',
      } as IMoviesByYearResponse;
      jest.spyOn(movieService, 'getMoviesByYear')
        .mockName('movieService.getMoviesByYear')
        .mockResolvedValue(movies);
      const pathParameters = {
        year: '2000',
      } as APIGatewayProxyEventPathParameters;
      const queryStringParameters = {
        nextPageToken: 'old-next-page-token',
      } as APIGatewayProxyEventQueryStringParameters;

      const actual = await controller.getMoviesByYear(
        {
          pathParameters,
          queryStringParameters,
        } as ICustomAPIGatewayProxyEvent,
      );

      expect(movieService.getMoviesByYear).toHaveBeenCalledWith(2000, 'old-next-page-token');
      expect(actual).toBe(movies);
    });
  });

  describe('getMovieDetail()', () => {
    it('should return move detail', async () => {
      const movie = 'movie' as unknown as IMovie;
      jest.spyOn(movieService, 'getMoviesByTitleAndYear')
        .mockName('movieService.getMoviesByTitleAndYear')
        .mockResolvedValue(movie);
      const pathParameters = {
        title: 'Big Momma\'s House',
        year: '2000',
      } as APIGatewayProxyEventPathParameters;

      const actual = await controller.getMovieDetail(
        {
          pathParameters,
        } as ICustomAPIGatewayProxyEvent,
      );

      expect(movieService.getMoviesByTitleAndYear)
        .toHaveBeenCalledWith('Big Momma\'s House', 2000);
      expect(actual).toBe(movie);
    });
  });

  describe('deleteMovie()', () => {
    it('should delete a movie by title and year', async () => {
      jest.spyOn(movieService, 'deleteMovieByTitleAndYear')
        .mockName('movieService.deleteMovieByTitleAndYear')
        .mockResolvedValue();

      const pathParameters = {
        title: 'Big Momma\'s House',
        year: '2000',
      } as APIGatewayProxyEventPathParameters;

      await controller.deleteMove({
        pathParameters,
      } as ICustomAPIGatewayProxyEvent);

      expect(movieService.deleteMovieByTitleAndYear)
        .toHaveBeenCalledWith('Big Momma\'s House', 2000);
    });
  });

  describe('updateMovieInfo()', () => {
    it('should update movie info by title and year', async () => {
      const updatedMovie = 'updated-movie' as unknown as IMovie;
      jest.spyOn(movieService, 'updateMovieInfoByTitleAndYear')
        .mockName('movieService.updateMovieInfoByTitleAndYear')
        .mockResolvedValue(updatedMovie);
      const pathParameters = {
        title: 'Big Momma\'s House',
        year: '2000',
      } as APIGatewayProxyEventPathParameters;
      const info = 'new-info' as unknown as UpdateMovieInfoDTO;

      const actual = await controller.updateMovieInfo({
        body: info,
        pathParameters,
      } as ICustomAPIGatewayProxyEvent<UpdateMovieInfoDTO>);

      expect(movieService.updateMovieInfoByTitleAndYear).toHaveBeenCalledWith(
        'Big Momma\'s House',
        2000,
        info,
      );
      expect(actual).toBe(updatedMovie);
    });
  });
});
