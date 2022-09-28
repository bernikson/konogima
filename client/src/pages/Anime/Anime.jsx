import React from "react";
import "./Anime.css";
import Comment from "../../assets/svgs/Comment";
import Dislike from "../../assets/svgs/Dislike";
import Like from "../../assets/svgs/Like";
import Views from "../../assets/svgs/Views";

const Anime = () => {
  return (
    <main id="anime">
      <h1>Lorem ipsum dolor sit amet consectetur adipisicing elit.</h1>
      <section id="anime_aside_wrapper">
        <aside>
          <div id="anime_background"></div>
          <div id="anime_views">
            <Views width="35" />
            <span>10000 ნახვა</span>
          </div>
          <div id="anime_ratings_wrapper">
            <div>
              <Like width="40px" />
              <span>100</span>
            </div>
            <div>
              <Dislike width="40px" />
              <span>100</span>
            </div>
          </div>
        </aside>
        <aside>
          <ul>
            <li>
              წელი:
              <span>1997</span>
            </li>
            <li>
              სეზონი:
              <span>1</span>
            </li>
            <li>
              სერია:
              <span>16 / 82 სერია</span>
            </li>
            <li>
              გამხმოვანებელი:
              <span>ჩეგევარა</span>
            </li>
            <li>
              სტატუსი:
              <span>მიმდინარე</span>
            </li>
            <li>
              ქრონომეტრაჟი:
              <span>22 წუთი</span>
            </li>
            <li>
              ჟანრი:
              <span>ანიმე/სათავგადასავლო/კომედია/შონენი</span>
            </li>
            <li>
              რეჟისორი:
              <span>ფიდელ კასტრო, ავსტრიელი მხატვარი</span>
            </li>
            <li>
              სტუდია:
              <span>სტალინგრადი</span>
            </li>
            <li>
              ასაკი:
              <span>0+</span>
            </li>
          </ul>
          <h4>მოკლე აღწერა</h4>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. In magnam
            quo enim, aut perspiciatis culpa impedit a dicta fugit debitis
            dolor, dolore, necessitatibus animi accusamus magni accusantium
            suscipit recusandae obcaecati?
          </p>
        </aside>
      </section>
      <iframe src="" title="Anime player"></iframe>
      <section id="anime_comments_wrapper">
        <div id="anime_comments_count">
          <Comment width="40" />
          <span>31 კომენტარი</span>
        </div>
        <textarea cols="30" rows="10"></textarea>
        <button id="anime_add_comment">დაპოსტე კომენტარი</button>
        <section id="anime_comments">
          <article className="anime_comment">
            <div className="anime_user_profile"></div>
            <div className="anime_comment_info">
              <span>Username</span>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Facere
                rem non veritatis veniam debitis voluptatem distinctio culpa
                rerum, commodi cum, aliquid eum enim earum iste officiis nemo
                ducimus nulla animi!
              </p>
              <div className="anime_comment_actions_wrapper">
                <div>
                  <div>
                    <Like width="30" />
                  </div>
                  <span>100</span>
                  <div>
                    <Like width="30" />
                  </div>
                </div>
                <span>პასუხი</span>
                <span>თარიღი</span>
              </div>
            </div>
          </article>
        </section>
        <button className="anime_load_comments">
          დამატებითი კომენტარების ჩატვირთვა
        </button>
      </section>
    </main>
  );
};

export default Anime;
