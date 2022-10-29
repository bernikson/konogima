import React from "react";
import AnimeCard from "../../components/AnimeCard/AnimeCard";
import "./Home.css";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { sortAnimes } from "../../redux/webSlice";

const Home = () => {
  const dispatch = useDispatch();
  const { animes, user, sortedAnimes } = useSelector((state) => ({
    ...state.web,
  }));
  const [filteredArr, setFilteredArr] = useState(animes);
  const [allArr, setAllArr] = useState(animes);
  useEffect(() => {
    const newArr = [...animes];

    let modifiedArr = newArr.sort((a, b) => b.views - a.views);
    let holdItem = modifiedArr[0];
    modifiedArr[0] = modifiedArr[1];
    modifiedArr[1] = holdItem;
    setFilteredArr(modifiedArr.filter((arr, index) => index < 3));
  }, [animes]);
  useEffect(() => {
    setAllArr(animes);
  }, [animes]);
  let isLogged = localStorage.getItem("isLogged");
  useEffect(() => {
    if (sortedAnimes.length !== 0) {
      let foundAnime = animes.filter((anime) => {
        if (anime.genres.includes(sortedAnimes)) {
          return anime;
        }
      });
      console.log(foundAnime);
      if (foundAnime === undefined) return setAllArr([]);
      setAllArr(foundAnime);
    }
  }, [sortedAnimes, animes]);

  return (
    <main id="home">
      {sortedAnimes.length === 0 && (
        <section id="home_popular">
          <h1>პოპულარულები</h1>
          <article>
            {filteredArr?.map((anime, index) => (
              <AnimeCard key={index} anime={anime} />
            ))}
          </article>
        </section>
      )}
      {isLogged === "true" &&
        sortedAnimes.length === 0 &&
        Object.values(user).length !== 0 &&
        user?.watchLater.length !== 0 && (
          <section id="home_last_played">
            <h1>გააგრძელე ყურება</h1>
            <article>
              {Object.values(user).length !== 0 &&
                user?.watchLater?.map((output, index) => (
                  <AnimeCard key={index} anime={output?.anime} />
                ))}
            </article>
          </section>
        )}
      <section id="all">
        <div style={{ display: "flex", gap: "1rem" }}>
          <h1>ყველა ანიმე</h1>
          {sortedAnimes?.length !== 0 && (
            <button
              onClick={() => {
                setAllArr(animes);
                dispatch(sortAnimes(""));
              }}
            >
              უკან დაბრუნება
            </button>
          )}
        </div>

        <article>
          {allArr?.map((anime, index) => (
            <AnimeCard key={index} anime={anime} />
          ))}
        </article>
        {allArr.length === 0 && (
          <span className="home_anime_filter_text">ანიმეები ვერ მოიძებნა</span>
        )}
      </section>
      {/* <button>მეტის ჩატვირთვა</button> */}
    </main>
  );
};

export default Home;
