/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
//tessssss
import Header from "./components/Header/Header";
import Register from "./components/Register";
import Login from "./components/Login";
import Home from "./components/Home";
import Account from "./components/Account/Account";
import CleanerBook from "./components/Cleaner/CleanerBook";

import api from "./api/api";
import "./App.css";

function App() {
  const [isAuth, setIsAuth] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [userInfo, setUserInfo] = useState<userInfo>({
    username: "",
    isCleaner: 0,
    email: "",
    id: -1,
  });
  const navigate = useNavigate();

  const fetchAuth = async () => {
    try {
      const res = await api.get("/auth/login");
      setUserInfo(res.data.userInfo);
      setIsAuth(true);
      setLoading(false);
    } catch (err) {
      navigate("/login");
      setIsAuth(false);
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchAuth();
  }, []);

  const onAuthSuccess = () => {
    setIsAuth(true);
    // to refresh userInfo
    fetchAuth();
    navigate("/home");
  };

  const logOut = () => {
    setIsAuth(false);
    navigate("/login");
  };

  if (loading) {
    return <></>;
  } else {
    return (
      <div>
        <Header isAuth={isAuth} onSuccess={() => logOut()} />
        <Routes>
          <Route path="/home" element={<Home isAuth={isAuth} />} />
          <Route
            path="/register"
            element={<Register onSuccess={() => onAuthSuccess()} />}
          />
          <Route
            path="/login"
            element={<Login onSuccess={() => onAuthSuccess()} />}
          />
          <Route
            path="/account"
            element={
              <Account isCleaner={userInfo.isCleaner} userInfo={userInfo} />
            }
          />
          <Route path="/book" element={<CleanerBook />} />
        </Routes>
      </div>
    );
  }
}

export default App;
