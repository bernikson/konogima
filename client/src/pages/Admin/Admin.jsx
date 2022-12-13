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
  const { animes, socket, products } = useSelector((state) => ({
    ...state.web,
  }));
  const navigate = useNavigate();
  useEffect(() => {
    socket.on("connectedUsers", (data) => {
      setConnectedUsers(data);
    });
  }, [socket, connectedUsers]);

  useEffect(() => {
    socket.emit("connectedUsersServer");
  }, [socket]);

  let text = "";
  switch (adminState) {
    case 0:
      text = "ანიმეს დამატება";
      break;
    case 1:
      text = "პროდუქტის დამატება";
      break;
    default:
      break;
  }

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
            მაღაზია
          </button>
          <button
            className={adminState === 2 ? "specialAdminBtn" : undefined}
            onClick={() => setAdminState(2)}
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
        {adminState === 0 &&
          animes?.map((anime, index) => {
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
        {adminState === 1 &&
          products?.map((product, index) => {
            return (
              <article
                key={index}
                className="admin_product"
                style={{ backgroundImage: `url(${product?.background})` }}
                onClick={() => navigate(`/admin_product/${product?._id}`)}
              >
                <div>
                  <Edit />
                </div>
              </article>
            );
          })}
        {adminState !== 2 && (
          <div
            id="admin_anime_add"
            onClick={() => {
              if (adminState === 0) {
                navigate("/admin_dashboard/new");
              } else if (adminState === 1) {
                navigate("/admin_product/new");
              }
            }}
          >
            <span>{text}</span>
            <Add />
          </div>
        )}
      </section>
      {/* <article className="ADFirst">სარეკლამო ადგილი</article>
      <article className="ADSecond">სარეკლამო ადგილი</article> */}
    </main>
  );
};

export default Admin;
