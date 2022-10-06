import React from "react";
import "./Profile.css";
import AnimeCard from "../../components/AnimeCard/AnimeCard";

const Profile = () => {
  return (
    <main id="profile">
      <div id="profile_avatar"></div>
      <h1 id="profile_name">Berniko</h1>
      <section id="profile_status">
        <div>დეველოპერი</div>
        <div>VIP</div>
        <div>გამხმოვანებელი</div>
        <div>მთარგმელი</div>
        <diV>VIP+</diV>
      </section>
      <section id="profile_watch_later">
        <h4>გააგრძელე ყურება</h4>
        <article id="profile_watch_later_animes">
          <AnimeCard />
          <AnimeCard />
          <AnimeCard />
          <AnimeCard />
          <AnimeCard />
        </article>
      </section>
    </main>
  );
};

export default Profile;
