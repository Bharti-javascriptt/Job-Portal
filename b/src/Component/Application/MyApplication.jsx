import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../index.js";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
// import ResumeModal from "./ResumeModal";

const MyApplication = () => {
  const { user, isAuthorized } = useContext(Context);
  const [applications, setApplications] = useState([]);
  // const [modalOpen, setModalOpen] = useState(false);
  // const [resumeImageUrl, setResumeImageUrl] = useState("");
  const navigateTo = useNavigate();

  useEffect(() => {
    const fetchApplications = async () => {
      const storedUser = localStorage.getItem("user");
      const token = storedUser ? JSON.parse(storedUser).token : null;

      if (!token) {
        toast.error("No token found. Please login again.");
        navigateTo("/login");
        return;
      }

      try {
        const url = user === "Employer"
          ? `http://localhost:8000/api/v1/application/employer/getall?_=${new Date().getTime()}`
          : `http://localhost:8000/api/v1/application/jobseeker/getall?_=${new Date().getTime()}`;

        const response = await axios.get(url, {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setApplications(response.data.applications || []);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          toast.error("Unauthorized access. Please login again.");
          navigateTo("/login");
        } else {
          toast.error(error.response?.data?.message || "An error occurred");
        }
      }
    };

    if (isAuthorized) {
      fetchApplications();
    } else {
      navigateTo("/login");
    }
  }, [isAuthorized, user, navigateTo]);

  const deleteApplication = async (id) => {
    const storedUser = localStorage.getItem("user");
    const token = storedUser ? JSON.parse(storedUser).token : null;

    if (!token) {
      toast.error("No token found. Please login again.");
      return;
    }

    try {
      const response = await axios.delete(`http://localhost:8000/api/v1/application/delete/${id}`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success(response.data.message);
      setApplications((prevApplications) =>
        prevApplications.filter((application) => application._id !== id)
      );
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
    }
  };

  // const openModal = (imageUrl) => {
  //   // setResumeImageUrl(imageUrl);
  //   setModalOpen(true);
  // };

  // const closeModal = () => {
  //   setModalOpen(false);
  // };

  // Debugging logs
  // console.log('Rendering MyApplication component');
  // console.log('Applications:', applications);
  // console.log('User:', user);

  return (
    <section className="my_applications page">
      {user === "Job Seeker" ? (
        <div className="container">
          <h1>My Applications</h1>
          {applications.length === 0 ? (
            <h4>No Applications Found</h4>
          ) : (
            applications.map((element) => (
              <JobSeekerCard
                element={element}
                key={element._id}
                deleteApplication={deleteApplication}
                // openModal={openModal}
              />
            ))
          )}
        </div>
      ) : (
        <div className="container">
          <h1>Applications From Job Seekers</h1>
          {applications.length === 0 ? (
            <h4>No Applications Found</h4>
          ) : (
            applications.map((element) => (
              <EmployerCard
                element={element}
                key={element._id}
                // openModal={openModal}
              />
            ))
          )}
        </div>
      )}
      {/* {modalOpen && ( */}
        {/* // <ResumeModal */}
        {/* //  imageUrl={resumeImageUrl}  */}
        {/* //  onClose={closeModal} /> */}
      {/* // )} */}
    </section>
  );
};

const JobSeekerCard = ({ element, deleteApplication,  }) => (
  <div className="job_seeker_card">
    <div className="detail">
      <p><span>Name:</span> {element.name}</p>
      <p><span>Email:</span> {element.email}</p>
      <p><span>Phone:</span> {element.phone}</p>
      <p><span>Address:</span> {element.address}</p>
      <p><span>CoverLetter:</span> {element.coverLetter}</p>
    </div>
    <div className="resume">
      <img
        src={element.resume?.url || ""}
        alt="resume"
        // onClick={() => openModal(element.resume?.url || "")}
      />
    </div>
    <div className="btn_area">
      <button onClick={() => deleteApplication(element._id)}>Delete Application</button>
    </div>
  </div>
);

const EmployerCard = ({ element, openModal }) => (
  <div className="job_seeker_card">
    <div className="detail">
      <p><span>Name:</span> {element.name}</p>
      <p><span>Email:</span> {element.email}</p>
      <p><span>Phone:</span> {element.phone}</p>
      <p><span>Address:</span> {element.address}</p>
      <p><span>CoverLetter:</span> {element.coverLetter}</p>
    </div>
    <div className="resume">
      <img
        src={element.resume?.url || ""}
        alt="resume"
        onClick={() => openModal(element.resume?.url || "")}
      />
    </div>
  </div>
);

export default MyApplication;
