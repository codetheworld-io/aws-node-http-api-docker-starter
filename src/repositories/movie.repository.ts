import { IMovie, IMovieInfo, IMovieKey } from '../models/movie.model';
import BaseRepository, { IPagingData, QueryInput } from './base.repository';

export type ICreateMovieDTO = Omit<IMovie, 'info'>;
export type UpdateMovieInfoDTO = Partial<IMovieInfo>;

class MovieRepository extends BaseRepository<IMovieKey, IMovie> {
  protected tableName = 'Movies';

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
