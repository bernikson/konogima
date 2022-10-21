import "./Anime.css";
import Comment from "../../assets/svgs/Comment";
import Dislike from "../../assets/svgs/Dislike";
import Like from "../../assets/svgs/Like";
import Views from "../../assets/svgs/Views";
import ArrowDown from "../../assets/svgs/ArrowDown";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { updateAuthState, clearComments } from "../../redux/webSlice";
import { toast } from "react-hot-toast";
import CommentCard from "../../components/CommentCard/CommentCard";

const Anime = () => {
  //! Intiaializations
  const iframeRef = useRef();

  const dispatch = useDispatch();

  const { animes, socket, Token, user, comments } = useSelector((state) => ({
    ...state.web,
  }));
  //! ----------------------------

  //! states
  const { id } = useParams();

  const [filteredArray, setFilteredArray] = useState([]);

  const [pageCounter, SetPageCounter] = useState(0);

  //? Anime players toggle on/off
  const [animeOptions, setAnimeOptions] = useState({
    season: false,
    series: false,
    player: false,
  });

  //? Displays total series in a season
  const [seriesData, setSeriesData] = useState([]);

  //? Saves selected serie data
  const [serieToPlay, setSerieToPlay] = useState({});

  //? Displays which serie data user chose
  const [playerDetails, setPlayerDetails] = useState({
    season: "",
    series: "",
    player: "",
  });

  //? Displays which serie to play
  const [playerToUse, setPlayerToUse] = useState();

  const [comment, setComment] = useState("");

  const [views, setViews] = useState(0);

  const [likes, setLikes] = useState([]);

  const [dislikes, setDislikes] = useState([]);

  //! ---------------------------

  //! useEffects
  //* Gets comments
  useEffect(() => {
    console.log("first");
    socket.emit("getComments", { animeId: id, pages: pageCounter });
  }, [id, pageCounter, socket]);

  useEffect(() => {
    console.log("third");
    let editableComments = [...comments];
    let sortedComments = editableComments?.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
    console.log(pageCounter * 10);
    // let filteredComments = sortedComments.slice(pageCounter * 10, 10);
    let filteredComments = sortedComments.filter(
      (arr, index) => index < (pageCounter + 1) * 10
    );

    console.log(sortedComments); // length is 14
    console.log(filteredComments); // []
    setFilteredArray(filteredComments);
  }, [comments]);

  //* Clears comment data on leave
  useEffect(() => {
    return () => {
      dispatch(clearComments());
    };
  }, [dispatch]);

  //! ---------------------------

  const currentAnime = animes?.find((anime) => anime._id === id);
  let totalSeries = 0;
  currentAnime?.seasons?.forEach((season) => {
    season?.series?.forEach(() => {
      totalSeries += 1;
    });
  });

  const writeComment = () => {
    if (Object.values(user).length === 0) return dispatch(updateAuthState(1));
    if (comment === "")
      return toast.error("ცარიელ კომენტარს ვერ დაწერთ!", {
        id: "single",
        duration: 4000,
        style: {
          backgroundColor: "black",
          border: "1px solid #D084E3",
          color: "white",
          boxShadow: "0px 0px 30px #D084E3",
        },
      });
    if (comment.length >= 1000)
      return toast.error("ათას სიმბოლოზე მეტს ვერ დაწერთ კომენტარში!", {
        id: "single",
        duration: 4000,
        style: {
          backgroundColor: "black",
          border: "1px solid #D084E3",
          color: "white",
          boxShadow: "0px 0px 30px #D084E3",
        },
      });
    let commentData = {
      username: user?.username,
      comment,
      animeId: id,
      avatar: user?.avatar,
    };
    socket.emit("writeComment", { Token, commentData, pages: pageCounter });
    setComment("");
  };

  useEffect(() => {
    if (currentAnime?.seasons !== undefined) {
      setSeriesData(currentAnime?.seasons[0]?.series);
    }
  }, [currentAnime]);

  useEffect(() => {
    if (
      currentAnime?.seasons !== undefined &&
      currentAnime?.seasons?.length !== 0
    ) {
      setSerieToPlay(currentAnime?.seasons[0]?.series[0]);
    }
  }, [currentAnime]);

  useEffect(() => {
    if (serieToPlay !== undefined) {
      setPlayerToUse(serieToPlay?.playerOne);
    }
  }, [currentAnime, serieToPlay]);

  useEffect(() => {
    setViews(currentAnime?.views);
  }, [currentAnime]);
  useEffect(() => {
    setLikes(currentAnime?.likes);
  }, [currentAnime]);
  useEffect(() => {
    setDislikes(currentAnime?.dislikes);
  }, [currentAnime]);
  useEffect(() => {
    iframeRef.current.onblur = () => {
      alert("hi");
      setViews((prevViews) => prevViews + 1);
      socket.emit("giveView", { animeId: currentAnime?._id });
    };
  }, [iframeRef, currentAnime?._id, socket]);
  return (
    <main id="anime">
      <h1>{currentAnime?.name}</h1>
      <section id="anime_aside_wrapper">
        <aside>
          <div
            id="anime_background"
            style={{ backgroundImage: `url(${currentAnime?.background})` }}
          ></div>
          <div id="anime_views">
            <Views width="35" />
            <span>{views}</span>
          </div>
          <div id="anime_ratings_wrapper">
            <div
              onClick={() => {
                if (localStorage.getItem("isLogged") !== "true") {
                  dispatch(updateAuthState(1));
                } else {
                  socket.emit("giveLike", {
                    Token,
                    userId: user?._id,
                    animeId: currentAnime?._id,
                  });
                  if (likes.includes(user?._id)) {
                    setLikes(likes.filter((like) => like._id === user?._id));
                  } else {
                    if (dislikes.includes(user?._id)) {
                      setDislikes(
                        dislikes.filter((dislike) => dislike._id === user?._id)
                      );
                    }
                    setLikes((oldLikes) => [...oldLikes, user?._id]);
                  }
                }
              }}
            >
              <Like width="40px" />
              <span>{likes?.length}</span>
            </div>
            <div
              onClick={() => {
                if (localStorage.getItem("isLogged") !== "true") {
                  dispatch(updateAuthState(1));
                } else {
                  socket.emit("giveDislike", {
                    Token,
                    userId: user?._id,
                    animeId: currentAnime?._id,
                  });
                  if (dislikes.includes(user?._id)) {
                    setDislikes(
                      dislikes.filter((dislike) => dislike._id === user?._id)
                    );
                  } else {
                    if (likes.includes(user?._id)) {
                      setLikes(likes.filter((like) => like._id === user?._id));
                    }
                    setDislikes((oldDislikes) => [...oldDislikes, user?._id]);
                  }
                }
              }}
            >
              <Dislike width="40px" />
              <span>{dislikes?.length}</span>
            </div>
          </div>
        </aside>
        <aside>
          <div id="anime_info_wrapper">
            <ul>
              <li>
                წელი:
                <span>{currentAnime?.year}</span>
              </li>
              <li>
                სერია:
                <span>
                  {totalSeries} / {currentAnime?.series} სერია
                </span>
              </li>
              <li>
                გამხმოვანებელი:
                <span>{currentAnime?.voiceover}</span>
              </li>
              <li>
                მთარგმელი:
                <span>{currentAnime?.translator}</span>
              </li>
              <li>
                სტატუსი:
                <span>მიმდინარე</span>
              </li>
            </ul>
            <ul>
              <li>
                ქრონომეტრაჟი:
                <span>{currentAnime?.totaltime} წუთი</span>
              </li>
              <li>
                ჟანრი:
                <span>
                  {currentAnime?.genres
                    ?.join(" / ")
                    .split(" ")
                    .map((genre, index) => {
                      if (genre !== "/") {
                        return (
                          <span
                            key={index}
                            style={{ color: "#55efc4", cursor: "pointer" }}
                          >
                            {genre}
                          </span>
                        );
                      } else {
                        return `${" "} ${genre} ${" "}`;
                      }
                    })}
                </span>
              </li>
              <li>
                რეჟისორი:
                <span>{currentAnime?.director}</span>
              </li>
              <li>
                სტუდია:
                <span>{currentAnime?.studio}</span>
              </li>
              <li>
                ასაკი:
                <span>{currentAnime?.age}+</span>
              </li>
            </ul>
          </div>
          <h4>მოკლე აღწერა</h4>
          <p>{currentAnime?.description}</p>
        </aside>
      </section>
      <div id="iframe_wrapper">
        <iframe ref={iframeRef} src={playerToUse} title="Anime player"></iframe>
        <div id="video_options">
          <aside>
            <div
              className={animeOptions.season ? "animeDropSvg" : undefined}
              onClick={() =>
                setAnimeOptions({
                  season: !animeOptions.season,
                  series: false,
                  player: false,
                })
              }
            >
              <span>სეზონი {playerDetails?.season}</span>
              <ArrowDown width="20px" />
            </div>
            <ul
              className={animeOptions.season ? "triggeredAnimeDrop" : undefined}
            >
              {currentAnime?.seasons?.map((season, index) => (
                <li
                  onClick={() => {
                    setAnimeOptions({
                      season: false,
                      series: true,
                      player: false,
                    });
                    setPlayerDetails({ ...playerDetails, season: index + 1 });
                    setSeriesData(season?.series);
                  }}
                  key={index}
                >
                  სეზონი {index + 1}
                </li>
              ))}
            </ul>
          </aside>
          <aside>
            <div
              className={animeOptions.series ? "animeDropSvg" : undefined}
              onClick={() =>
                setAnimeOptions({
                  season: false,
                  series: !animeOptions.series,
                  player: false,
                })
              }
            >
              <span>სერია {playerDetails?.series}</span>
              <ArrowDown width="20px" />
            </div>

            <ul
              className={animeOptions.series ? "triggeredAnimeDrop" : undefined}
            >
              {seriesData?.map((serie, index) => (
                <li
                  key={index}
                  onClick={() => {
                    setAnimeOptions({
                      season: false,
                      series: false,
                      player: false,
                    });
                    setPlayerDetails({ ...playerDetails, series: index + 1 });
                    setSerieToPlay(serie);
                  }}
                >
                  სერია {index + 1}
                </li>
              ))}
            </ul>
          </aside>
          <aside>
            <div
              className={animeOptions.player ? "animeDropSvg" : undefined}
              onClick={() =>
                setAnimeOptions({
                  season: false,
                  series: false,
                  player: !animeOptions?.player,
                })
              }
            >
              <span>ფლეიერი {playerDetails?.player || 1}</span>
              <ArrowDown width="20px" />
            </div>
            <ul
              className={
                animeOptions?.player ? "triggeredAnimeDrop" : undefined
              }
            >
              {Object.values(serieToPlay)?.map((output, index) => {
                if (output !== "" && index !== 3) {
                  return (
                    <li
                      key={index}
                      onClick={() => {
                        setAnimeOptions({
                          season: false,
                          series: false,
                          player: false,
                        });
                        setPlayerDetails({
                          ...playerDetails,
                          player: index + 1,
                        });
                        setPlayerToUse(output);
                      }}
                    >
                      ფლეიერი {index + 1}
                    </li>
                  );
                } else {
                  return null;
                }
              })}
            </ul>
          </aside>
        </div>
      </div>
      <section id="anime_comments_wrapper">
        <div id="anime_comments_count">
          <Comment width="40" />
          <span>31 კომენტარი</span>
        </div>
        <textarea
          cols="30"
          rows="10"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        ></textarea>
        <button id="anime_add_comment" onClick={writeComment}>
          დაპოსტე კომენტარი
        </button>
        <section id="anime_comments">
          {filteredArray?.map((output, index) => {
            if (!output.isChild) {
              return <CommentCard id={id} key={index} data={output} />;
            }
          })}
        </section>
        <button
          className="anime_load_comments"
          onClick={() => {
            SetPageCounter((prevCounter) => prevCounter + 1);
          }}
        >
          დამატებითი კომენტარების ჩატვირთვა
        </button>
      </section>
    </main>
  );
};

export default Anime;
