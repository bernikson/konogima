import React from "react";
import Play from "../../assets/svgs/Play";
import "./AnimeCard.css";
import { useNavigate } from "react-router-dom";

const AnimeCard = ({ anime }) => {
  const navigate = useNavigate();
  let totalSeries = 0;
  anime?.seasons?.map((season) => {
    season?.series?.map(() => {
      totalSeries += 1;
    });
  });
  return (
    <div
      id="anime_card"
      style={{ backgroundImage: `url(${anime?.background})` }}
    >
      <h4>
        {totalSeries} / {anime?.series}
      </h4>
      <div onClick={() => navigate(`/anime/${anime._id}`)}>
        <span>ჩვენება</span>
        <Play width="25px" />
      </div>
    </div>
  );
};

export default AnimeCard;
