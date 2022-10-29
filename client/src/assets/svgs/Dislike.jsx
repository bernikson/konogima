import React from "react";

const Dislike = React.memo(({ width, height, fill }) => {
  return (
    <svg
      width={width}
      height={height}
      fill={fill}
      version="1.0"
      id="Layer_1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      x="0px"
      y="0px"
      viewBox="0 0 100 100"
      enableBackground="new 0 0 100 100"
      xmlSpace="preserve"
    >
      <path
        d="M46.667,10v0.006c-4.921,0-11.021,2.695-13.333,6.66v6.667v29.999V60c5.521,0,10,4.479,10,10v16.666
	c0,1.842,1.491,3.334,3.333,3.334C54.029,90,60,84.029,60,76.666V63.332C60,61.49,61.49,60,63.334,60H80c5.521,0,10-4.48,10-10V20
	h-0.004c0-5.521-4.475-10-9.996-10H46.667z"
      />
      <rect x="10" y="16.667" width="16.667" height="43.333" />
    </svg>
  );
});

export default Dislike;
