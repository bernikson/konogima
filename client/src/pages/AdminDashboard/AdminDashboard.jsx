import React from "react";
import "./AdminDashboard.css";
import Tick from "../../assets/svgs/Tick";
import Calendar from "../../assets/svgs/Calendar";
import ArrowDown from "../../assets/svgs/ArrowDown";
import { useState, useRef, useEffect } from "react";
import "react-calendar/dist/Calendar.css";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { toast } from "react-hot-toast";
import { createAnime, updateAnime } from "../../redux/webSlice";

const AdminDashboard = () => {
  const { Token, socket, animes } = useSelector((state) => ({ ...state.web }));
  const { id } = useParams();
  let currentAnime = animes?.find((anime) => anime._id === id);
  const [date, newDate] = useState(new Date());
  const dispatch = useDispatch();

  const [animeSeasons, addAnimeSeasons] = useState({
    season: 1,
    playerOne: "",
    playerTwo: "",
    playerThree: "",
  });

  const [seasonChooser, setSeasonChooser] = useState(1);

  const handleSeasons = (e) => {
    const { value, name } = e.target;
    addAnimeSeasons({ ...animeSeasons, [name]: value });
  };

  const [players, updatePlayers] = useState({
    playerOne: "",
    playerTwo: "",
    playerThree: "",
    seasonId: "",
    playerId: "",
  });

  const handlePlayers = (e) => {
    const { value, name } = e.target;
    updatePlayers({ ...players, [name]: value });
  };

  const handleCreateAnimeSeason = (e) => {
    if (animeSeasons.playerOne === "") {
      return toast.error("შეიყვანეთ სერია", {
        id: "single",
        duration: 4000,
        style: {
          backgroundColor: "black",
          border: "1px solid #D084E3",
          color: "white",
          boxShadow: "0px 0px 30px #D084E3",
        },
      });
    }
    toast.loading("მიმდინარეობს ინფორმაციის მიღება...", {
      id: "single",
      duration: 4000,
      style: {
        backgroundColor: "black",
        border: "1px solid #D084E3",
        color: "white",
        boxShadow: "0px 0px 30px #D084E3",
      },
    });
    socket.emit("createSeasons", { Token, animeSeasons, animeId: id });
  };

  let [animeGenres, setGenres] = useState([
    { value: "საბრძოლო ხელოვნება", state: false },
    { value: "სათავგადასავლო", state: false },
    { value: "სამეცნიერო ფანტასტიკა", state: false },
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
    { value: "მეხა", state: false },
  ]);

  const [animeData, setAnimeData] = useState({
    name: "",
    year: "",
    voiceover: "",
    translator: "",
    totaltime: "",
    genres: [],
    director: "",
    studio: "",
    age: "",
    description: "",
    background: "",
    series: "",
  });

  useEffect(() => {
    if (id !== "new") {
      let anime = animes?.find((anime) => anime._id === id);
      if (anime !== undefined) {
        const {
          name,
          year,
          voiceover,
          translator,
          totaltime,
          genres,
          director,
          studio,
          age,
          description,
          background,
          series,
        } = anime;
        animeGenres.map((animeGenre) => {
          if (genres.includes(animeGenre.value)) {
            animeGenre.state = true;
          }
        });
        setAnimeData({
          ...animeData,
          name,
          year,
          voiceover,
          translator,
          totaltime,
          director,
          studio,
          age,
          description,
          background,
          series,
        });
      }
    }
  }, [id, animes]);

  const imageRef = useRef(null);
  const [playerOptions, setPlayerOptions] = useState({
    playerTwo: false,
    playerThree: false,
  });
  const [genresDropdown, triggerGenresDropdown] = useState(false);
  const [calendarDropdown, triggerCalendarDropdown] = useState(false);
  const [seasonCounter, setSeasonCounter] = useState(0);

  const changeAvatar = async (e) => {
    e.preventDefault();
    try {
      const file = e.target.files[0];
      let formData = new FormData();
      formData.append("file", file);
      let loader = true;
      loader &&
        toast.loading("მიმდინარეობს ინფორმაციის მიღება...", {
          id: "single",
          duration: 4000,
          style: {
            backgroundColor: "black",
            border: "1px solid #D084E3",
            color: "white",
            boxShadow: "0px 0px 30px #D084E3",
          },
        });
      const { data } = await axios.post(
        "/api/user/uploadAnimeImage",
        formData,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Bearer ${Token}`,
          },
        }
      );
      loader = false;
      setAnimeData({ ...animeData, background: data.payload });
      toast.success(data.message, {
        id: "single",
        duration: 4000,
        style: {
          backgroundColor: "black",
          border: "1px solid #D084E3",
          color: "white",
          boxShadow: "0px 0px 30px #D084E3",
        },
      });
    } catch (error) {
      toast.error(error.response.data.message, {
        id: "single",
        duration: 4000,
        style: {
          backgroundColor: "black",
          border: "1px solid #D084E3",
          color: "white",
          boxShadow: "0px 0px 30px #D084E3",
        },
      });
    }
  };

  const changeAnimeData = (e) => {
    const { name, value } = e.target;
    setAnimeData({ ...animeData, [name]: value });
  };

  const addAnime = () => {
    const {
      name,
      year,
      voiceover,
      translator,
      totaltime,
      director,
      studio,
      age,
      description,
      background,
      series,
    } = animeData;
    let genresArray = [];
    animeGenres.map((genre) => {
      if (genre.state) genresArray.push(genre.value);
    });
    dispatch(
      createAnime({
        payload: {
          name,
          year: parseInt(year),
          voiceover,
          translator,
          totaltime: parseInt(totaltime),
          director,
          studio,
          age: parseInt(age),
          description,
          background,
          genres: genresArray,
          series,
        },
        Token,
      })
    );
  };

  const handleUpdateAnime = () => {
    const {
      name,
      year,
      voiceover,
      translator,
      totaltime,
      director,
      studio,
      age,
      description,
      background,
      series,
    } = animeData;
    let genresArray = [];
    animeGenres.map((genre) => {
      if (genre.state) genresArray.push(genre.value);
    });
    dispatch(
      updateAnime({
        payload: {
          name,
          year: parseInt(year),
          voiceover,
          translator,
          totaltime: parseInt(totaltime),
          director,
          studio,
          age: parseInt(age),
          description,
          background,
          genres: genresArray,
          series,
        },
        Token,
        animeId: id,
      })
    );
  };
  return (
    <main id="admin_dashboard">
      <aside id="top_admin">
        <aside id="top_left_admin">
          <div
            id="admin_dashboard_background"
            style={{ backgroundImage: `url(${animeData?.background})` }}
          ></div>
          <article>
            <button onClick={() => imageRef.current.click()}>
              სურათის არჩევა
            </button>
            <input
              ref={imageRef}
              style={{ display: "none" }}
              onChange={changeAvatar}
              type="file"
              accept="image/png, image/jpeg, image/webp"
            />
            {id !== "new" && (
              <section id="admin_dashboard_players">
                <div>
                  <span>ფლეიერი 2</span>
                  <div
                    onClick={() =>
                      setPlayerOptions({
                        ...playerOptions,
                        playerTwo: !playerOptions.playerTwo,
                      })
                    }
                    className={
                      playerOptions.playerTwo ? "trigger_player" : undefined
                    }
                  >
                    <Tick />
                  </div>
                </div>
                <div>
                  <span>ფლეიერი 3</span>
                  <div
                    onClick={() =>
                      setPlayerOptions({
                        ...playerOptions,
                        playerThree: !playerOptions.playerThree,
                      })
                    }
                    className={
                      playerOptions.playerThree ? "trigger_player" : undefined
                    }
                  >
                    <Tick />
                  </div>
                </div>
              </section>
            )}
          </article>
        </aside>
        <aside id="top_right_admin">
          <section id="admin_dashboard_information">
            <ul>
              <li>
                <input
                  type="text"
                  placeholder="სახელი"
                  name="name"
                  value={animeData.name}
                  onChange={changeAnimeData}
                  autoComplete="off"
                />
                <div className="input_border"></div>
              </li>
              <li>
                <input
                  type="text"
                  placeholder="წელი"
                  name="year"
                  value={animeData.year}
                  onChange={(e) => {
                    const re = /^[0-9]*$/;
                    if (e.target.value === "" || re.test(e.target.value)) {
                      changeAnimeData(e);
                    }
                  }}
                  autoComplete="off"
                />
                <div className="input_border"></div>
              </li>
              <li>
                <input
                  type="text"
                  placeholder="გამხმოვანებელი"
                  name="voiceover"
                  value={animeData.voiceover}
                  onChange={changeAnimeData}
                  autoComplete="off"
                />
                <div className="input_border"></div>
              </li>
              <li>
                <input
                  type="text"
                  placeholder="მთარგმელი"
                  name="translator"
                  value={animeData.translator}
                  onChange={changeAnimeData}
                  autoComplete="off"
                />
                <div className="input_border"></div>
              </li>
              <li>
                <input
                  type="text"
                  placeholder="ქრონომეტრაჟი"
                  name="totaltime"
                  value={animeData.totaltime}
                  onChange={(e) => {
                    const re = /^[0-9]*$/;
                    if (e.target.value === "" || re.test(e.target.value)) {
                      changeAnimeData(e);
                    }
                  }}
                  autoComplete="off"
                />
                <div className="input_border"></div>
              </li>
            </ul>
            <ul>
              <li>
                <div
                  className={`admin_dropdown_header ${
                    genresDropdown
                      ? "triggered_gernes_header_dropdown"
                      : undefined
                  }`}
                  onClick={() => triggerGenresDropdown(!genresDropdown)}
                >
                  <span>ჟანრი</span>
                  <ArrowDown />
                </div>
                <div
                  id="anime_genres_dropdown"
                  className={
                    genresDropdown ? "triggered_gernes_dropdown" : undefined
                  }
                >
                  <ul>
                    {animeGenres.map((genre, index) => (
                      <li
                        key={index}
                        onClick={() =>
                          setGenres((prevGenres) => {
                            let newState = [...prevGenres];
                            newState[index].state = !newState[index].state;
                            return newState;
                          })
                        }
                      >
                        <div
                          className={genre.state ? "modified_genre" : undefined}
                        >
                          <Tick />
                        </div>
                        <span>{genre.value}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
              <li>
                <input
                  type="text"
                  placeholder="რეჟისორი"
                  name="director"
                  value={animeData.director}
                  onChange={changeAnimeData}
                  autoComplete="off"
                />
                <div className="input_border"></div>
              </li>
              <li>
                <input
                  type="text"
                  placeholder="სტუდია"
                  name="studio"
                  value={animeData.studio}
                  onChange={changeAnimeData}
                  autoComplete="off"
                />
                <div className="input_border"></div>
              </li>
              <li>
                <input
                  type="text"
                  placeholder="ასაკი"
                  name="age"
                  pattern="[0-9]"
                  value={animeData.age}
                  onChange={(e) => {
                    const re = /^[0-9]*$/;
                    if (e.target.value === "" || re.test(e.target.value)) {
                      changeAnimeData(e);
                    }
                  }}
                  autoComplete="off"
                />
                <div className="input_border"></div>
              </li>
              <li>
                <input
                  type="text"
                  placeholder="სერიების რაოდენობა"
                  name="series"
                  value={animeData.series}
                  onChange={(e) => {
                    const re = /^[0-9]*$/;
                    if (e.target.value === "" || re.test(e.target.value)) {
                      changeAnimeData(e);
                    }
                  }}
                  autoComplete="off"
                />
                <div className="input_border"></div>
              </li>
            </ul>
          </section>
          <textarea
            placeholder="აღწერა"
            name="description"
            value={animeData.description}
            onChange={changeAnimeData}
            autoComplete="off"
          />
          <button
            onClick={() => {
              if (id === "new") {
                addAnime();
              } else {
                handleUpdateAnime();
              }
            }}
          >
            {id === "new" ? "შენახვა" : "განახლება"}
          </button>
        </aside>
      </aside>
      {id !== "new" && (
        <aside id="bottom_admin">
          <div className="admin_input_wrapper">
            <input
              name="playerOne"
              value={animeSeasons.playerOne}
              onChange={handleSeasons}
              type="text"
              placeholder="ფლეიერი 1"
            />
            <div></div>
          </div>
          {playerOptions.playerTwo && (
            <div className="admin_input_wrapper">
              <input
                name="playerTwo"
                value={animeSeasons.playerTwo}
                onChange={handleSeasons}
                type="text"
                placeholder="ფლეიერი 2"
              />
              <div></div>
            </div>
          )}
          {playerOptions.playerThree && (
            <div className="admin_input_wrapper">
              <input
                name="playerThree"
                value={animeSeasons.playerThree}
                onChange={handleSeasons}
                type="text"
                placeholder="ფლეიერი 3"
              />
              <div></div>
            </div>
          )}
          <div id="season_wrapper">
            <div
              onClick={() => {
                if (animeSeasons.season !== 1)
                  addAnimeSeasons((prevState) => ({
                    ...prevState,
                    season: prevState.season - 1,
                  }));
              }}
            >
              <ArrowDown />
            </div>
            <span>სეზონი {animeSeasons.season}</span>
            <div
              onClick={() =>
                addAnimeSeasons((prevState) => ({
                  ...prevState,
                  season: prevState.season + 1,
                }))
              }
            >
              <ArrowDown />
            </div>
          </div>
          <button onClick={() => handleCreateAnimeSeason()}>
            სერიის დამატება
          </button>

          <section id="admin_series_information">
            <aside>
              <h1>სერიები</h1>
              <div id="admin_seasones_switch">
                <div
                  onClick={() => {
                    if (seasonChooser !== 1) {
                      setSeasonChooser((prevChooser) => prevChooser - 1);
                    }
                  }}
                >
                  <ArrowDown />
                </div>
                <span>სეზონი {seasonChooser}</span>
                <div
                  onClick={() => {
                    if (seasonChooser !== currentAnime?.seasons?.length) {
                      setSeasonChooser((prevChooser) => prevChooser + 1);
                    }
                  }}
                >
                  <ArrowDown />
                </div>
              </div>
              <ul>
                {currentAnime?.seasons?.map((output) => {
                  if (output?.index === seasonChooser) {
                    return output?.series.map((outputTwo, index) => (
                      <li
                        onClick={() => {
                          updatePlayers({
                            playerOne: outputTwo.playerOne,
                            playerTwo: outputTwo.playerTwo,
                            playerThree: outputTwo.playerThree,
                            seasonId: output._id,
                            playerId: outputTwo._id,
                          });
                        }}
                        key={index}
                      >
                        სერია {index + 1}
                      </li>
                    ));
                  }
                })}
              </ul>
            </aside>
            <aside>
              <h1>პარამეტრები</h1>
              <div id="admin_season_parameters">
                <div>
                  <label htmlFor="">ფლეიერი 1</label>
                  <input
                    type="text"
                    value={players.playerOne}
                    name="playerOne"
                    onChange={handlePlayers}
                  />
                </div>
                <div>
                  <label htmlFor="">ფლეიერი 2</label>
                  <input
                    type="text"
                    value={players.playerTwo}
                    name="playerTwo"
                    onChange={handlePlayers}
                  />
                </div>
                <div>
                  <label htmlFor="">ფლეიერი 3</label>
                  <input
                    type="text"
                    value={players.playerThree}
                    name="playerThree"
                    onChange={handlePlayers}
                  />
                </div>
                <div id="admin_season_button_wrapper">
                  <button
                    onClick={() => {
                      if (players?.seasonId === "") {
                        return toast.error("აირჩიეთ სერია წასაშლელად", {
                          id: "single",
                          duration: 4000,
                          style: {
                            backgroundColor: "black",
                            border: "1px solid #D084E3",
                            color: "white",
                            boxShadow: "0px 0px 30px #D084E3",
                          },
                        });
                      }
                      toast.loading("მიმდინარეობს ინფორმაციის მიღება...", {
                        id: "single",
                        duration: 4000,
                        style: {
                          backgroundColor: "black",
                          border: "1px solid #D084E3",
                          color: "white",
                          boxShadow: "0px 0px 30px #D084E3",
                        },
                      });
                      let currentSeason = currentAnime?.seasons.find(
                        (output) => output._id === players.seasonId
                      );
                      if (currentSeason?.series.length === 1) {
                        return toast.error("სეზონის პირველ სერიას ვერ წაშლით", {
                          id: "single",
                          duration: 4000,
                          style: {
                            backgroundColor: "black",
                            border: "1px solid #D084E3",
                            color: "white",
                            boxShadow: "0px 0px 30px #D084E3",
                          },
                        });
                      }
                      socket.emit("deleteSeries", {
                        Token,
                        data: {
                          seasonId: players?.seasonId,
                          playerId: players?.playerId,
                        },
                      });
                      updatePlayers({
                        playerOne: "",
                        playerTwo: "",
                        playerThree: "",
                        seasonId: "",
                        playerId: "",
                      });
                    }}
                  >
                    წაშლა
                  </button>
                  <button
                    onClick={() => {
                      if (players?.seasonId === "") {
                        return toast.error("აირჩიეთ სერია გასანახლებლად", {
                          id: "single",
                          duration: 4000,
                          style: {
                            backgroundColor: "black",
                            border: "1px solid #D084E3",
                            color: "white",
                            boxShadow: "0px 0px 30px #D084E3",
                          },
                        });
                      }
                      socket.emit("updateSeries", { Token, data: players });
                      return toast.success("სერია წარმატებით განახლდა", {
                        id: "single",
                        duration: 4000,
                        style: {
                          backgroundColor: "black",
                          border: "1px solid #D084E3",
                          color: "white",
                          boxShadow: "0px 0px 30px #D084E3",
                        },
                      });
                    }}
                  >
                    განახლება
                  </button>
                </div>
              </div>
            </aside>
          </section>
        </aside>
      )}
    </main>
  );
};

export default AdminDashboard;
