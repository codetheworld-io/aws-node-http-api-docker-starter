/* eslint-disable camelcase */
import AppError from '@libs/app.error';
import movieRepository, {
  ICreateMovieDTO,
  IMovie,
  IMovieInfo,
  IMovieKey,
  UpdateMovieInfoDTO,
} from '@repositories/movie.repository';

export interface IMoviesByYearResponse {
  data: Array<Pick<IMovie, 'title' | 'year'> & { info: Pick<IMovieInfo, 'image_url'> }>;
  nextPageToken?: string;
}

export async function createMovie(createMovieDTO: ICreateMovieDTO) {
  const foundMovie = await movieRepository.getByKey({
    title: createMovieDTO.title,
    year: createMovieDTO.year,
  });
  if (foundMovie) {
    throw new AppError('Movie already existed');
  }

  return movieRepository.upsert(createMovieDTO);
}

export async function getMoviesByYear(
  year: number,
  nextPageToken?: string,
): Promise<IMoviesByYearResponse> {
  const lastEvaluatedKey: IMovieKey = nextPageToken
    ? JSON.parse(nextPageToken)
    : undefined;
  const {
    data,
    lastEvaluatedKey: nextPageTokenObject,
  } = await movieRepository.listMoviesByYear(year, 10, lastEvaluatedKey);

  return {
    data: data.map((movie) => {
      return {
        title: movie.title,
        year: movie.year,
        info: {
          image_url: movie.info.image_url,
        },
      };
    }),
    nextPageToken: nextPageTokenObject
      ? encodeURIComponent(JSON.stringify(nextPageTokenObject))
      : undefined,
  };
}

export async function getMoviesByTitleAndYear(title: string, year: number): Promise<IMovie> {
  const movie = await movieRepository.getByKey({ title, year });

  if (!movie) {
    throw new AppError('Movie not found!');
  }

  return movie;
}

export function deleteMovieByTitleAndYear(title: string, year: number): Promise<void> {
  return movieRepository.deleteByKey({ title, year });
}

export async function updateMovieInfoByTitleAndYear(
  title: string,
  year: number,
  info: UpdateMovieInfoDTO,
): Promise<IMovie> {
  const key: IMovieKey = { title, year };
  const movie = await movieRepository.getByKey(key);

  if (!movie) {
    throw new AppError('Movie not found!');
  }

  const newInfo: IMovieInfo = { ...movie.info, ...info };
  return movieRepository.updateByKey(key, { info: newInfo });
}
