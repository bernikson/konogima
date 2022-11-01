import React from "react";
import Facebook from "../../assets/svgs/Facebook";
import Tiktok from "../../assets/svgs/Tiktok";
import "./Footer.css";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const Footer = () => {
  const { user } = useSelector((state) => ({ ...state.web }));
  const navigate = useNavigate();
  return (
    <footer id="footer">
      <aside id="footer_left">
        <div>
          <Facebook width="20" />
        </div>
        <div>
          <Tiktok width="20" />
        </div>
        <div></div>
        <div></div>
      </aside>
      <div onClick={() => navigate("/")} id="footer_logo"></div>
      <aside id="footer_right">
        <button>Privacy Policy</button>
        {Object.values(user).length !== 0 && (
          <button onClick={() => navigate(`/profile/own`)}>
            {user?.email}
          </button>
        )}
      </aside>
    </footer>
  );
};

export default React.memo(Footer);
