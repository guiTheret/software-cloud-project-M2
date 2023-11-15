/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import { useNavigate } from "react-router-dom";
import "./header.css";

import api from "../../api/api";

function Header({
  isAuth,
  onSuccess,
}: {
  isAuth: boolean;
  onSuccess: (val: boolean) => void;
}) {
  const navigate = useNavigate();

  const logout = () => {
    api
      .post("/auth/logout")
      .then((res) => {
        onSuccess(true);
      })
      .catch((err) => {});
  };
  if (isAuth) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
          alignItems: "center",
          padding: "5px",
        }}
      >
        <img
          className="logo"
          height={80}
          width={80}
          src={"/logo.png"}
          alt="Logo"
          onClick={() => navigate("/home")}
        />
        <div>
          <a className="btn-header" onClick={() => navigate("/account")}>
            My account
          </a>
          <img
            className="logout"
            height={40}
            width={40}
            src={"/logout.png"}
            alt="Logo"
            onClick={() => logout()}
          />
        </div>
      </div>
    );
  } else {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
          alignItems: "center",
        }}
      >
        <img
          className="logo"
          height={80}
          width={80}
          src={"/logo.png"}
          alt="Logo"
          onClick={() => navigate("/login")}
        />
        <div>
          <a className="btn-header" onClick={() => navigate("/register")}>
            Register
          </a>
          <a className="btn-header" onClick={() => navigate("/login")}>
            Login
          </a>
        </div>
      </div>
    );
  }
}

export default Header;
