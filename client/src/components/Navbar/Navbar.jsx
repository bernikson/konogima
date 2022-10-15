import React from "react";
import "./Navbar.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Auth from "../Auth/Auth";
import { updateAuthState, logout } from "../../redux/webSlice";
import { useDispatch, useSelector } from "react-redux";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => ({ ...state.web }));
  const [dropdown, triggerDropdown] = useState(false);
  const [profile, triggerProfile] = useState(false);
  const [navState, setNavState] = useState(0);
  return (
    <nav>
      <div id="nav_logo" onClick={() => navigate("/")}></div>
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
              <Link to="/admin">ადმინი</Link>
              <Link to="/" onClick={() => dispatch(logout())}>
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
                <li>საბრძოლო ხელოვნება</li>
                <li>სათავგადასავლო</li>
                <li>სამეცნიერო-ფანტასტიკა</li>
                <li>რომანტიკა</li>
                <li>სამურაი</li>
                <li>საშინელებათა</li>
                <li>ფანტაზია</li>
                <li>ფსიქოლოგიური</li>
                <li>შოუჯო</li>
                <li>შოუნენი</li>
                <li>ყოველდღიურობა</li>
                <li>დემონები</li>
                <li>ვამპირები</li>
                <li>დეტექტივი</li>
                <li>ზებუნებრივი</li>
                <li>დრამა</li>
                <li>სუპერ-ძალები</li>
                <li>სპორტი</li>
                <li>თამაში</li>
                <li>სკოლა</li>
                <li>თრილერი</li>
                <li>სეინენი</li>
                <li>ისტორიული</li>
                <li>სამხედრო</li>
                <li>პოსტ-აპოკალიფსური</li>
                <li>მუსიკალური</li>
                <li>კომედია</li>
                <li>მაგია</li>
                <li>მისტიკა</li>
                <li>მეხა</li>
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

export default Navbar;
