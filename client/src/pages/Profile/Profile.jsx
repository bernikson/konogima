import React from "react";
import "./Profile.css";
import AnimeCard from "../../components/AnimeCard/AnimeCard";
import { useRef, useState } from "react";

const Profile = () => {
  const imageRef = useRef(null);
  const [image, setImage] = useState();
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
      <button
        className="profile_change_avatar"
        onClick={() => imageRef.current.click()}
      >
        სურათის შეცვლა
      </button>
      <input
        value={image}
        onChange={(e) => setImage(e.target.value)}
        ref={imageRef}
        style={{ display: "none" }}
        type="file"
        accept="image/png, image/jpeg, image/webp"
      />
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
