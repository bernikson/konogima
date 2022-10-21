import React from "react";
import AnimeCard from "../../components/AnimeCard/AnimeCard";
import "./Home.css";
import { useSelector } from "react-redux";

const Home = () => {
  const { animes } = useSelector((state) => ({ ...state.web }));
  let isLogged = localStorage.getItem("isLogged");
  return (
    <main id="home">
      <section id="home_popular">
        <h1>პოპულარულები</h1>
        <article>
          {animes?.map((anime, index) => (
            <AnimeCard key={index} anime={anime} />
          ))}
        </article>
      </section>
      {isLogged == "true" && (
        <section id="home_last_played">
          <h1>გააგრძელე ყურება</h1>
          <article>
            <AnimeCard />
            <AnimeCard />
            <AnimeCard />
            <AnimeCard />
            <AnimeCard />
            <AnimeCard />
          </article>
        </section>
      )}
      <section id="all">
        <h1>ყველა ანიმე</h1>
        <article>
          <AnimeCard />
          <AnimeCard />
          <AnimeCard />
          <AnimeCard />
          <AnimeCard />
          <AnimeCard />
        </article>
      </section>
      <button>მეტის ჩატვირთვა</button>
    </main>
  );
};

export default Home;
