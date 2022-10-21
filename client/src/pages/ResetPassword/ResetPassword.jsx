import React from "react";
import "./ResetPassword.css";
import { useParams, useNavigate } from "react-router-dom";
import PuffLoader from "react-spinners/PuffLoader";
import axios from "axios";
import { useEffect, useState } from "react";
import Close from "../../assets/svgs/Close";
import Tick from "../../assets/svgs/Tick";
import { toast } from "react-hot-toast";

const ResetPassword = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [resPassword, setResPasswordData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [loadState, setLoadState] = useState(true);

  const [passwordFocus, setPasswordFocus] = useState({
    password: false,
    confirmPassword: false,
  });
  const handleResetPassword = async () => {
    try {
      const { data } = await axios.patch("/api/user/resetPassword", {
        password: resPassword.password,
        Token: id,
      });
      toast.success(data.message, {
        id: "single",
        duration: 4000,
        style: {
          backgroundColor: "black",
          border: "1px solid #D084E3",
          color: "white",
          boxShadow: "0px 0px 30px #D084E3",
        },
      });
      navigate("/");
    } catch (error) {
      toast.error(error.response.data.message, {
        id: "single",
        duration: 4000,
        style: {
          backgroundColor: "black",
          border: "1px solid #D084E3",
          color: "white",
          boxShadow: "0px 0px 30px #D084E3",
        },
      });
    }
  };
  const handleValidate = (check) => {
    switch (check) {
      case "password":
        return String(resPassword.password).match(
          /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&^_-]{8,}$/
        );
      case "confirmPassword":
        if (resPassword.password === resPassword.confirmPassword) return true;
        break;
      default:
        return false;
    }
  };
  const handlePasswordChange = (e) => {
    const { value, name } = e.target;
    setResPasswordData({ ...resPassword, [name]: value });
  };
  useEffect(() => {
    const checkToken = async () => {
      try {
        await axios.post(`/api/user/checkToken/${id}`);
        setLoadState(false);
      } catch (error) {
        toast.error("დაფიქსირდა შეცდომა", {
          id: "single",
          duration: 4000,
          style: {
            backgroundColor: "black",
            border: "1px solid #D084E3",
            color: "white",
            boxShadow: "0px 0px 30px #D084E3",
          },
        });
        navigate("/");
      }
    };
    checkToken();
  }, [id, navigate]);
  return (
    <main id="resetPassword">
      {!loadState && (
        <section className="auth resetPasswordForm">
          <span id="reset_password_label">პაროლის აღდგენა</span>
          <article id="auth_switch">
            <form action="" autoComplete="off">
              <div className="auth_input_wrapper">
                <input
                  type="password"
                  placeholder="შეიყვანეთ პაროლი"
                  name="password"
                  value={resPassword.password}
                  onChange={handlePasswordChange}
                  onFocus={() => setPasswordFocus({ password: true })}
                  onBlur={() => setPasswordFocus({ password: false })}
                />
                <div></div>
                <div
                  className="preError"
                  style={
                    resPassword.password !== "" && passwordFocus.password
                      ? { opacity: "1", height: "50px" }
                      : { opacity: "0", height: "0" }
                  }
                >
                  {handleValidate("password") ? (
                    <Tick width="22px" height="22px" fill="#55efc4" />
                  ) : (
                    <Close width="27px" height="27px" fill="#ff3f34" />
                  )}
                  <span
                    style={
                      handleValidate("password")
                        ? { color: "#55efc4" }
                        : { color: "#ff3f34" }
                    }
                  >
                    პაროლი უნდა შეიცავდეს ციფრებს და იწყებოდეს დიდი ასუთი
                  </span>
                </div>
              </div>
              <div className="auth_input_wrapper">
                <input
                  type="password"
                  placeholder="გაიმეორეთ პაროლი"
                  name="confirmPassword"
                  value={resPassword.confirmPassword}
                  onChange={handlePasswordChange}
                  onFocus={() => setPasswordFocus({ confirmPassword: true })}
                  onBlur={() => setPasswordFocus({ confirmPassword: false })}
                />
                <div></div>
                <div
                  className="preError"
                  style={
                    resPassword.confirmPassword !== "" &&
                    passwordFocus.confirmPassword
                      ? { opacity: "1", height: "30px" }
                      : { opacity: "0", height: "0" }
                  }
                >
                  {handleValidate("confirmPassword") ? (
                    <Tick width="22px" height="22px" fill="#55efc4" />
                  ) : (
                    <Close width="27px" height="27px" fill="#ff3f34" />
                  )}
                  <span
                    style={
                      handleValidate("confirmPassword")
                        ? { color: "#55efc4" }
                        : { color: "#ff3f34" }
                    }
                  >
                    პაროლები უნდა ემთხვეოდეს
                  </span>
                </div>
              </div>
            </form>
          </article>
          <button
            onClick={() => {
              if (
                handleValidate("password") &&
                handleValidate("confirmPassword")
              ) {
                handleResetPassword();
              }
            }}
            style={
              handleValidate("password") && handleValidate("confirmPassword")
                ? undefined
                : {
                    backgroundColor: "transparent",
                    color: "#55efc4",
                    cursor: "not-allowed",
                  }
            }
          >
            პაროლის განახლება
          </button>
        </section>
      )}

      <PuffLoader
        className="resetPasswordLoader"
        color="#d084e3"
        loading={loadState}
        size={200}
        speedMultiplier={1}
      />
    </main>
  );
};

export default ResetPassword;
