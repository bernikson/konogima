import React from "react";
import Edit from "../../assets/svgs/Edit";
import "./Admin.css";
import { useNavigate } from "react-router-dom";
import Add from "../../assets/svgs/Add";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";

const Admin = () => {
  const [adminState, setAdminState] = useState(0);
  const [connectedUsers, setConnectedUsers] = useState(0);
  const { animes, socket } = useSelector((state) => ({ ...state.web }));
  const navigate = useNavigate();
  useEffect(() => {
    socket.on("connectedUsers", (data) => {
      console.log(data);
      setConnectedUsers(data);
    });
  }, [socket, connectedUsers]);

  useEffect(() => {
    socket.emit("connectedUsersServer");
  }, [socket]);

  return (
    <main id="admin">
      <article id="admin_list">
        <div>
          {" "}
          <button
            className={adminState === 0 ? "specialAdminBtn" : undefined}
            onClick={() => setAdminState(0)}
          >
            ანიმეები
          </button>
          <button
            className={adminState === 1 ? "specialAdminBtn" : undefined}
            onClick={() => setAdminState(1)}
          >
            მომხმარებლები
          </button>
        </div>
        <article>
          <div></div>
          {connectedUsers}
        </article>
      </article>
      <section>
        {animes?.map((anime, index) => {
          return (
            <article
              key={index}
              className="admin_anime"
              style={{ backgroundImage: `url(${anime?.background})` }}
              onClick={() => navigate(`/admin_dashboard/${anime?._id}`)}
            >
              <div>
                <Edit />
              </div>
            </article>
          );
        })}

        <div
          id="admin_anime_add"
          onClick={() => navigate("/admin_dashboard/new")}
        >
          <span>ანიმეს დამატება</span>
          <Add />
        </div>
      </section>
      {/* <article className="ADFirst">სარეკლამო ადგილი</article>
      <article className="ADSecond">სარეკლამო ადგილი</article> */}
    </main>
  );
};

export default Admin;
