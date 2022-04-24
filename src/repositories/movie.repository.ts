import BaseRepository, { IPagingData, QueryInput } from './base.repository';

export interface IMovieInfo {
  actors: string[];
  release_date: string;
  plot: string;
  genres: string[];
  image_url: string;
  directors: string[];
  rating: number;
  rank: number;
  running_time_secs: number;
}

export interface IMovieKey {
  year: number;
  title: string;
}

export interface IMovie extends IMovieKey {
  info: IMovieInfo;
}

export type ICreateMovieDTO = Omit<IMovie, 'info'>;
export type UpdateMovieInfoDTO = Partial<IMovieInfo>;

class MovieRepository extends BaseRepository<IMovieKey, IMovie> {
  constructor() {
    super('Movies');
  }

  async listMoviesByYear(
    year: number,
    limit: number,
    lastEvaluatedKey?: IMovieKey,
  ): Promise<IPagingData<IMovie, IMovieKey>> {
    const query: QueryInput = {
      KeyConditionExpression: '#year = :year',
      Limit: limit,
      ExpressionAttributeNames: {
        '#year': 'year',
      },
      ExpressionAttributeValues: {
        ':year': year,
      },
      ExclusiveStartKey: lastEvaluatedKey,
    };

    return this.query(query);
  }
}

export default new MovieRepository();
