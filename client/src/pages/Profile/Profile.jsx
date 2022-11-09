import React from "react";
import "./Profile.css";
import AnimeCard from "../../components/AnimeCard/AnimeCard";
import { useRef, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { uploadImage } from "../../redux/webSlice";
import { useParams } from "react-router-dom";
import PuffLoader from "react-spinners/PuffLoader";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();
  const { user, Token, socket } = useSelector((state) => ({ ...state.web }));
  useEffect(() => {
    if (Object.values(user).length === 0) {
      navigate("/");
    }
  }, [user]);
  const imageRef = useRef(null);
  const changeAvatar = async (e) => {
    e.preventDefault();
    try {
      const file = e.target.files[0];
      let formData = new FormData();
      formData.append("file", file);

      await dispatch(uploadImage({ image: formData, Token }));
    } catch (error) {
      console.log(error);
    }
  };
  const [userData, setUserData] = useState({});
  useEffect(() => {
    if (id !== "own") {
      socket.emit("getSpecificUserData", { username: id });
    }
  }, [id, socket]);

  useEffect(() => {
    socket.on("getSpecificUserDataClient", (response) => {
      if (!response.success) return navigate("404");
      if (id !== "own") {
        setUserData(response.payload);
      }
    });
  }, [socket, id, navigate]);
  console.log("hi");
  useEffect(() => {
    if (id === "own") {
      setUserData(user);
    }
  }, [user, id]);

  return (
    <main id="profile">
      {Object.values(userData).length !== 0 ? (
        <>
          {" "}
          <div
            id="profile_avatar"
            style={{ backgroundImage: `url(${userData?.avatar})` }}
          ></div>
          <h1 id="profile_name">{userData?.username}</h1>
          <section id="profile_status">
            {userData?.status?.map((output, index) => {
              let bgColor = "";
              let fontColor = "";
              switch (output) {
                case "მომხმარებელი":
                  bgColor = "#3498db";
                  break;
                case "დეველოპერი":
                  bgColor = "#130f40";
                  fontColor = "red";
                  break;
                case "VIP":
                  bgColor = "#f1c40f";
                  break;
                case "გამხმოვანებელი":
                  bgColor = "#16a085";
                  break;
                case "მთარგმნელი":
                  bgColor = "#7bed9f";
                  break;
                case "ადმინისტრატორი":
                  bgColor = "black";
                  fontColor = "red";
                  break;
                default:
                  bgColor = "yellow";
                  fontColor = "black";
                  break;
              }
              return (
                <div
                  key={index}
                  style={{
                    backgroundColor: `${bgColor}`,
                    color: `${fontColor}`,
                  }}
                >
                  {output}
                </div>
              );
            })}
          </section>
          {id === "own" && (
            <button
              className="profile_change_avatar"
              onClick={() => imageRef.current.click()}
            >
              სურათის შეცვლა
            </button>
          )}
          <input
            onChange={changeAvatar}
            ref={imageRef}
            style={{ display: "none" }}
            type="file"
            accept="image/png, image/jpeg, image/webp"
          />
          <section id="profile_watch_later">
            {user?.watchLater.length !== 0 && (
              <h4>{id === "own" ? "გააგრძელე ყურება" : "უყურებს ანიმეებს"}</h4>
            )}

            <article id="profile_watch_later_animes">
              {Object.values(userData).length !== 0 &&
                userData?.watchLater?.map((output, index) => (
                  <AnimeCard key={index} anime={output?.anime} />
                ))}
            </article>
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
    </main>
  );
};

export default Profile;
