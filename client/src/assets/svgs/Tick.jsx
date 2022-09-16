import React from "react";

const Tick = ({ width, height, fill }) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 16 16"
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
      fill={fill}
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="1.5"
    >
      <polyline points="2.75 8.75,6.25 12.25,13.25 4.75" />
    </svg>
  );
};

export default Tick;
