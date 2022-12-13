import "./Home.css";
import { useEffect, useState, useMemo, lazy, Suspense } from "react";
import { useSelector, useDispatch } from "react-redux";

import {
  sortAnimes,
  searchAnimes,
  updateContentState,
} from "../../redux/webSlice";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import AnimSkeleton from "../../components/AnimSkeleton/AnimSkeleton";
import StarFull from "../../assets/svgs/StarFull";
import StarHalf from "../../assets/svgs/StarHalf";
import StarEmpty from "../../assets/svgs/StarEmpty";
import Search from "../../assets/svgs/Search";
import { useNavigate } from "react-router-dom";

const AnimeCard = lazy(() => import("../../components/AnimeCard/AnimeCard"));

const Home = () => {
  const navigate = useNavigate();
  //! Initializations
  const dispatch = useDispatch();
  const { animes, user, sortedAnimes, searchedAnimes, contentState, products } =
    useSelector((state) => ({
      ...state.web,
    }));
  //! -----------------------------------------------------------

  //! useStates
  const [popularAnimes, setPopularAnimes] = useState([]);
  const [allArr, setAllArr] = useState([]);
  const [page, setPage] = useState(1);

  let isLogged = useMemo(() => localStorage.getItem("isLogged"), []);

  //! -----------------------------------------------------------

  //! useEffects
  useEffect(() => {
    if (animes === undefined) return;
    setPopularAnimes(
      [...animes]
        ?.sort((a, b) => b.views - a.views)
        ?.filter((arr, index) => index < 10)
    );
  }, [animes]);

  useEffect(() => {
    if (sortedAnimes.length === 0) {
      setAllArr(animes.slice(0, page * 10));
    }
  }, [sortedAnimes.length, page]);

  useEffect(() => {
    dispatch(searchAnimes(animes));
  }, [animes]);

  useEffect(() => {
    setAllArr(searchedAnimes.slice(0, page * 10));
  }, [searchedAnimes?.length, page]);

  useEffect(() => {
    if (sortedAnimes.length === 0) return;
    let foundAnime = [];

    // animes?.forEach((element) => {
    //   sortedAnimes.every((v) => {
    //     allArr.filter((test) => {
    //       return test?.genres?.includes(v);
    //     });
    //     console.log(allArr);
    //   });
    //   return foundAnime;
    // });

    animes?.filter((output) => {
      let checkArr = sortedAnimes?.every((v) => output?.genres?.includes(v));
      if (checkArr) return foundAnime.push(output);
    });
    if (foundAnime === undefined) return setAllArr([]);
    setAllArr(foundAnime);
  }, [sortedAnimes, animes]);

  // useEffect(() => {
  //   user?.watchLater?.sort((a, b) => b?.anime?.views - a?.anime?.views);
  // }, [user]);

  //! -----------------------------------------------------------

  return (
    <main
      id="home"
      className={contentState === "მაღაზია" ? "home_shop" : undefined}
    >
      {/* {Object.values(animes).length !== 0 ? ( */}
      <article id="content_navigator_two">
        <span
          onClick={() => dispatch(updateContentState("ანიმე"))}
          className={
            contentState === "ანიმე" ? "modifiedContentState" : undefined
          }
        >
          ანიმე
        </span>
        <span
          style={{ cursor: "not-allowed" }}
          className={
            contentState === "მანგა" ? "modifiedContentState" : undefined
          }
        >
          მანგა
        </span>
        <span
          style={{ cursor: "not-allowed" }}
          className={
            contentState === "დორამა" ? "modifiedContentState" : undefined
          }
        >
          დორამა
        </span>
        <span
          style={{ cursor: "not-allowed" }}
          className={
            contentState === "მაღაზია" ? "modifiedContentState" : undefined
          }
        >
          მაღაზია
        </span>
      </article>
      {contentState === "ანიმე" && (
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
                  breakpoints={{
                    100: {
                      slidesPerView: 1,
                    },
                    320: {
                      spaceBetween: 20,
                      slidesPerView: 2,
                    },
                    640: {
                      slidesPerView: 3,
                    },
                    950: {
                      slidesPerView: 4,
                    },
                    1000: {
                      slidesPerView: 3,
                    },
                    1220: {
                      slidesPerView: 4,
                    },
                    1660: {
                      slidesPerView: 5,
                    },
                    2250: {
                      slidesPerView: 6,
                    },
                  }}
                  navigation={true}
                  modules={[Autoplay, Navigation]}
                  className="mySwiper"
                >
                  {popularAnimes?.length !== 0
                    ? popularAnimes?.map((anime, index) => (
                        <SwiperSlide>
                          <Suspense fallback={<div>Loading...</div>}>
                            <AnimeCard key={index} anime={anime} />
                          </Suspense>
                        </SwiperSlide>
                      ))
                    : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]?.map((anime, index) => (
                        <SwiperSlide>
                          <Suspense fallback={<div>Loading...</div>}>
                            <AnimSkeleton />
                          </Suspense>
                        </SwiperSlide>
                      ))}
                </Swiper>
              </>
            )}
          </section>
          {/* <article className="ADMain">სარეკლამო ადგილი</article> */}
          {user?.watchLater?.length >= 5 ? (
            <section id="home_last_played">
              {isLogged === "true" &&
                sortedAnimes.length === 0 &&
                Object.values(user).length !== 0 &&
                user?.watchLater.length !== 0 && (
                  <>
                    <h1>გააგრძელე ყურება</h1>
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
                      breakpoints={{
                        100: {
                          slidesPerView: 1,
                        },
                        320: {
                          spaceBetween: 20,
                          slidesPerView: 2,
                        },
                        640: {
                          slidesPerView: 3,
                        },
                        950: {
                          slidesPerView: 4,
                        },
                        1000: {
                          slidesPerView: 3,
                        },
                        1220: {
                          slidesPerView: 4,
                        },
                        1660: {
                          slidesPerView: 5,
                        },
                        2250: {
                          slidesPerView: 6,
                        },
                      }}
                      navigation={true}
                      modules={[Autoplay, Navigation]}
                      className="mySwiper"
                    >
                      {Object.values(user).length !== 0 &&
                        user?.watchLater?.map((output, index) => (
                          <SwiperSlide>
                            <Suspense fallback={<div>Loading...</div>}>
                              <AnimeCard key={index} anime={output?.anime} />
                            </Suspense>
                          </SwiperSlide>
                        ))}
                    </Swiper>
                  </>
                )}
            </section>
          ) : (
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
                          <Suspense fallback={<div>Loading...</div>}>
                            <AnimeCard key={index} anime={output?.anime} />
                          </Suspense>
                        ))}
                    </article>
                  </>
                )}
            </section>
          )}
          {/* <article className="ADMain">სარეკლამო ადგილი</article> */}
          <section id="all">
            <div style={{ display: "flex", gap: "1rem" }}>
              <h1
                style={{ cursor: "pointer" }}
                onClick={async () => {
                  await dispatch(sortAnimes(animes));
                  await setAllArr(animes);
                }}
              >
                ყველა ანიმე
              </h1>
              {sortedAnimes?.length !== 0 && (
                <button
                  onClick={() => {
                    setAllArr(animes);
                    dispatch(sortAnimes([]));
                  }}
                >
                  უკან დაბრუნება
                </button>
              )}
            </div>

            <article>
              {animes?.length !== 0
                ? allArr?.map((anime, index) => (
                    <Suspense fallback={<div>Loading...</div>}>
                      <AnimeCard key={index} anime={anime} />
                    </Suspense>
                  ))
                : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]?.map((anime, index) => (
                    <Suspense fallback={<div>Loading...</div>}>
                      <AnimSkeleton />
                    </Suspense>
                  ))}
            </article>
            {animes?.length !== 0 && allArr?.length === 0 && (
              <span className="home_anime_filter_text">
                ანიმეები ვერ მოიძებნა
              </span>
            )}
          </section>
          {/* <article className="ADMain">სარეკლამო ადგილი</article> */}
        </>
      )}
      {contentState === "მაღაზია" && (
        <>
          <section id="home_product_section">
            {products?.map((product) => {
              return (
                <artice
                  className="home_product"
                  onClick={() => navigate(`/product/${product._id}`)}
                >
                  <div className="home_product_hover">
                    <Search />
                  </div>
                  <div
                    className="home_product_background"
                    style={{ backgroundImage: `url(${product?.background})` }}
                  ></div>
                  <div>
                    <h6>{product?.type}</h6>
                    <h3>{product?.name}</h3>
                    <div className="home_product_ratings">
                      <StarFull />
                      <StarFull />
                      <StarFull />
                      <StarHalf />
                      <StarEmpty />
                    </div>
                    <div className="home_product_price">
                      {product?.salePrice && (
                        <span className="home_product_sale">
                          ₾{product?.salePrice}
                        </span>
                      )}

                      <span
                        className={`home_product_real ${
                          !product?.salePrice
                            ? "home_product_saleOriginal"
                            : undefined
                        }`}
                      >
                        ₾{product?.price}
                      </span>
                      {product?.salePrice && (
                        <div>
                          {(
                            (100 * (product?.price - product?.salePrice)) /
                            product?.price
                          ).toFixed(0)}
                          %
                        </div>
                      )}
                    </div>
                  </div>
                </artice>
              );
            })}
          </section>
        </>
      )}

      {allArr?.length !== animes?.length && contentState === "ანიმე" && (
        <button onClick={() => setPage(page + 1)}>მეტის ჩატვირთვა</button>
      )}
      {/* 
      <article className="ADFirst">სარეკლამო ადგილი</article>
      <article className="ADSecond">სარეკლამო ადგილი</article> */}
      <div
        className="ADChristmas"
        onClick={() =>
          window.open(
            "https://www.facebook.com/photo/?fbid=126118300305677&set=a.116585024592338",
            "_blank"
          )
        }
      ></div>
      <div
        className="ADChristmasTwo"
        onClick={() =>
          window.open(
            "https://www.facebook.com/photo/?fbid=126118300305677&set=a.116585024592338",
            "_blank"
          )
        }
      ></div>
    </main>
  );
};

export default Home;
