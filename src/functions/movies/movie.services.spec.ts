import movieRepository, {
  ICreateMovieDTO,
  UpdateMovieInfoDTO,
} from '@repositories/movie.repository';
import AppError from '@libs/app.error';
import * as movieService from '@functions/movies/movie.service';
import { IMovie, IMovieKey, IMovieInfo } from '@models/movie.model';
import { IMoviesByYearResponse } from './movie.service';

describe('MovieService', () => {
  describe('createMovie()', () => {
    const dto: ICreateMovieDTO = { title: 'new movie title', year: 2000 };

    beforeEach(() => {
      jest.spyOn(movieRepository, 'getByKey')
        .mockName('movieRepository.getByKey');
      jest.spyOn(movieRepository, 'upsert')
        .mockName('movieRepository.upsert');
    });

    it('should throw error when the error is already existed', async () => {
      jest.mocked(movieRepository.getByKey)
        .mockResolvedValue('existed-movie' as unknown as IMovie);

      const promise = movieService.createMovie(dto);

      expect(movieRepository.getByKey).toHaveBeenCalledWith({ title: dto.title, year: dto.year });
      await expect(promise).rejects.toThrowError(AppError);
      await expect(promise).rejects.toThrow('Movie already existed');
      expect(movieRepository.upsert).not.toHaveBeenCalled();
    });

    it('should create and return new movie when the movie is not existed', async () => {
      const newMovie = 'new movie' as unknown as IMovie;
      jest.mocked(movieRepository.getByKey).mockResolvedValue(null);
      jest.mocked(movieRepository.upsert).mockResolvedValue(newMovie);

      const actual = await movieService.createMovie(dto);

      expect(movieRepository.getByKey).toHaveBeenCalledWith({ title: dto.title, year: dto.year });
      expect(movieRepository.upsert).toHaveBeenCalledWith(dto);
      expect(actual).toBe(newMovie);
    });
  });

  describe('getMoviesByYear()', () => {
    const year = 2000;
    const limit = 10;
    const nextPageTokenObject = { title: 'any movie title', year: 1999 };
    const nextPageToken = JSON.stringify(nextPageTokenObject);

    beforeEach(() => {
      jest.spyOn(movieRepository, 'listMoviesByYear')
        .mockName('movieRepository.listMoviesByYear')
        .mockResolvedValue({ data: [] });
    });

    it('should call repo function with nextPageTokenObject to object when there is nextPageToken', async () => {
      await movieService.getMoviesByYear(year, nextPageToken);

      expect(movieRepository.listMoviesByYear)
        .toHaveBeenCalledWith(year, limit, nextPageTokenObject);
    });

    it('should call repo function without nextPageToken to object when there is no nextPageToken', async () => {
      await movieService.getMoviesByYear(year, undefined);

      expect(movieRepository.listMoviesByYear).toHaveBeenCalledWith(year, limit, undefined);
    });

    it('should response with correct movie data', async () => {
      const movie1 = {
        title: 'any movie title 1',
        year: 2000,
        info: { rank: 1, image_url: 'any_image_url_1' },
      } as IMovie;
      const movie2 = {
        title: 'any movie title 2',
        year: 2000,
        info: { rank: 2, image_url: 'any_image_url_2' },
      } as IMovie;
      jest.mocked(movieRepository.listMoviesByYear).mockResolvedValue({
        data: [movie1, movie2],
      });

      const actual = await movieService.getMoviesByYear(year, nextPageToken);

      expect(actual).toEqual({
        data: [
          { title: movie1.title, year: movie1.year, info: { image_url: movie1.info.image_url } },
          { title: movie2.title, year: movie2.year, info: { image_url: movie2.info.image_url } },
        ],
      } as IMoviesByYearResponse);
    });

    it('should response with nextPageToken string', async () => {
      jest.mocked(movieRepository.listMoviesByYear).mockResolvedValue({
        data: [],
        lastEvaluatedKey: nextPageTokenObject,
      });

      const actual = await movieService.getMoviesByYear(year, nextPageToken);
      expect(actual).toEqual({
        data: [],
        nextPageToken: '%7B%22title%22%3A%22any%20movie%20title%22%2C%22year%22%3A1999%7D',
      } as IMoviesByYearResponse);
    });
  });

  describe('getMoviesByTitleAndYear()', () => {
    const title = 'any movie title';
    const year = 2000;

    beforeEach(() => {
      jest.spyOn(movieRepository, 'getByKey')
        .mockName('movieRepository.getByKey');
    });

    it('should return movie detail when movie is existed', async () => {
      const movie = 'movie-detail' as unknown as IMovie;
      jest.mocked(movieRepository.getByKey).mockResolvedValue(movie);

      const actual = await movieService.getMoviesByTitleAndYear(title, year);

      expect(movieRepository.getByKey).toHaveBeenCalledWith({ title, year });
      expect(actual).toBe(movie);
    });

    it('should throw error when movie is not existed', async () => {
      jest.mocked(movieRepository.getByKey).mockResolvedValue(null);

      const promise = movieService.getMoviesByTitleAndYear(title, year);

      await expect(promise).rejects.toThrow(AppError);
      await expect(promise).rejects.toThrow('Movie not found!');
    });
  });

  describe('deleteMovieByTitleAndYear()', () => {
    it('should delete movie by title and year', async () => {
      jest.spyOn(movieRepository, 'deleteByKey')
        .mockName('movieRepository.deleteByKey')
        .mockResolvedValue();
      const title = 'any movie title';
      const year = 2000;

      await movieService.deleteMovieByTitleAndYear(title, year);

      expect(movieRepository.deleteByKey).toHaveBeenCalledWith({ title, year });
    });
  });

  describe('updateMovieInfoByTitleAndYear', () => {
    const title = 'movie-title';
    const year = 2000;
    const key: IMovieKey = { title, year };
    const info = { rank: 20 } as UpdateMovieInfoDTO;

    beforeEach(() => {
      jest.spyOn(movieRepository, 'getByKey')
        .mockName('movieRepository.getByKey');
      jest.spyOn(movieRepository, 'updateByKey')
        .mockName('movieRepository.updateByKey');
    });

    it('should throw error when movie not found', async () => {
      jest.mocked(movieRepository.getByKey).mockResolvedValue(null);

      const promise = movieService.updateMovieInfoByTitleAndYear(title, year, info);

      expect(movieRepository.getByKey).toHaveBeenCalledWith(key);
      await expect(promise).rejects.toThrowError(AppError);
      await expect(promise).rejects.toThrowError('Movie not found!');
      expect(movieRepository.updateByKey).not.toHaveBeenCalled();
    });

    it('should update movie info', async () => {
      const oldInfo = { rank: 10, rating: 5 } as IMovieInfo;
      const movie = { info: oldInfo } as IMovie;
      const updatedMovie = 'update-movie' as unknown as IMovie;
      jest.mocked(movieRepository.getByKey).mockResolvedValue(movie);
      jest.mocked(movieRepository.updateByKey).mockResolvedValue(updatedMovie);

      const actual = await movieService.updateMovieInfoByTitleAndYear(title, year, info);

      expect(movieRepository.getByKey).toHaveBeenCalledWith(key);
      expect(movieRepository.updateByKey)
        .toHaveBeenCalledWith(key, { info: { ...oldInfo, ...info } as IMovieInfo });
      expect(actual).toBe(updatedMovie);
    });
  });
});
