import React from "react";
import "./Navbar.css";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Auth from "../Auth/Auth";
import { updateAuthState, logout, sortAnimes } from "../../redux/webSlice";
import { useDispatch, useSelector } from "react-redux";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [scrollNav, setScrollNav] = useState(false);
  const changeNavBg = () => {
    window.scrollY >= 100 ? setScrollNav(true) : setScrollNav(false);
  };

  useEffect(() => {
    window.addEventListener("scroll", changeNavBg);
    return () => {
      window.removeEventListener("scroll", changeNavBg);
    };
  }, []);
  const { user } = useSelector((state) => ({ ...state.web }));
  const [dropdown, triggerDropdown] = useState(false);
  const [profile, triggerProfile] = useState(false);
  const [navState, setNavState] = useState(0);
  let animeGenres = [
    "საბრძოლო_ხელოვნება",
    "სათავგადასავლო",
    "სამეცნიერო_ფანტასტიკა",
    "რომანტიკა",
    "სამურაი",
    "საშინელებათა",
    "ფანტაზია",
    "ფსიქოლოგიური",
    "შოუჯო",
    "შოუნენი",
    "ყოველდღიურობა",
    "დემონები",
    "ვამპირები",
    "დეტექტივი",
    "ზებუნებრივი",
    "დრამა",
    "სუპერ-ძალები",
    "სპორტი",
    "თამაში",
    "სკოლა",
    "თრილერი",
    "სეინენი",
    "ისტორიული",
    "სამხედრო",
    "პოსტ-აპოკალიფსური",
    "მუსიკალური",
    "კომედია",
    "მაგია",
    "მისტიკა",
    "მექა",
    "მოქმედებითი",
    "ეჩი",
    "ჰარემი",
    "ფილმი",
  ];
  return (
    <nav className={scrollNav ? "scrollNav" : undefined}>
      <div
        style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
        onClick={() => navigate("/")}
      >
        <div id="nav_logo"></div>
        <span className="nav_logo_name">Konogima</span>
      </div>

      <aside>
        {localStorage.getItem("isLogged") !== "true" ? (
          <div id="nav_auth">
            <button onClick={() => dispatch(updateAuthState(1))}>შესვლა</button>
            <button onClick={() => dispatch(updateAuthState(2))}>
              რეგისტრაცია
            </button>
          </div>
        ) : (
          <div
            id="nav_avatar"
            style={{ backgroundImage: `url(${user?.avatar})` }}
            onClick={() => triggerProfile(!profile)}
          >
            <div className={profile ? "triggerProfile" : undefined}>
              <Link to="/profile/own">პროფილი</Link>
              {user?.role === 1 && <Link to="/admin">ადმინი</Link>}
              <Link to="#" onClick={() => dispatch(logout())}>
                გამოსვლა
              </Link>
            </div>
          </div>
        )}
        <div id="nav_menu">
          <div
            id="nav_menu_logo"
            className={dropdown ? "triggerMenu" : undefined}
            onClick={() => triggerDropdown(!dropdown)}
          ></div>
          <div
            id="nav_menu_dropdown"
            className={dropdown ? "triggeredDropdown" : undefined}
          >
            <div id="nav_menu_dropdown_btn">
              <button onClick={() => setNavState(0)}>ჟანრები</button>
              <button id="nav_res_menu_trigger" onClick={() => setNavState(1)}>
                მომხმარებელი
              </button>
            </div>
            {navState === 0 && (
              <ul>
                {animeGenres?.map((anime, index) => (
                  <li onClick={() => dispatch(sortAnimes([anime]))} key={index}>
                    {anime}
                  </li>
                ))}
              </ul>
            )}
            {navState === 1 && (
              <ul id="nav_res_menu">
                <li onClick={() => dispatch(updateAuthState(1))}>შესვლა</li>
                <li onClick={() => dispatch(updateAuthState(2))}>
                  რეგისტრაცია
                </li>
              </ul>
            )}
          </div>
        </div>
      </aside>
      <Auth />
    </nav>
  );
};

export default React.memo(Navbar);
