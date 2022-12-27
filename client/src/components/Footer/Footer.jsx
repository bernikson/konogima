import React from "react";
import Facebook from "../../assets/svgs/Facebook";
import Tiktok from "../../assets/svgs/Tiktok";
import Instagram from "../../assets/svgs/Instagram";
import "./Footer.css";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { updateLaw } from "../../redux/webSlice";

const Footer = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => ({ ...state.web }));
  const navigate = useNavigate();
  return (
    <footer id="footer">
      <aside id="footer_left">
        <div
          style={{ cursor: "pointer" }}
          onClick={() =>
            window.open(
              "https://www.facebook.com/profile.php?id=100087225231718",
              "_blank"
            )
          }
        >
          <Facebook width="20" />
        </div>
        <div
          style={{ cursor: "pointer" }}
          onClick={() =>
            window.open("https://www.tiktok.com/@konogimacom?lang=en", "_blank")
          }
        >
          <Tiktok width="20" />
        </div>
        <div
          style={{ cursor: "pointer" }}
          onClick={() =>
            window.open("https://www.instagram.com/konogimacom/", "_blank")
          }
        >
          <Instagram width="20" />
        </div>
        <div>18+</div>
      </aside>
      <div onClick={() => navigate("/")} id="footer_logo"></div>
      <aside id="footer_right">
        <div>
          <button
            style={{ cursor: "pointer" }}
            onClick={() => dispatch(updateLaw({ TOS: false, PRIVACY: true }))}
          >
            სამომხმარებლო შეთანხმება
          </button>
          <button
            style={{ cursor: "pointer" }}
            onClick={() => dispatch(updateLaw({ TOS: true, PRIVACY: false }))}
          >
            კონფიდენციალურობის პოლიტიკა
          </button>
        </div>
        <button>konogimacom@gmail.com</button>
      </aside>
    </footer>
  );
};

export default React.memo(Footer);
