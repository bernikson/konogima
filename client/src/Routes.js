import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import Home from "./pages/Home/Home";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import Anime from "./pages/Anime/Anime";
import Admin from "./pages/Admin/Admin";
import AdminDashboard from "./pages/AdminDashboard/AdminDashboard";
import Profile from "./pages/Profile/Profile";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getToken,
  updateUserState,
  clearStatus,
  getAnimes,
  addAnime,
  addUpdatedAnime,
  addAnimeSeasonRedux,
  updateAnimeSeriesRedux,
  addWatchLater,
  addReply,
  sortAnimes,
  deleteAnime,
} from "./redux/webSlice";
import ResetPassword from "./pages/ResetPassword/ResetPassword";
import { toast } from "react-hot-toast";
import NotFound from "./pages/NotFound/NotFound";

const App = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { socket, Token, success, loading, error, user, sortedAnimes } =
    useSelector((state) => ({
      ...state.web,
    }));
  let isLogged = localStorage.getItem("isLogged");
  useEffect(() => {
    if (sortedAnimes.length !== 0) {
      navigate("/");
    }
  }, [sortedAnimes]);
  useEffect(() => {
    if (pathname !== "/") dispatch(sortAnimes([]));
  }, [navigate, dispatch]);
  useEffect(() => {
    if (Token?.length !== 0 && Token !== null) {
      socket.emit("getUserData", Token);
    }
  }, [socket, Token]);
  useEffect(() => {
    socket.on("getUserDataClient", (data) => {
      dispatch(updateUserState(data.payload));
    });
  }, [socket, dispatch]);
  useEffect(() => {
    isLogged === "true" && dispatch(getToken());
  }, [isLogged, dispatch]);
  useEffect(() => {
    const refershTokenInterval = () => {
      dispatch(getToken());
    };
    if (Object.values(user).length === 0) return;
    let interval = setInterval(refershTokenInterval, 1000 * 60 * 30);
    return () => clearInterval(interval);
  }, [isLogged, dispatch, user]);

  useEffect(() => {
    socket.emit("getAnimes");
  }, [socket]);
  useEffect(() => {
    socket.on("getAnimesClient", (data) => {
      dispatch(getAnimes(data.payload));
    });
  }, [socket, dispatch]);
  useEffect(() => {
    socket.on("createAnimeClient", async ({ payload }) => {
      await dispatch(addAnime({ payload }));
      console.log("hi");
      if (user?.role === 1) navigate("/admin");
    });
  }, [socket, dispatch]);
  useEffect(() => {
    socket.on("deleteAnimeClient", async ({ payload }) => {
      await dispatch(deleteAnime({ payload }));
      if (user?.role === 1) navigate("/admin");
    });
  }, [socket, dispatch]);
  useEffect(() => {
    socket.on("updateAnimeClient", async ({ payload }) => {
      await dispatch(addUpdatedAnime({ payload }));
      if (user?.role === 1) navigate("/admin");
      console.log(user);
      console.log(user?.role);
    });
  }, [socket, dispatch]);
  useEffect(() => {
    socket.on("createAnimeSeason", async (payload) => {
      if (!payload.success) {
        return toast.error(payload.message, {
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
      dispatch(addAnimeSeasonRedux(payload.payload));
      return toast.success("სერია წარმატებით დაემატა", {
        id: "single",
        duration: 4000,
        style: {
          backgroundColor: "black",
          border: "1px solid #D084E3",
          color: "white",
          boxShadow: "0px 0px 30px #D084E3",
        },
      });
    });
  }, [socket, dispatch]);

  useEffect(() => {
    socket.on("updateAnimeSerie", async (payload) => {
      if (!payload.success) {
        return toast.error(payload.message, {
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
      dispatch(updateAnimeSeriesRedux(payload.payload));
    });
  }, [socket, dispatch]);
  useEffect(() => {
    socket.on("deleteAnimeSerie", async (payload) => {
      if (!payload.success) {
        return toast.error(payload.message, {
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
      toast.success("სერია წარმატებით წაიშალა", {
        id: "single",
        duration: 4000,
        style: {
          backgroundColor: "black",
          border: "1px solid #D084E3",
          color: "white",
          boxShadow: "0px 0px 30px #D084E3",
        },
      });

      dispatch(updateAnimeSeriesRedux(payload.payload));
    });
  }, [socket, dispatch]);

  useEffect(() => {
    socket.on("likeCommentClient", async (payload) => {
      if (!payload.success) {
        return toast.error(payload.message, {
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
      dispatch(addReply(payload.payload));
    });
  }, [socket, dispatch]);
  useEffect(() => {
    socket.on("dislikeCommentClient", async (payload) => {
      if (!payload.success) {
        return toast.error(payload.message, {
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
      console.log(payload);
    });
  }, [socket, dispatch]);

  useEffect(() => {
    socket.on("watchLaterClient", async (payload) => {
      dispatch(addWatchLater(payload));
    });
  }, [socket, dispatch]);

  //!Notifications
  loading &&
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
  error &&
    toast.error(error, {
      id: "single",
      duration: 4000,
      style: {
        backgroundColor: "black",
        border: "1px solid #D084E3",
        color: "white",
        boxShadow: "0px 0px 30px #D084E3",
      },
    });

  success &&
    toast.success(success, {
      id: "single",
      duration: 4000,
      style: {
        backgroundColor: "black",
        border: "1px solid #D084E3",
        color: "white",
        boxShadow: "0px 0px 30px #D084E3",
      },
    });

  useEffect(() => {
    dispatch(clearStatus());
  }, [error, success, loading, dispatch]);
  let checkAdmin = Object.values(user).length !== 0 && user.role !== 0;
  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/anime/:id" element={<Anime />} />
        <Route path="/admin" element={checkAdmin && <Admin />} />
        <Route
          path="/admin_dashboard/:id"
          element={checkAdmin && <AdminDashboard />}
        />
        <Route path="/profile/:id" element={<Profile />} />
        <Route path="/reset_password/:id" element={<ResetPassword />} />
        <Route path="/*" element={<NotFound />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;
