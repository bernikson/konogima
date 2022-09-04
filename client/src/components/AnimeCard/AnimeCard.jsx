import React from "react";
import Play from "../../assets/svgs/Play";
import "./AnimeCard.css";

const AnimeCard = () => {
  return (
    <div id="anime_card">
      <h4>4 / 10</h4>
      <div>
        <span>ჩვენება</span>
        <Play width="25px" />
      </div>
    </div>
  );
};

export default AnimeCard;
