
import React, { useContext, useEffect } from "react";
import "./App.css";
import { Context } from "./index.js";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./Component/Auth/Login";
import Register from "./Component/Auth/Register";
import { Toaster } from "react-hot-toast";
import axios from "axios";
import Navbar from "./Component/Layout/Navbar";
import Footer from "./Component/Layout/Footer";
import Home from "./Component/Home/Home";
import Jobs from "./Component/Job/Jobs";
import JobDetail from "./Component/Job/JobDetail";
import Application from "./Component/Application/Application";
import MyApplications from "./Component/Application/MyApplication";
import PostJob from "./Component/Job/PostJob";
import NotFound from "./Component/NotFound/NotFound";
import MyJobs from "./Component/Job/MyJob";

const App = () => {
  const {  setIsAuthorized, setUser } = useContext(Context);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/v1/reg/getuser",
          {
            withCredentials: true,
          }
        );
        setUser(response.data.user);
        setIsAuthorized(true);
      } catch (error) {
        setIsAuthorized(false);
      }
    };
    fetchUser();
  }, [setIsAuthorized,setUser]);

  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login/>} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Home />} />
          <Route path="/job/getall" element={<Jobs />} />
          <Route path="/job/:id" element={<JobDetail/>} />
          <Route path="/application/:id" element={<Application />} />
          <Route path="/applications/me" element={<MyApplications />} />
          <Route path="/job/post" element={<PostJob />} />
          <Route path="/job/me" element={<MyJobs />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
        <Toaster />
      </BrowserRouter>
    </>
  );
};

export default App;