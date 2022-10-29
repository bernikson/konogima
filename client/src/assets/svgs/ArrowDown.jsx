import React from "react";

const ArrowDown = React.memo(({ width }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height="24"
      viewBox="0 0 24 24"
    >
      <polygon points="12 17.414 3.293 8.707 4.707 7.293 12 14.586 19.293 7.293 20.707 8.707 12 17.414" />
    </svg>
  );
});

export default ArrowDown;
