import React from "react";

const Iframe = ({ playerToUse }) => {
  return (
    <>
      {" "}
      <iframe
        src={playerToUse}
        title="Anime player"
        allowFullScreen="true"
        webkitallowfullscreen="true"
        mozallowfullscreen="true"
      ></iframe>
    </>
  );
};

export default React.memo(Iframe);
