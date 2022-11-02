import React from "react";
import Edit from "../../assets/svgs/Edit";
import "./Admin.css";
import { useNavigate } from "react-router-dom";
import Add from "../../assets/svgs/Add";
import { useSelector } from "react-redux";

const Admin = () => {
  const { animes } = useSelector((state) => ({ ...state.web }));
  const navigate = useNavigate();
  return (
    <main id="admin">
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
    </main>
  );
};

export default Admin;
