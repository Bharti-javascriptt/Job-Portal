import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaCheck } from "react-icons/fa6";
import { RxCross2 } from "react-icons/rx";
import { Context } from "../../index.js";
import { useNavigate } from "react-router-dom";

const MyJobs = () => {
  const [myJobs, setMyJobs] = useState([]);
  const [editingMode, setEditingMode] = useState(null);
  const { isAuthorized, user } = useContext(Context);
  const navigateTo = useNavigate();

  // Fetching all jobs
  useEffect(() => {
    if (!isAuthorized || (user && user.role !== "Employer")) {
      navigateTo("/");
      return;
    }

    const fetchJobs = async () => {
      const storedUser = localStorage.getItem("user");
      const token = storedUser ? JSON.parse(storedUser).token : null;
      // console.log();;ttol
      console.log(token);
  
      if (!token) {
        toast.error("No token found. Please login again.");
        return;
      }
      try {
       
        const { data } = await axios.get(
          "http://localhost:8000/api/v1/job/getall",
          { withCredentials: true }
        );
        setMyJobs(data.job);
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to fetch jobs');
        setMyJobs([]);
      }
    };

    fetchJobs();
  }, [isAuthorized, user, navigateTo]);

  // Function For Enabling Editing Mode
  const handleEnableEdit = (jobId) => {
    setEditingMode(jobId);
  };

  // Function For Disabling Editing Mode
  const handleDisableEdit = () => {
    setEditingMode(null);
  };

  const handleUpdateJob = async (jobId) => {
    const updatedJob = myJobs.find((job) => job._id === jobId);
    console.log("Updated Job Data:", updatedJob);
  
    const storedUser = localStorage.getItem("user");
    const token = storedUser ? JSON.parse(storedUser).token : null;
  
    if (!token) {
      toast.error("No token found. Please login again.");
      return;
    }
  
    try {
      const res = await axios.patch(
        `http://localhost:8000/api/v1/job/update/${jobId}`,
        updatedJob,
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      toast.success(res.data.message);
      setEditingMode(null);
    } catch (error) {
      console.error("Update failed:", error.response || error.message);
      toast.error(error.response?.data?.message || "Failed to update the job");
    }
  };
  
  // Function For Deleting Job
  const handleDeleteJob = async (jobId) => {
    const storedUser = localStorage.getItem("user");
    const token = storedUser ? JSON.parse(storedUser).token : null;
    // console.log();;ttol
    console.log(token);

    if (!token) {
      toast.error("No token found. Please login again.");
      return;
    }

    try {
      const { data } = await axios.delete(
        `http://localhost:8000/api/v1/job/delete-job/${jobId}`,
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      toast.success(data.message);
      setMyJobs((prevJobs) => prevJobs.filter((job) => job._id !== jobId));
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete job');
    }
  };

  // Function to handle input changes
  const handleInputChange = (jobId, field, value) => {
    setMyJobs((prevJobs) =>
      prevJobs.map((job) =>
        job._id === jobId ? { ...job, [field]: value } : job
      )
    );
  };

  return (
    <div className="myJobs page">
      <div className="container">
        <h1>Your Posted Jobs</h1>
        {myJobs.length > 0 ? (
          <div className="banner">
            {myJobs.map((element) => (
              <div className="card" key={element._id}>
                <div className="content">
                  <div className="short_fields">
                    <div>
                      <span>Position:</span>
                      <input
                        type="text"
                        disabled={editingMode !== element._id}
                        value={element.position}
                        onChange={(e) =>
                          handleInputChange(element._id, "title", e.target.value)
                        }
                      />
                    </div>
                    {/* Repeat similar blocks for other fields */}
                    <div>
                      <span>Category:</span>
                      <select
                        value={element.category}
                        onChange={(e) =>
                          handleInputChange(element._id, "category", e.target.value)
                        }
                        disabled={editingMode !== element._id}
                      >
                        <option value="Graphics & Design">Graphics & Design</option>
                        {/* Other options */}
                      </select>
                    </div>
                  </div>
                  <div className="long_field">
                    <div>
                      <span>Description:</span>
                      <textarea
                        rows={5}
                        value={element.description}
                        disabled={editingMode !== element._id}
                        onChange={(e) =>
                          handleInputChange(element._id, "description", e.target.value)
                        }
                      />
                    </div>
                  </div>
                </div>
                <div className="button_wrapper">
                  <div className="edit_btn_wrapper">
                    {editingMode === element._id ? (
                      <>
                        <button
                          onClick={() => handleUpdateJob(element._id)}
                          className="check_btn"
                        >
                          <FaCheck />
                        </button>
                        <button
                          onClick={() => handleDisableEdit()}
                          className="cross_btn"
                        >
                          <RxCross2 />
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => handleEnableEdit(element._id)}
                        className="edit_btn"
                      >
                        Edit
                      </button>
                    )}
                  </div>
                  <button
                    onClick={() => handleDeleteJob(element._id)}
                    className="delete_btn"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>You've not posted any job or maybe you deleted all of your jobs!</p>
        )}
      </div>
    </div>
  );
};

export default MyJobs;
