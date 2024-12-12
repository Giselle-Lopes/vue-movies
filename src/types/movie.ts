export interface Movie {
    id: number;
    title: string;
    poster_path: string;
    overview: string;
    release_date: string;
    original_language: string;
    trailerKey?: string;
    name?: string;
    first_air_date?: string;
    vote_average?: number;
}