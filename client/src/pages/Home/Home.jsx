import "./Home.css";
import { useEffect, useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import AnimeCard from "../../components/AnimeCard/AnimeCard";
import { sortAnimes } from "../../redux/webSlice";
import PuffLoader from "react-spinners/PuffLoader";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const Home = () => {
  //! Initializations
  const dispatch = useDispatch();
  const { animes, user, sortedAnimes } = useSelector((state) => ({
    ...state.web,
  }));
  //! -----------------------------------------------------------

  //! useStates
  const [popularAnimes, setPopularAnimes] = useState([]);
  const [allArr, setAllArr] = useState([]);

  let isLogged = useMemo(() => localStorage.getItem("isLogged"), []);

  //! -----------------------------------------------------------

  //! useEffects
  useEffect(() => {
    setPopularAnimes(
      [...animes]
        .sort((a, b) => b.views - a.views)
        .filter((arr, index) => index < 10)
    );
  }, [animes]);

  useEffect(() => {
    setAllArr(animes);
  }, [animes]);

  useEffect(() => {
    if (sortedAnimes.length === 0) return;
    let foundAnime = animes.filter((anime) => {
      if (anime.genres.includes(sortedAnimes)) return anime;
      return null;
    });
    if (foundAnime === undefined) return setAllArr([]);
    setAllArr(foundAnime);
  }, [sortedAnimes, animes]);

  //! -----------------------------------------------------------

  return (
    <main id="home">
      {Object.values(animes).length !== 0 ? (
        <>
          <section id="home_popular">
            {sortedAnimes.length === 0 && (
              <>
                <h1>პოპულარულები</h1>
                <Swiper
                  slidesPerView={3}
                  spaceBetween={33}
                  slidesPerGroup={1}
                  autoplay={{
                    delay: 2500,
                    disableOnInteraction: false,
                  }}
                  loop={true}
                  loopFillGroupWithBlank={true}
                  pagination={{
                    clickable: true,
                  }}
                  breakpoints={{
                    100: {
                      slidesPerView: 1,
                    },
                    530: {
                      slidesPerView: 2,
                    },
                    1600: {
                      slidesPerView: 4,
                    },
                    1800: {
                      slidesPerView: 5,
                    },
                  }}
                  navigation={true}
                  modules={[Autoplay, Pagination, Navigation]}
                  className="mySwiper"
                >
                  {popularAnimes?.map((anime, index) => (
                    <SwiperSlide>
                      <AnimeCard key={index} anime={anime} />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </>
            )}
          </section>

          <section id="home_last_played">
            {isLogged === "true" &&
              sortedAnimes.length === 0 &&
              Object.values(user).length !== 0 &&
              user?.watchLater.length !== 0 && (
                <>
                  <h1>გააგრძელე ყურება</h1>
                  <article>
                    {Object.values(user).length !== 0 &&
                      user?.watchLater?.map((output, index) => (
                        <AnimeCard key={index} anime={output?.anime} />
                      ))}
                  </article>
                </>
              )}
          </section>

          <section id="all">
            <div style={{ display: "flex", gap: "1rem" }}>
              <h1>ყველა ანიმე</h1>
              {sortedAnimes?.length !== 0 && (
                <button
                  onClick={() => {
                    setAllArr(animes);
                    dispatch(sortAnimes(""));
                  }}
                >
                  უკან დაბრუნება
                </button>
              )}
            </div>

            <article>
              {allArr?.map((anime, index) => (
                <AnimeCard key={index} anime={anime} />
              ))}
            </article>
            {allArr.length === 0 && (
              <span className="home_anime_filter_text">
                ანიმეები ვერ მოიძებნა
              </span>
            )}
          </section>
        </>
      ) : (
        <PuffLoader
          className="profileHandler"
          color="#d084e3"
          loading={true}
          size={500}
          speedMultiplier={1}
        />
      )}
      {/* <button>მეტის ჩატვირთვა</button> */}
    </main>
  );
};

export default Home;
