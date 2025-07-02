import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import profiePic from "../../../assets/human6.jpg";
import axios from "axios";
import Swal from "sweetalert2";
import UserSidebar from "./UserSidebar";

function UserAppointment() {
  const [appointments, setAppointments] = useState([]);
  const [userData, setuserData] = useState([]);

  const colorForStatus = (status) => {
    switch (status) {
      case "scheduled":
        return "text-orange-300";
      case "inProgress":
        return "text-blue-300";
      case "completed":
        return "text-green-300";
      case "cancelled":
        return "text-red-300";
      default:
        return "text-green-300";
    }
  };

  useEffect(() => {
    const fetchAppointmentsAndDoctors = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        setuserData(user);

        const res = await axios.get(
          `http://localhost:5000/appointment/get-appointments/${user.email}`
        );
        const appointments = res.data;
        setAppointments(appointments);
        const doctorIds = [...new Set(appointments.map((app) => app.doctor))];
        const doctorRes = await axios.post(`http://localhost:5000/user/ids`, {
          ids: doctorIds,
        });
        const doctors = doctorRes.data;
        const doctorMap = {};
        doctors.forEach((doc) => {
          doctorMap[doc._id] = doc.userName;
        });

        const appointmentsWithDoctorNames = appointments.map((app) => ({
          ...app,
          doctorName: doctorMap[app.doctor] || "Unknown Doctor",
        }));

        setAppointments(appointmentsWithDoctorNames);
      } catch (err) {
        Swal.fire({
          title: "Error",
          icon: "error",
          confirmButtonText: "Ok",
          text: "Error Fetching Appointments or Doctors! Please Try Again!",
        });
      }
    };

    fetchAppointmentsAndDoctors();
  }, []);

  return (
    <section className="flex items-center justify-center bg-slate-300">
      <div className="flex h-[80%] w-[80%] bg-white p-2 shadow-xl">
        <UserSidebar profiePic={profiePic} userName={userData.userName} />
        <div>
          <div className="flex flex-col gap-4 p-4">
            <h1 className="text-3xl font-semibold">Appointments</h1>
            <div className="overflow-y-auto h-[65vh] border rounded-xl shadow-md">
              <div className="grid grid-cols-1 gap-8 md:grid-cols-4 font-semibold text-lg bg-gray-100 p-4 border-b">
                <p>Doctor</p>
                <p>Date & Time</p>
                <p className="">Reason</p>
                <p className="">Status</p>
              </div>

              {appointments.map((appointment, index) => {
                const fullDateTimeStr = `${appointment.appointmentDate}T${appointment.time}`;
                const appointmentDateTime = new Date(fullDateTimeStr);
                const formattedDate = appointmentDateTime.toLocaleString(
                  "en-US",
                  {
                    weekday: "short",
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  }
                );

                const formattedTime = appointmentDateTime.toLocaleString(
                  "en-US",
                  {
                    hour: "numeric",
                    minute: "numeric",

                    hour12: true,
                  }
                );
                return (
                  <div
                    className="grid grid-cols-1 gap-8 md:grid-cols-4 items-start p-2 border-b"
                    key={index}
                  >
                    <p className="text-base">{appointment.doctorName}</p>
                    <p className="text-base">
                      {formattedDate}
                      <br />
                      <span className="text-red-500 text-xl">
                        {formattedTime}
                      </span>
                    </p>
                    <p className="text-base">{appointment.reason}</p>
                    <p
                      className={`text-base font-medium ${colorForStatus(
                        appointment.status
                      )}`}
                    >
                      {appointment.status}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default UserAppointment;
