import { useEffect, useState } from "react";
import { api } from "../services/api";
import { MovieCard } from "./MovieCard";

type MovieProps = {
  imdbID: string;
  Title: string;
  Poster: string;
  Ratings: Array<{
    Source: string;
    Value: string;
  }>;
  Runtime: string;
}

type GenreProps = {
  id: number;
  name: 'action' | 'comedy' | 'documentary' | 'drama' | 'horror' | 'family';
  title: string;
}

interface ContentProps {
  genres: GenreProps[]
  selectedGenreID: number
}

export function Content({ selectedGenreID, genres }: ContentProps) {
  const [moviesList, setMoviesList] = useState<MovieProps[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<GenreProps>({} as GenreProps);
  
  
  useEffect(() => {
    const findedGenre = genres.find(g => g.id === selectedGenreID)
    if(findedGenre)
      setSelectedGenre(findedGenre)
    
  }, [selectedGenreID])

  useEffect(() => {
    if(selectedGenre.id) { 
      api.get<MovieProps[]>(`movies/?Genre_id=${selectedGenre.id}`).then(response => {
              setMoviesList(response.data);
            });
    } else {
      api.get<MovieProps[]>(`movies/?Genre_id=1`).then(response => {
        setMoviesList(response.data);
      });
    }
  }, [selectedGenre])

  return (
    <div className="container">
      <header>
        <span className="category">Categoria:<span> {selectedGenre.title}</span></span>
      </header>

      <main>
        <div className="movies-list">
          {moviesList.map(movie => (
            <MovieCard key={movie.imdbID} title={movie.Title} poster={movie.Poster} runtime={movie.Runtime} rating={movie.Ratings[0].Value} />
          ))}
        </div>
      </main>
    </div>
  )
}