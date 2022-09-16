import React from "react";
import AnimeCard from "../../components/AnimeCard/AnimeCard";
import "./Home.css";

const Home = () => {
  return (
    <main id="home">
      <section id="home_popular">
        <h1>პოპულარულები</h1>
        <article>
          <AnimeCard />
          <AnimeCard />
          <AnimeCard />
        </article>
      </section>
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
      <h1>მეტის ჩატვირთვა</h1>
    </main>
  );
};

export default Home;
