import React from "react";

const User = () => {
  return (
    <svg
      width="18"
      height="17"
      viewBox="0 0 18 17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9 8.5C11.4862 8.5 13.5 6.59812 13.5 4.25C13.5 1.90188 11.4862 0 9 0C6.51375 0 4.5 1.90188 4.5 4.25C4.5 6.59812 6.51375 8.5 9 8.5ZM9 10.625C5.99625 10.625 0 12.0487 0 14.875V15.9375C0 16.5219 0.50625 17 1.125 17H16.875C17.4937 17 18 16.5219 18 15.9375V14.875C18 12.0487 12.0037 10.625 9 10.625Z"
        fill="#D084E3"
      />
    </svg>
  );
};

export default React.memo(User);
