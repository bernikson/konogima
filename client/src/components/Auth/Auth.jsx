import React from "react";
import Close from "../../assets/svgs/Close";
import "./Auth.css";
import { useState } from "react";
import Tick from "../../assets/svgs/Tick";
import { updateAuthState } from "../../redux/webSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import {
  login,
  register,
  forgotPassword,
  resetPassword,
} from "../../redux/webSlice";

const Auth = () => {
  const dispatch = useDispatch();
  const { authState } = useSelector((state) => ({
    ...state.web,
  }));
  const [registerData, setRegisterData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [registerFocusData, setRegisterFocusData] = useState({
    username: false,
    email: false,
    password: false,
    confirmPassword: false,
  });
  const [loginData, setLogindata] = useState({
    email: "",
    password: "",
  });
  const handleRegisterChange = (e) => {
    const { value, name } = e.target;
    setRegisterData({ ...registerData, [name]: value });
  };
  const handleLoginChange = (e) => {
    const { value, name } = e.target;
    setLogindata({ ...loginData, [name]: value });
  };
  const handleRegister = async () => {
    const { username, email, password, confirmPassword } = registerData;
    if (
      username === "" ||
      email === "" ||
      password === "" ||
      confirmPassword === ""
    ) {
      return toast.error("შეიყვანეთ ინფორმაცია", {
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
    await dispatch(register({ username, email, password, confirmPassword }));
    localStorage.getItem("isLogged") === "true" && dispatch(updateAuthState(0));
  };
  const handleLogin = async () => {
    const { email, password } = loginData;
    if (email === "" || password === "") {
      return toast.error("შეიყვანეთ ინფორმაცია", {
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
    await dispatch(login({ email, password }));
    localStorage.getItem("isLogged") === "true" && dispatch(updateAuthState(0));
  };
  const handleForgotPassword = async () => {
    const { email } = registerData;
    if (email === "") {
      return toast.error("შეიყვანეთ ინფორმაცია", {
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
    await dispatch(forgotPassword({ email }));
    localStorage.getItem("isLogged") === "true" && dispatch(updateAuthState(0));
  };

  const handleValidate = (check) => {
    switch (check) {
      case "username":
        if (
          registerData.username.length > 3 &&
          registerData.username.length < 24
        ) {
          return true;
        }
        break;
      case "email":
        return String(registerData.email)
          .toLowerCase()
          .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          );
      case "password":
        return String(registerData.password).match(
          /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&^_-]{8,}$/
        );
      case "confirmPassword":
        if (registerData.password === registerData.confirmPassword) return true;
        break;
      default:
        return false;
    }
  };
  let authStateClass = "";
  switch (authState) {
    case 1:
      authStateClass = "login";
      break;
    case 2:
      authStateClass = "register";
      break;
    case 3:
      authStateClass = "forgotPassword";
      break;
    default:
      authStateClass = "";
  }

  return (
    <section className={`parentAuth ${authStateClass}`}>
      <section className="auth">
        {authState !== 3 || authState !== 3 ? (
          <div className="auth_nav">
            <div>
              <button onClick={() => dispatch(updateAuthState(2))}>
                რეგისტრაცია
              </button>
              <button onClick={() => dispatch(updateAuthState(1))}>
                შესვლა
              </button>
            </div>
            <div onClick={() => dispatch(updateAuthState(0))}>
              <Close />
            </div>
          </div>
        ) : (
          <div className="auth_nav">
            <div>
              <button onClick={() => dispatch(updateAuthState(3))}>
                პაროლის აღდგენა
              </button>
              <button onClick={() => dispatch(updateAuthState(1))}>
                შესვლა
              </button>
            </div>
            <div onClick={() => dispatch(updateAuthState(0))}>
              <Close />
            </div>
          </div>
        )}
        <article id="auth_switch">
          {authState === 3 && (
            <form action="" autoComplete="off">
              <div className="auth_input_wrapper">
                <input
                  type="text"
                  placeholder="შეიყვანეთ ელ-ფოსტა"
                  name="email"
                  value={registerData.email}
                  onChange={handleRegisterChange}
                  onFocus={() => setRegisterFocusData({ email: true })}
                  onBlur={() => setRegisterFocusData({ email: false })}
                />
                <div></div>
                <div
                  className="preError"
                  style={
                    registerData.email !== "" && registerFocusData.email
                      ? { opacity: "1", height: "30px" }
                      : { opacity: "0", height: "0" }
                  }
                >
                  {handleValidate("email") ? (
                    <Tick width="22px" height="22px" fill="#55efc4" />
                  ) : (
                    <Close width="27px" height="27px" fill="#ff3f34" />
                  )}
                  <span
                    style={
                      handleValidate("email")
                        ? { color: "#55efc4" }
                        : { color: "#ff3f34" }
                    }
                  >
                    ელ-ფოსტა უნდა იყოს სწორი
                  </span>
                </div>
              </div>
            </form>
          )}
          {(authState === 1 || authState === 0) && (
            <form action="" autoComplete="off">
              <div className="auth_input_wrapper">
                <input
                  type="text"
                  placeholder="შეიყვანეთ ელ-ფოსტა"
                  name="email"
                  value={loginData.email}
                  onChange={handleLoginChange}
                />
                <div></div>
              </div>
              <div className="auth_input_wrapper">
                <input
                  type="password"
                  placeholder="შეიყვანეთ პაროლი"
                  name="password"
                  value={loginData.password}
                  onChange={handleLoginChange}
                />
                <div></div>
              </div>
              <span
                id="password_forgot"
                onClick={() => dispatch(updateAuthState(3))}
              >
                დაგავიწყდათ პაროლი?
              </span>
            </form>
          )}
          {authState === 2 && (
            <form action="" autoComplete="off">
              <div className="auth_input_wrapper">
                <input
                  type="text"
                  placeholder="შეიყვანეთ სახელი"
                  name="username"
                  value={registerData.username}
                  onChange={handleRegisterChange}
                  onFocus={() => setRegisterFocusData({ username: true })}
                  onBlur={() => setRegisterFocusData({ username: false })}
                />
                <div></div>
                <div
                  className="preError"
                  style={
                    registerData.username !== "" && registerFocusData.username
                      ? { opacity: "1", height: "50px" }
                      : { opacity: "0", height: "0" }
                  }
                >
                  {handleValidate("username") ? (
                    <Tick width="22px" height="22px" fill="#55efc4" />
                  ) : (
                    <Close width="27px" height="27px" fill="#ff3f34" />
                  )}
                  <span
                    style={
                      handleValidate("username")
                        ? { color: "#55efc4" }
                        : { color: "#ff3f34" }
                    }
                  >
                    სახელი უნდა შეიცავდეს მინიმუმ 3 სიმბოლოს და მაქსიმუმ 24-ს
                  </span>
                </div>
              </div>
              <div className="auth_input_wrapper">
                <input
                  type="text"
                  placeholder="შეიყვანეთ ელ-ფოსტა"
                  name="email"
                  value={registerData.email}
                  onChange={handleRegisterChange}
                  onFocus={() => setRegisterFocusData({ email: true })}
                  onBlur={() => setRegisterFocusData({ email: false })}
                />
                <div></div>
                <div
                  className="preError"
                  style={
                    registerData.email !== "" && registerFocusData.email
                      ? { opacity: "1", height: "30px" }
                      : { opacity: "0", height: "0" }
                  }
                >
                  {handleValidate("email") ? (
                    <Tick width="22px" height="22px" fill="#55efc4" />
                  ) : (
                    <Close width="27px" height="27px" fill="#ff3f34" />
                  )}
                  <span
                    style={
                      handleValidate("email")
                        ? { color: "#55efc4" }
                        : { color: "#ff3f34" }
                    }
                  >
                    ელ-ფოსტა უნდა იყოს სწორი
                  </span>
                </div>
              </div>
              <div className="auth_input_wrapper">
                <input
                  type="password"
                  placeholder="შეიყვანეთ პაროლი"
                  name="password"
                  value={registerData.password}
                  onChange={handleRegisterChange}
                  onFocus={() => setRegisterFocusData({ password: true })}
                  onBlur={() => setRegisterFocusData({ password: false })}
                />
                <div></div>
                <div
                  className="preError"
                  style={
                    registerData.password !== "" && registerFocusData.password
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
                  value={registerData.confirmPassword}
                  onChange={handleRegisterChange}
                  onFocus={() =>
                    setRegisterFocusData({ confirmPassword: true })
                  }
                  onBlur={() =>
                    setRegisterFocusData({ confirmPassword: false })
                  }
                />
                <div></div>
                <div
                  className="preError"
                  style={
                    registerData.confirmPassword !== "" &&
                    registerFocusData.confirmPassword
                      ? { opacity: "1", height: "50px" }
                      : { opacity: "0", height: "0" }
                  }
                >
                  {handleValidate("confirmPassword") ? (
                    <Tick width="22px" height="22px" fill="#55efc4" />
                  ) : (
                    <Close width="27px" height="27px" fill="red" />
                  )}
                  <span
                    style={
                      handleValidate("confirmPassword")
                        ? { color: "#55efc4" }
                        : { color: "red" }
                    }
                  >
                    პაროლები უნდა ემთხვეოდეს
                  </span>
                </div>
              </div>
            </form>
          )}
        </article>
        {authState === 2 && (
          <button
            onClick={() => {
              if (
                handleValidate("username") &&
                handleValidate("password") &&
                handleValidate("email") &&
                handleValidate("confirmPassword")
              ) {
                handleRegister();
              }
            }}
            style={
              handleValidate("username") &&
              handleValidate("password") &&
              handleValidate("email") &&
              handleValidate("confirmPassword")
                ? undefined
                : {
                    backgroundColor: "transparent",
                    color: "#55efc4",
                    cursor: "not-allowed",
                  }
            }
          >
            რეგისტრაცია
          </button>
        )}
        {authState === 3 && (
          <button
            onClick={() => {
              if (handleValidate("email")) {
                handleForgotPassword();
              }
            }}
            style={
              handleValidate("email")
                ? undefined
                : {
                    backgroundColor: "transparent",
                    color: "#55efc4",
                    cursor: "not-allowed",
                  }
            }
          >
            გაგზავნა
          </button>
        )}
        {authState === 1 && <button onClick={handleLogin}>შესვლა</button>}
      </section>
    </section>
  );
};

export default Auth;
