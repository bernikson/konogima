import React from "react";
import Play from "../../assets/svgs/Play";
import "./AnimeCard.css";
import { useNavigate } from "react-router-dom";

const AnimeCard = ({ anime }) => {
  const navigate = useNavigate();
  let totalSeries = 0;
  anime?.seasons?.map((season) => {
    season?.series?.forEach(() => {
      totalSeries += 1;
    });
  });
  return (
    <div
      id="anime_card"
      style={{ backgroundImage: `url(${anime?.background})` }}
    >
      <div id="anime_info">
        <h4>
          {totalSeries} / {anime?.series}
        </h4>
        {anime?.age >= 18 && <span>18+</span>}
      </div>
      <div
        onClick={() => navigate(`/anime/${anime._id}`)}
        className="anime_hover"
      >
        <Play width="25px" />
      </div>
    </div>
  );
};

export default AnimeCard;
