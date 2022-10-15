import { Routes, Route, useNavigate } from "react-router-dom";
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
} from "./redux/webSlice";
import ResetPassword from "./pages/ResetPassword/ResetPassword";
import { toast } from "react-hot-toast";

const App = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { socket, Token, success, loading, error } = useSelector((state) => ({
    ...state.web,
  }));
  const isLogged = localStorage.getItem("isLogged");
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
    setInterval(refershTokenInterval, 30000);
    return () => clearInterval(refershTokenInterval);
  }, []);

  useEffect(() => {
    socket.emit("getAnimes");
  }, [socket]);
  useEffect(() => {
    socket.on("getAnimesClient", (data) => {
      dispatch(getAnimes(data.payload));
    });
  }, [socket]);
  useEffect(() => {
    socket.on("createAnimeClient", async ({ payload }) => {
      await dispatch(addAnime({ payload }));
      navigate("/admin");
    });
  }, [socket]);
  useEffect(() => {
    socket.on("updateAnimeClient", async ({ payload }) => {
      await dispatch(addUpdatedAnime({ payload }));
      navigate("/admin");
    });
  }, [socket]);
  useEffect(() => {
    socket.on("createAnimeSeason", async ({ payload }) => {
      dispatch(addAnimeSeasonRedux(payload));
    });
  }, [socket]);

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
  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/anime/:id" element={<Anime />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin_dashboard/:id" element={<AdminDashboard />} />
        <Route path="/profile/:id" element={<Profile />} />
        <Route path="/reset_password/:id" element={<ResetPassword />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;
