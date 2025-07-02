import React, {useState , useEffect} from 'react'
import { NavLink } from 'react-router-dom';
import profiePic from '../../../assets/doct2.jpg'
import DoctorSidebar from './DoctorSidebar';
import Swal from 'sweetalert2';
import axios from 'axios';

function DoctorReview() {
    const [userData , setuserData] = useState([]);

    const [email , setEmail ] = useState("");

    const [nurses , setNurses] = useState([]);

    const [nurseData , setNurseData] = useState([]);

    const [message , setMessage] = useState("");

    const[from , setFrom] = useState("");

    useEffect(() => {
        const fetchInfo = async (e) => {
          const user = JSON.parse(localStorage.getItem("user"));
          setuserData(user);
          setFrom(user.name);
        };    
        fetchInfo();
      }, []);

      useEffect(() => {

        const fetchNurses = async () => {
              try {
                const res = await axios.get("http://localhost:5000/user/get-users");
                if (Array.isArray(res.data)) {
                  const nursesList = res.data.filter((user) => user.role === "nurse");
                  setNurseData(nursesList);
                  console.log("nursesList List:", nursesList);
                } else {
                  setNurseData([]);
                  Swal.fire({
                    title: "Error",
                    icon: "error",
                    text: "Error Fetching Nurses! Please Try Again!",
                  });
                }
              } catch (error) {
                console.error("Failed to fetch Nurses:", error);
                Swal.fire({
                  title: "Error",
                  icon: "error",
                  text: "Unable to load Nurses list. Please check your connection.",
                });
              }
            };


        const getNurses = async () => {
          await axios
            .get("http://localhost:5000/nurse/get-nurses")
            .then((response) => {
              console.log("Nurses List:", response.data);
              setNurses(response.data);
              
            })
            .catch((error) => {
              Swal.fire({
                icon: "error",
                title: "Oops...",
                text: error.message,
              });
            });
        };
    
        getNurses();
        fetchNurses();
      }, []);

       console.log("EMAIL", email);

      const handleAddMessage = (e) =>{

        const fromUser = "Doctor";
        // const nurseEmail = "nurse3@gmail.com";
        // console.log("Nurse Email", nurseEmail);
        console.log("Email", email);
        const payload = {
          email: email,
          message: message,
          from: fromUser,
        };
        console.log("PayLoad", payload);

        e.preventDefault();
        const res = axios.post("http://localhost:5000/doctor/add-message", payload)
        .then(() =>{
          console.log("PayLoad", payload);
          console.log("Message Sent", email , message ,from);
          setEmail("");
          setMessage("");
          setFrom("");

          console.log("Responsee", res.data);
          console.log("Res", res);
          Swal.fire({
            icon: "success",
            title: "Success",
            text: "Message Sent",
          });
        })
        .catch((error) =>{
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: error.message,
          });
        })

      }
      


  return (
    <section className='bg-slate-300 flex justify-center items-center'>
        <div className='h-[80%] w-[80%] bg-white shadow-xl p-2 flex'>
            <DoctorSidebar userName={userData.name} profiePic={profiePic} />
            <div className="overflow-auto  justify-center items-center w-[70%] ms-24 p-4 flex flex-col ">
               <p className="font-semibold text-3xl">MESSAGES</p>

          <form className="flex flex-col w-[60%] gap-5" action="">
            <div>
              <p>Select Nurse:</p>
              <select
                id="doctors"
                onChange={(e) => setEmail(e.target.value)}
                className="flex h-10 w-[90%] rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                 >
                {nurseData.map((value , index) =>{
                  return(
                    <option value={value.email}>{value.email}</option>
                    
                  )
                })}
              </select>
            </div>
            <div>
              <p>Message: </p>
            <textarea
              className="flex h-[50%] w-[90%] rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
              type="text"
              placeholder="Enter Your Message"
              onChange={(e) => setMessage(e.target.value)}
            ></textarea>
            </div>
            
            <button className="bg-black text-white w-[90%] p-2 rounded-full"
            onClick={handleAddMessage}>
              Sent Message
            </button>
          </form>
        </div>
        </div>
        
    </section>
  )
}

export default DoctorReview