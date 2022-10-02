import React from "react";
import Edit from "../../assets/svgs/Edit";
import "./Admin.css";
import { useNavigate } from "react-router-dom";
import Add from "../../assets/svgs/Add";

const Admin = () => {
  const navigate = useNavigate();
  return (
    <main id="admin">
      <article
        className="admin_anime"
        onClick={() => navigate("/admin_anime/123")}
      >
        <div>
          <Edit />
        </div>
      </article>
      <article
        className="admin_anime"
        onClick={() => navigate("/admin_anime/123")}
      >
        <div>
          <Edit />
        </div>
      </article>
      <article
        className="admin_anime"
        onClick={() => navigate("/admin_anime/123")}
      >
        <div>
          <Edit />
        </div>
      </article>
      <article
        className="admin_anime"
        onClick={() => navigate("/admin_anime/123")}
      >
        <div>
          <Edit />
        </div>
      </article>
      <article
        className="admin_anime"
        onClick={() => navigate("/admin_anime/123")}
      >
        <div>
          <Edit />
        </div>
      </article>
      <article
        className="admin_anime"
        onClick={() => navigate("/admin_anime/123")}
      >
        <div>
          <Edit />
        </div>
      </article>
      <article
        className="admin_anime"
        onClick={() => navigate("/admin_anime/123")}
      >
        <div>
          <Edit />
        </div>
      </article>
      <article
        className="admin_anime"
        onClick={() => navigate("/admin_anime/123")}
      >
        <div>
          <Edit />
        </div>
      </article>
      <article
        className="admin_anime"
        onClick={() => navigate("/admin_anime/123")}
      >
        <div>
          <Edit />
        </div>
      </article>
      <article
        className="admin_anime"
        onClick={() => navigate("/admin_anime/123")}
      >
        <div>
          <Edit />
        </div>
      </article>
      <article
        className="admin_anime"
        onClick={() => navigate("/admin_anime/123")}
      >
        <div>
          <Edit />
        </div>
      </article>

      <article
        className="admin_anime"
        onClick={() => navigate("/admin_anime/123")}
      >
        <div>
          <Edit />
        </div>
      </article>
      <article
        className="admin_anime"
        onClick={() => navigate("/admin_anime/123")}
      >
        <div>
          <Edit />
        </div>
      </article>
      <div id="admin_anime_add" onClick={() => navigate("/admin_anime/new")}>
        <span>ანიმეს დამატება</span>
        <Add />
      </div>
    </main>
  );
};

export default Admin;
