import React from 'react';
import { useState } from 'react';
import { musicExamples, musicGenres } from './utils';

export default function App() {
  const [selectedGenres, setSelectedGenres] = useState<
    { genre: string; index: number }[]
  >([]);
  const [recommendations, setRecommendations] = useState<
    { genre: string; example: string; inversoes: number }[][]
  >([]);

  const handleGenreChange = (genre: string) => {
    if (selectedGenres.find((g) => g.genre === genre)) {
      setSelectedGenres(selectedGenres.filter((g) => g.genre !== genre));
    } else if (selectedGenres.length < 5) {
      setSelectedGenres([
        ...selectedGenres,
        { genre, index: selectedGenres.length + 1 },
      ]);
    }
  };

  const generateRandomRecommendations = () => {
    const filteredExamples = musicExamples.filter((example) =>
      selectedGenres.some((g) => g.genre === example.genre)
    );

    const genreIndexMap = selectedGenres.reduce((acc, cur) => {
      acc[cur.genre] = cur.index;
      return acc;
    }, {} as { [key: string]: number });

    const randomRecommendations = [];

    for (let i = 0; i < 10; i++) {
      const shuffledRecommendations = filteredExamples
        .sort(() => 0.5 - Math.random())
        .slice(0, 5);

      const genreOrder = shuffledRecommendations.map(
        (rec) => genreIndexMap[rec.genre]
      );
      const inversoes = contarInversoes(genreOrder);

      randomRecommendations.push(
        shuffledRecommendations.map((rec) => ({
          ...rec,
          inversoes,
        }))
      );
    }

    randomRecommendations.sort((a, b) => a[0].inversoes - b[0].inversoes);

    setRecommendations(randomRecommendations);
  };

  function contarInversoes(array: number[]): number {
    let inversoes = 0;

    function mergeSort(arr: number[]): number[] {
      if (arr.length <= 1) {
        return arr;
      }

      const mid = Math.floor(arr.length / 2);
      const left = mergeSort(arr.slice(0, mid));
      const right = mergeSort(arr.slice(mid));

      return merge(left, right);
    }

    function merge(left: number[], right: number[]): number[] {
      const result = [];
      let i = 0;
      let j = 0;

      while (i < left.length && j < right.length) {
        if (left[i] <= right[j]) {
          result.push(left[i]);
          i++;
        } else {
          result.push(right[j]);
          inversoes += left.length - i;
          j++;
        }
      }

      return result.concat(left.slice(i)).concat(right.slice(j));
    }

    mergeSort(array);
    return inversoes;
  }

  return (
    <div className="w-full min-h-screen flex justify-center items-center bg-slate-900 text-white p-20">
      <div className="flex flex-col items-center">
        <h1 className="font-bold text-2xl">MauMusic!!!</h1>
        <p className="text-xl mt-4">
          Sistema de Recomendação de Músicas baseado no algoritmo de contagem de
          inversões
        </p>
        {selectedGenres.length > 0 && (
          <div className="mt-8 flex flex-col items-center">
            <h1 className="font-bold mb-4">Gêneros Selecionados</h1>
            <div className="flex items-start gap-4">
              {selectedGenres.map((genreObj) => (
                <button
                  className="w-[150px] rounded px-2 py-3 h-[50px] text-sm flex flex-row items-center justify-between gap-2 shadow-xl text-center bg-green-500"
                  type="button"
                  onClick={() => handleGenreChange(genreObj.genre)}
                  key={genreObj.genre}
                >
                  <div className="w-[40px] rounded-full bg-green-600">
                    {genreObj.index}
                  </div>
                  <p className="text-center w-full">{genreObj.genre}</p>
                </button>
              ))}
            </div>
          </div>
        )}
        {selectedGenres.length === 5 && (
          <button
            className="bg-green-500 text-white rounded-lg px-4 py-2 mt-8"
            type="button"
            onClick={generateRandomRecommendations}
          >
            Gerar recomendações
          </button>
        )}
        {recommendations.length > 0 && (
          <div className="mt-8 flex flex-col items-center">
            <h1 className="font-bold mb-4">Recomendações</h1>
            <ul className="w-10/12 grid grid-cols-2 gap-4">
              {recommendations.reverse().map((recommendation, index) => (
                <div
                  key={`${index + 1}`}
                  className="mb-2 bg-slate-800 p-4 rounded flex flex-col items-start gap-4 w-full"
                >
                  <h2 className="font-bold text-lg mb-2">
                    {index + 1} - Inversões: {recommendation[0].inversoes}
                  </h2>
                  {recommendation.map((rec, index) => (
                    <div
                      key={`${index + 1}`}
                      className="bg-slate-800 rounded flex flex-col items-start gap-2 w-full"
                    >
                      <p className="font-bold">{rec.example}</p>
                      <p>{rec.genre}</p>
                    </div>
                  ))}
                </div>
              ))}
            </ul>
          </div>
        )}
        {selectedGenres.length > 0 && (
          <button
            className="bg-red-500 text-white rounded-lg px-4 py-2 mt-8 font-bold"
            type="button"
            onClick={() => setSelectedGenres([])}
          >
            Limpar selecionados
          </button>
        )}

        <div className="flex flex-col items-center mt-8 bg-slate-800 rounded-lg p-6 w-3/4">
          <h1 className="font-bold mb-8">
            Selecione seus 5 gêneros musicais favoritos
          </h1>
          <div className="grid grid-cols-3 items-start gap-4">
            {musicGenres.map((genre) => {
              const isSelected = selectedGenres.some((g) => g.genre === genre);

              return (
                <button
                  className={`w-[150px] rounded px-2 py-3 h-[50px] text-sm flex flex-row items-center justify-between gap-2 shadow-xl text-center ${
                    isSelected ? 'bg-green-500' : 'bg-slate-600'
                  }`}
                  type="button"
                  onClick={() => handleGenreChange(genre)}
                  key={genre}
                >
                  <p className="text-center w-full">{genre}</p>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
