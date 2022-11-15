import React from "react";
import "./Navbar.css";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Auth from "../Auth/Auth";
import {
  updateAuthState,
  logout,
  sortAnimes,
  filterAnimes,
  searchAnimes,
} from "../../redux/webSlice";
import { useDispatch, useSelector } from "react-redux";
import Menu from "../../assets/svgs/Menu";
import Search from "../../assets/svgs/Search";
import Filter from "../../assets/svgs/Filter";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [scrollNav, setScrollNav] = useState(false);
  const [filter, setFilter] = useState("ნახვებით");
  const [filterAnim, setFilterAnim] = useState(false);
  const [searchAnim, setSearchAnim] = useState(false);
  const [menuAnim, setMenuAnim] = useState(false);
  const [search, setSearch] = useState("");
  const { user, sortedAnimes, animes } = useSelector((state) => ({
    ...state.web,
  }));
  const animate = () => {
    // Button begins to shake
    setFilterAnim(true);

    // Buttons stops to shake after 2 seconds
    setTimeout(() => setFilterAnim(false), 800);
  };
  const animateMenu = () => {
    // Button begins to shake
    setMenuAnim(true);

    // Buttons stops to shake after 2 seconds
    setTimeout(() => setMenuAnim(false), 800);
  };

  useEffect(() => {
    let newArr = [];

    animes?.forEach((output) => {
      if (output?.name?.includes(search)) {
        newArr.push(output);
      }
    });
    dispatch(searchAnimes(newArr));
  }, [search]);

  const handleFilter = () => {
    if (filter === "ნახვებით") {
      setFilter("მოწონებით");
    } else if (filter === "მოწონებით") {
      setFilter("სიახლით");
    } else if (filter === "სიახლით") {
      setFilter("ნახვებით");
    }
  };

  useEffect(() => {
    dispatch(filterAnimes(filter));
  }, [filter]);

  const changeNavBg = () => {
    window.scrollY >= 100 ? setScrollNav(true) : setScrollNav(false);
  };

  useEffect(() => {
    window.addEventListener("scroll", changeNavBg);
    return () => {
      window.removeEventListener("scroll", changeNavBg);
    };
  }, []);

  const [dropdown, triggerDropdown] = useState(false);
  const [profile, triggerProfile] = useState(false);
  const [navState, setNavState] = useState(0);
  let [animeGenres, setGenres] = useState([
    { value: "საბრძოლო_ხელოვნება", state: false },
    { value: "სათავგადასავლო", state: false },
    { value: "სამეცნიერო_ფანტასტიკა", state: false },
    { value: "რომანტიკა", state: false },
    { value: "სამურაი", state: false },
    { value: "საშინელებათა", state: false },
    { value: "ფანტაზია", state: false },
    { value: "ფსიქოლოგიური", state: false },
    { value: "შოუჯო", state: false },
    { value: "შოუნენი", state: false },
    { value: "ყოველდღიურობა", state: false },
    { value: "დემონები", state: false },
    { value: "ვამპირები", state: false },
    { value: "დეტექტივი", state: false },
    { value: "ზებუნებრივი", state: false },
    { value: "დრამა", state: false },
    { value: "სუპერ-ძალები", state: false },
    { value: "სპორტი", state: false },
    { value: "თამაში", state: false },
    { value: "სკოლა", state: false },
    { value: "თრილერი", state: false },
    { value: "სეინენი", state: false },
    { value: "ისტორიული", state: false },
    { value: "სამხედრო", state: false },
    { value: "პოსტ-აპოკალიფსური", state: false },
    { value: "მუსიკალური", state: false },
    { value: "კომედია", state: false },
    { value: "მაგია", state: false },
    { value: "მისტიკა", state: false },
    { value: "მექა", state: false },
    { value: "მოქმედებითი", state: false },
    { value: "ეჩი", state: false },
    { value: "ჰარემი", state: false },
    { value: "ფილმი", state: false },
    { value: "ისეკაი", state: false },
    { value: "რეინკარნაცია", state: false },
  ]);

  useEffect(() => {
    if (sortedAnimes.length === 0) {
      setGenres([
        { value: "საბრძოლო_ხელოვნება", state: false },
        { value: "სათავგადასავლო", state: false },
        { value: "სამეცნიერო_ფანტასტიკა", state: false },
        { value: "რომანტიკა", state: false },
        { value: "სამურაი", state: false },
        { value: "საშინელებათა", state: false },
        { value: "ფანტაზია", state: false },
        { value: "ფსიქოლოგიური", state: false },
        { value: "შოუჯო", state: false },
        { value: "შოუნენი", state: false },
        { value: "ყოველდღიურობა", state: false },
        { value: "დემონები", state: false },
        { value: "ვამპირები", state: false },
        { value: "დეტექტივი", state: false },
        { value: "ზებუნებრივი", state: false },
        { value: "დრამა", state: false },
        { value: "სუპერ-ძალები", state: false },
        { value: "სპორტი", state: false },
        { value: "თამაში", state: false },
        { value: "სკოლა", state: false },
        { value: "თრილერი", state: false },
        { value: "სეინენი", state: false },
        { value: "ისტორიული", state: false },
        { value: "სამხედრო", state: false },
        { value: "პოსტ-აპოკალიფსური", state: false },
        { value: "მუსიკალური", state: false },
        { value: "კომედია", state: false },
        { value: "მაგია", state: false },
        { value: "მისტიკა", state: false },
        { value: "მექა", state: false },
        { value: "მოქმედებითი", state: false },
        { value: "ეჩი", state: false },
        { value: "ჰარემი", state: false },
        { value: "ფილმი", state: false },
        { value: "ისეკაი", state: false },
        { value: "რეინკარნაცია", state: false },
      ]);
    }
  }, [sortedAnimes.length]);
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
        {localStorage.getItem("isLogged") !== "true" && (
          <span
            onClick={() => dispatch(updateAuthState(1))}
            className="res_login"
          >
            შესვლა
          </span>
        )}

        <div id="nav_menu">
          <div
            id="nav_menu_logo"
            className={menuAnim ? "triggerMenu" : undefined}
            onClick={() => {
              animateMenu();
              triggerDropdown(!dropdown);
            }}
          >
            <Menu />
          </div>
          {/* <div
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
          </div> */}
          <div id="new_nav" className={dropdown ? "triggerNewDrop" : undefined}>
            <h1>ძებნა</h1>
            <fieldset className={searchAnim ? "triggerSearchAnim" : undefined}>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                type="text"
                onFocus={() => setSearchAnim(true)}
                onBlur={() => setSearchAnim(false)}
              />
              <Search />
            </fieldset>
            <h1>ჟანრები</h1>
            <ul>
              {animeGenres.map((genre, index) => (
                <li
                  key={index}
                  onClick={async () => {
                    await setGenres((prevGenres) => {
                      let newState = [...prevGenres];
                      newState[index].state = !newState[index].state;
                      return newState;
                    });
                    let tempArr = [];
                    animeGenres.map((output) => {
                      if (output.state) {
                        tempArr.push(output.value);
                      }
                    });
                    await dispatch(sortAnimes(tempArr));
                  }}
                >
                  <div
                    className={genre.state ? "filtered_genre" : undefined}
                  ></div>
                  <span>{genre.value}</span>
                </li>
              ))}
            </ul>
            <h1>ფილტრი</h1>
            <div
              className={filterAnim ? `filterShake` : undefined}
              onClick={() => {
                animate();
                handleFilter();
              }}
            >
              <span>{filter}</span>
              <div>
                <Filter />
              </div>
            </div>
          </div>
        </div>
      </aside>
      <Auth />
    </nav>
  );
};

export default React.memo(Navbar);
