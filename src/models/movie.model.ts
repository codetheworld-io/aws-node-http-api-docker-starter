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
