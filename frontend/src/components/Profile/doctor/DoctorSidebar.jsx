import axios from "axios";
import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../../redux/UserSlice.js";
import docProfile from "../../../assets/doct2.jpg";
const DoctorSidebar = ({ profilePic, userName }) => {
  const [appointmentCount, setAppointmentCount] = useState(0);
  // const appointmentCount = localStorage.getItem("appointmentCount") || 0;

  useEffect(() => {
    const fetchAppointmentCount = async () => {
      try {
        const appointmentCount2 = localStorage.getItem("appointmentCount") || 0;
        setAppointmentCount(appointmentCount2);
      } catch (error) {
        console.error("Error fetching appointment count:", error);
      }
    };
    fetchAppointmentCount();
    const interval = setInterval(fetchAppointmentCount, 1000);
    return () => clearInterval(interval);
  }, []);

  const navLinkStyle = ({ isActive }) => {
    return {
      fontWeight: isActive ? "600" : "400",
      color: isActive ? "white" : "black",
      backgroundColor: isActive ? "black" : "white",
    };
  };

  const dispatch = useDispatch();

  const handleSignOut = async (e) => {
    e.preventDefault();
    await axios.get("http://localhost:5000/auth/logout").then((res) => {
      if (res.data.message === "User Logged Out") {
        localStorage.removeItem("user");
        dispatch(logout());
        window.location.href = "/";
      }
    });
  };

  return (
    <div className="bg-slate- h-full w-[18%] flex flex-col justify-between p-2 ">
      <div className="flex flex-col gap-16">
        <div className="w-full flex flex-col items-center gap-3">
          <img
            src={docProfile}
            className="size-24 rounded-full"
            alt="profile"
          />
          <p>{userName}</p>
        </div>
        <div className="flex flex-col items-start w-full gap-4 ">
          <NavLink
            style={navLinkStyle}
            className={"w-full  p-2 h-[40px] "}
            to="/doctor-profile"
          >
            Settings
          </NavLink>
          <NavLink
            style={navLinkStyle}
            className="w-full p-2 h-[40px] flex justify-between items-center"
            to="/doctor-appointments"
          >
            <span>Appointments</span>
            <span className="bg-red-500 text-white rounded-full px-2 text-xs">
              {appointmentCount}
            </span>
          </NavLink>

          <NavLink
            style={navLinkStyle}
            className={"w-full p-2 h-[40px] "}
            to="/doctor-review"
          >
            Message
          </NavLink>
        </div>
      </div>
      <div className="w-full text-center  h-[80px] p-2">
        <button
          onClick={handleSignOut}
          className="bg-black text-white rounded-full text-md font-medium p-2 cursor-pointer hover:scale-110 duration-200 active:scale-90 "
        >
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default DoctorSidebar;
