import React from "react";
import Facebook from "../../assets/svgs/Facebook";
import Tiktok from "../../assets/svgs/Tiktok";
import "./Footer.css";
import { useNavigate } from "react-router-dom";

const Footer = () => {
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
        <button onClick={() => navigate("/profile")}>test@example.com</button>
      </aside>
    </footer>
  );
};

export default Footer;
