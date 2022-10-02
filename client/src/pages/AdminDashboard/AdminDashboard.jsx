import React from "react";
import "./AdminDashboard.css";
import Tick from "../../assets/svgs/Tick";
import Calendar from "../../assets/svgs/Calendar";
import ArrowDown from "../../assets/svgs/ArrowDown";
import { useState, useRef } from "react";
import ReactCalendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const AdminDashboard = () => {
  const [date, newDate] = useState(new Date());
  let [genres, setGenres] = useState([
    { value: "საბრძოლო ხელოვნება", state: false },
    { value: "სათავგადასავლო", state: false },
    { value: "სამეცნიერო ფანტასტიკა", state: false },
    { value: "რომანტიკა", state: false },
    { value: "სამურაი", state: false },
    { value: "საშინელებათა", state: false },
    { value: "ფანტაზია", state: false },
    { value: "ფსიქოლოგიური", state: false },
    { value: "შოუჯო", state: false },
    { value: "შოუნენი", state: false },
    { value: "ყოველდღიურობა", state: false },
    { value: "დემონები", state: false },
    { value: "ვამპირები", state: false },
    { value: "დეტექტივი", state: false },
    { value: "ზებუნებრივი", state: false },
    { value: "დრამა", state: false },
    { value: "სუპერ-ძალები", state: false },
    { value: "სპორტი", state: false },
    { value: "თამაში", state: false },
    { value: "სკოლა", state: false },
    { value: "თრილერი", state: false },
    { value: "სეინენი", state: false },
    { value: "ისტორიული", state: false },
    { value: "სამხედრო", state: false },
    { value: "პოსტ-აპოკალიფსური", state: false },
    { value: "მუსიკალური", state: false },
    { value: "კომედია", state: false },
    { value: "მაგია", state: false },
    { value: "მისტიკა", state: false },
    { value: "მეხა", state: false },
  ]);
  const imageRef = useRef(null);
  const [playerOptions, setPlayerOptions] = useState({
    playerTwo: false,
    playerThree: false,
  });
  const [image, setImage] = useState();
  const [genresDropdown, triggerGenresDropdown] = useState(false);
  const [calendarDropdown, triggerCalendarDropdown] = useState(false);
  return (
    <main id="admin_dashboard">
      <aside id="top_admin">
        <aside id="top_left_admin">
          <div id="admin_dashboard_background"></div>
          <button onClick={() => imageRef.current.click()}>
            სურათის არჩევა
          </button>
          <input
            value={image}
            onChange={(e) => setImage(e.target.value)}
            ref={imageRef}
            style={{ display: "none" }}
            type="file"
            accept="image/png, image/jpeg, image/webp"
          />
          <section id="admin_dashboard_players">
            <div>
              <span>ფლეიერი 2</span>
              <div
                onClick={() =>
                  setPlayerOptions({
                    ...playerOptions,
                    playerTwo: !playerOptions.playerTwo,
                  })
                }
                className={
                  playerOptions.playerTwo ? "trigger_player" : undefined
                }
              >
                <Tick />
              </div>
            </div>
            <div>
              <span>ფლეიერი 3</span>
              <div
                onClick={() =>
                  setPlayerOptions({
                    ...playerOptions,
                    playerThree: !playerOptions.playerThree,
                  })
                }
                className={
                  playerOptions.playerThree ? "trigger_player" : undefined
                }
              >
                <Tick />
              </div>
            </div>
          </section>
        </aside>
        <aside id="top_right_admin">
          <section id="admin_dashboard_information">
            <ul>
              <li>
                <input type="text" placeholder="სახელი" />
                <div className="input_border"></div>
              </li>
              <li>
                <input type="text" placeholder="წელი" />
                <div className="input_border"></div>
              </li>
              <li>
                <input type="text" placeholder="გამხმოვანებელი" />
                <div className="input_border"></div>
              </li>
              <li>
                <input type="text" placeholder="მთარგმელი" />
                <div className="input_border"></div>
              </li>
              <li>
                <input type="text" placeholder="ქრონომეტრაჟი" />
                <div className="input_border"></div>
              </li>
            </ul>
            <ul>
              <li>
                <div
                  className={`admin_dropdown_header ${
                    genresDropdown
                      ? "triggered_gernes_header_dropdown"
                      : undefined
                  }`}
                  onClick={() => triggerGenresDropdown(!genresDropdown)}
                >
                  <span>ჟანრი</span>
                  <ArrowDown />
                </div>
                <div
                  id="anime_genres_dropdown"
                  className={
                    genresDropdown ? "triggered_gernes_dropdown" : undefined
                  }
                >
                  <ul>
                    {genres.map((genre, index) => (
                      <li
                        onClick={() =>
                          setGenres((prevGenres) => {
                            let newState = [...prevGenres];
                            console.log(newState[index].state);
                            newState[index].state = !newState[index].state;
                            return newState;
                          })
                        }
                      >
                        <div
                          className={genre.state ? "modified_genre" : undefined}
                        >
                          <Tick />
                        </div>
                        <span>{genre.value}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
              <li>
                <input type="text" placeholder="რეჟისორი" />
                <div className="input_border"></div>
              </li>
              <li>
                <input type="text" placeholder="სტუდია" />
                <div className="input_border"></div>
              </li>
              <li>
                <input type="text" placeholder="ასაკი" />
                <div className="input_border"></div>
              </li>
              <li>
                <div
                  onClick={() => triggerCalendarDropdown(!calendarDropdown)}
                  className="admin_dropdown_header admin_calendar_header"
                >
                  <span>თარიღი</span>
                  <Calendar />
                </div>
                <ReactCalendar
                  className={
                    calendarDropdown ? "triggered_calendar_dropdown" : undefined
                  }
                  onChange={newDate}
                  value={date}
                />
              </li>
            </ul>
          </section>
          <textarea placeholder="აღწერა" />
          <button>შენახვა</button>
        </aside>
      </aside>
      <aside id="bottom_admin"></aside>
    </main>
  );
};

export default AdminDashboard;
