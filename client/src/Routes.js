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
  clearStatus,
  getAnimes,
  updateAnimeSeriesRedux,
  addWatchLater,
  logout,
  addReply,
  sortAnimes,
  getUserData,
} from "./redux/webSlice";
import ResetPassword from "./pages/ResetPassword/ResetPassword";
import { toast } from "react-hot-toast";
import NotFound from "./pages/NotFound/NotFound";
import { useMemo } from "react";

const App = () => {
  //! Initialiations
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { socket, Token, success, loading, error, user, sortedAnimes } =
    useSelector((state) => ({
      ...state.web,
    }));
  let isLogged = useMemo(() => localStorage.getItem("isLogged"), []);
  let checkAdmin = useMemo(
    () => Object.values(user).length !== 0 && user.role !== 0,
    [user]
  );

  const ErrorHandler = (type, message) => {
    if (type === "error") {
      return toast.error(message, {
        id: "single",
        duration: 4000,
        style: {
          backgroundColor: "black",
          border: "1px solid #D084E3",
          color: "white",
          boxShadow: "0px 0px 30px #D084E3",
        },
      });
    } else if (type === "success") {
      return toast.success(message, {
        id: "single",
        duration: 4000,
        style: {
          backgroundColor: "black",
          border: "1px solid #D084E3",
          color: "white",
          boxShadow: "0px 0px 30px #D084E3",
        },
      });
    } else {
      return toast.loading("მიმდინარეობს ინფორმაციის მიღება...", {
        id: "single",
        duration: 8000,
        style: {
          backgroundColor: "black",
          border: "1px solid #D084E3",
          color: "white",
          boxShadow: "0px 0px 30px #D084E3",
        },
      });
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  //! -------------------------------------------------

  //! Use effects

  useEffect(() => {
    dispatch(getAnimes());
  }, [dispatch]);

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
      dispatch(getUserData({ Token }));
    }
  }, [socket, Token]);

  useEffect(() => {
    socket.on("updateAnimeSerie", async (payload) => {
      if (!payload.success) return ErrorHandler("error", payload.message);
      dispatch(updateAnimeSeriesRedux(payload.payload));
    });
    socket.on("likeCommentClient", async (payload) => {
      if (!payload.success) return ErrorHandler("error", payload.message);
      dispatch(addReply(payload.payload));
    });
    socket.on("deleteAnimeSerie", async (payload) => {
      if (!payload.success) return ErrorHandler("error", payload.message);
      dispatch(updateAnimeSeriesRedux(payload.payload));
      return ErrorHandler("success", "სერია წარმატებით წაიშალა");
    });
    socket.on("dislikeCommentClient", async (payload) => {
      if (!payload.success) return ErrorHandler("error", payload.message);
    });
    socket.on("watchLaterClient", async (payload) => {
      dispatch(addWatchLater(payload));
    });
  }, [socket, dispatch]);

  useEffect(() => {
    if (error === "ტოკენს ვადა გაუვიდა" || error === "jwt expired") {
      dispatch(logout());
    }
  }, [error]);

  useEffect(() => {
    isLogged === "true" && dispatch(getToken());
  }, [isLogged, dispatch]);

  useEffect(() => {
    dispatch(clearStatus());
  }, [error, success, loading, dispatch]);

  //! -------------------------------------------------

  //!Notifications
  loading && ErrorHandler();
  error && ErrorHandler("error", error);

  success && ErrorHandler("success", success);

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
