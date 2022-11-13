import React from "react";
import Play from "../../assets/svgs/Play";
import "./AnimeCard.css";
import { useNavigate } from "react-router-dom";
import { useMemo, useState, useEffect } from "react";

const AnimeCard = ({ anime }) => {
  const [totalSeries, setTotalSeries] = useState(0);
  const navigate = useNavigate();
  useEffect(() => {
    anime?.seasons?.forEach((season) => {
      season?.series?.forEach(() => {
        setTotalSeries((prevSeries) => prevSeries + 1);
      });
    });
    return () => setTotalSeries(0);
  }, [anime]);

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

export default React.memo(AnimeCard);
