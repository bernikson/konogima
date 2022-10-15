import React from "react";
import "./Profile.css";
import AnimeCard from "../../components/AnimeCard/AnimeCard";
import { useRef } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { uploadImage } from "../../redux/webSlice";

const Profile = () => {
  const dispatch = useDispatch();
  const { user, Token } = useSelector((state) => ({ ...state.web }));
  const { id } = useParams();
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
  return (
    <main id="profile">
      <div
        id="profile_avatar"
        style={{ backgroundImage: `url(${user?.avatar})` }}
      ></div>
      <h1 id="profile_name">{user?.username}</h1>
      <section id="profile_status">
        {user?.status?.map((output) => {
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
            case "მთარგმელი":
              bgColor = "#7bed9f";
              break;
            default:
              bgColor = "yellow";
              fontColor = "black";
              break;
          }
          return (
            <div
              style={{ backgroundColor: `${bgColor}`, color: `${fontColor}` }}
            >
              {output}
            </div>
          );
        })}
      </section>
      <button
        className="profile_change_avatar"
        onClick={() => imageRef.current.click()}
      >
        სურათის შეცვლა
      </button>
      <input
        onChange={changeAvatar}
        ref={imageRef}
        style={{ display: "none" }}
        type="file"
        accept="image/png, image/jpeg, image/webp"
      />
      <section id="profile_watch_later">
        <h4>გააგრძელე ყურება</h4>
        <article id="profile_watch_later_animes">
          <AnimeCard />
          <AnimeCard />
          <AnimeCard />
          <AnimeCard />
          <AnimeCard />
        </article>
      </section>
    </main>
  );
};

export default Profile;
