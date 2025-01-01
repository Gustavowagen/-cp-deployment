import React, { useEffect, useState } from 'react';

import "./signUp.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';
import useColorMode from '../../hooks/useColorMode';

export default function SignUp(props) {

  const [formData, setFormData] = useState({
    "username":"",
    "email":"",
    "phone":""
  });

  const [colorMode, setColorMode] = useColorMode();

  const [success, setSuccess] = useState(false);

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    setColorMode("light");
    try {
      const main = document.querySelector("main");
      if (main !== null) {
        main.style.overflow = "hidden";
      }
    } catch (error) {
      console.error("Error");
    }
  }, []);

  const loginPage = () => {
    navigate("/auth/signin");
  }

  const handleSubmit = async (e) => {
    if (loading) return;
    setLoading(true);
    e.preventDefault();
    try {
      // Sending a POST request with Axios
      await axios.post(`${props.API_URL}/api/auth/request-account`, formData, {
        headers: { "Content-Type": "application/json" }
      });

      setSuccess(true);
      
      setFormData({
        "username": "",
        "email": "",
        "phone": ""
      });
    } catch (error) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (event) => {
    const {name, value} = event.target;

    setFormData({
        ...formData,
        [name]:value,
    });
}

  return (
    <>
    {loading && (
        <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1000,
        }}
      >
        <CircularProgress style={{width: "100px", height:"100px"}} />
      </div>
    )}
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-10 md:p-20 border border-gray-200 dark:bg-gray-800 dark:border-gray-700" id='slight-margin'>
          <h2 className="text-3xl md:text-4xl font-semibold text-center mb-10 text-gray-800 dark:text-gray-200">
            Send forespørsel om bruker
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {/* Name Field */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Navn på eier eller bedrift
                </label>
                <input
                  type="text"
                  id="name"
                  name='username'
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Skriv in kontoens brukernavn"
                  className="w-full px-5 py-4 text-lg border rounded-lg shadow-sm border-gray-300 focus:ring-primary focus:border-primary dark:border-gray-600 dark:bg-gray-900 dark:text-white"
                />
              </div>
              {/* Email Field */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name='email'
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Skriv inn email"
                  className="w-full px-5 py-4 text-lg border rounded-lg shadow-sm border-gray-300 focus:ring-primary focus:border-primary dark:border-gray-600 dark:bg-gray-900 dark:text-white"
                />
              </div>
              {/* Phone Number Field */}
              <div>
                <label
                  htmlFor="phone"
                  className="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Telefonnummer
                </label>
                <input
                  type="text"
                  id="phone"
                  name='phone'
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Skriv inn telefonnummer"
                  className="w-full px-5 py-4 text-lg border rounded-lg shadow-sm border-gray-300 focus:ring-primary focus:border-primary dark:border-gray-600 dark:bg-gray-900 dark:text-white"
                />
              </div>
            </div>
            {/* Buttons */}
            <div className="flex flex-col mt-8 gap-4 md:flex-row md:justify-between">
              <button
                type="submit"
                className="w-full md:w-auto px-8 py-4 text-lg bg-primary text-white rounded-lg hover:bg-primary-dark focus:ring-4 focus:ring-primary-light"
              >
                Send forespørsel
              </button>
              <button
                type="button"
                className="w-full md:w-auto px-8 py-4 text-lg bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 focus:ring-4 focus:ring-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                onClick={loginPage}
              >
                Har du allerede en bruker?
              </button>
            </div>
          </form>
          {success && (
            <div className="flex w-full border-l-6 border-[#34D399] bg-[#34D399] bg-opacity-[15%] px-7 py-8 shadow-md dark:bg-[#1B1B24] dark:bg-opacity-30 md:p-9" id='givethismargin'>
            <div className="mr-5 flex h-9 w-full max-w-[36px] items-center justify-center rounded-lg bg-[#34D399]">
              <svg
                width="16"
                height="12"
                viewBox="0 0 16 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15.2984 0.826822L15.2868 0.811827L15.2741 0.797751C14.9173 0.401867 14.3238 0.400754 13.9657 0.794406L5.91888 9.45376L2.05667 5.2868C1.69856 4.89287 1.10487 4.89389 0.747996 5.28987C0.417335 5.65675 0.417335 6.22337 0.747996 6.59026L0.747959 6.59029L0.752701 6.59541L4.86742 11.0348C5.14445 11.3405 5.52858 11.5 5.89581 11.5C6.29242 11.5 6.65178 11.3355 6.92401 11.035L15.2162 2.11161C15.5833 1.74452 15.576 1.18615 15.2984 0.826822Z"
                  fill="white"
                  stroke="white"
                ></path>
              </svg>
            </div>
            <div className="w-full">
              <h5 className="mb-3 text-lg font-semibold text-black dark:text-[#34D399] ">
                Søknad sendt suksessfullt
              </h5>
              <p className="text-base leading-relaxed text-body">
                Hvis du nå får en mail på den mailen du skrev inn, betyr det at søknaden er sendt uten noen problemer.
                Selv om du ikke fikk noe mail har søknaden blitt sendt inn og kommer til å bli sett over så snart som mulig
              </p>
            </div>
          </div>
          )}
        </div>
      </div>
    </>
  );
};