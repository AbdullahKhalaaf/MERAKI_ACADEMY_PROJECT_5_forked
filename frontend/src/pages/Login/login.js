import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import {
  setLogin,
  setUserId,
} from "../../service/redux/reducers/auth/authSlice";
import "./login.css";
const Login = () => {
  // dispatch action
  const dispatch = useDispatch();
  // state reducer
  const state = useSelector((reducer) => {
    return {
      authReducer: reducer.authReducer,
    };
  });
  // access the token and userId and isLoggedIn
  // const token = state.authReducer.token;
  // const userId = state.authReducer.userId;
  const isLoggedIn = state.authReducer.isLoggedIn;

  // declare status
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState(false);
  const nav = useNavigate();

  // login user
  const login = async (e) => {
    e.preventDefault();
    try {
      const result = await axios.post("http://localhost:5000/user/login", {
        email,
        password,
      });
      console.log(result);

      if (result.data) {
        setMessage("");
        localStorage.setItem("token", result.data.token);
        localStorage.setItem("userId", result.data.userId);
        dispatch(setLogin(result.data.token));
        dispatch(setUserId(result.data.userId));
        if (isLoggedIn) {
          nav("/main");
        }
      } else throw Error;
    } catch (error) {
      if (error.response && error.response.data) {
        return setMessage(error.response.data.message);
      }
      setMessage("Error happened while Login, please try again");
    }
  };

  // if access to login navigate to movies
  // useEffect(() => {
  //   if (isLoggedIn) {
  //     nav("/main");
  //   }
  // });
  const [hide, setHide] = useState(true);

  // show and hide password
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  return (
    <div className="background-image">
      <div className="login-container">
        {" "}
        <h2 className="login-word">Login</h2>{" "}
        <form className="form-login">
          {" "}
          <input
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            className="input-login"
            type="email"
            placeholder="Email"
            required
          />{" "}
          <div className="input-wrapper">
            <input
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              className="input-login"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              required
            />{" "}
            <span
              className="bi bi-unlock-fill"
              onClick={togglePasswordVisibility}
              role="button"
            >
              {hide && (
                <svg
                  className="bi bi-unlock-fill"
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  class="bi bi-unlock-fill"
                  viewBox="0 0 16 16"
                >
                  <path d="M11 1a2 2 0 0 0-2 2v4a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h5V3a3 3 0 0 1 6 0v4a.5.5 0 0 1-1 0V3a2 2 0 0 0-2-2" />
                </svg>
              )}

              {showPassword ? (
                <>
                  {/* <i  className="fa fa-eye-slash" aria-hidden="true">Hide</i> */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    class="bi bi-lock"
                    viewBox="0 0 16 16"
                  >
                    <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2m3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2M5 8h6a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1" />
                  </svg>{" "}
                  <i onClick={() => setHide(!hide)}>Hide</i>
                </>
              ) : (
                <i className="fa fa-eye" aria-hidden="true">
                  Show
                </i>
              )}
            </span>
          </div>
          <button className="submit" onClick={(e) => login(e)}>
            Login
          </button>
          {status
            ? message && <div className="SuccessMessage">{message}</div>
            : message && <div className="ErrorMessage">{message}</div>}
          <br />
          <span style={{ fontFamily: "arial" }}>
            You Dont Have Any Account?
            <Link className="back_navbar" to={"/register"}>
              Click Here
            </Link>
          </span>
          <br />
          <span style={{ fontFamily: "arial" }}>
            Return To The Home Page?
            <Link className="back_navbar" to={"/"}>
              Click Here
            </Link>
          </span>
        </form>{" "}
      </div>
    </div>
  );
};

export default Login;
