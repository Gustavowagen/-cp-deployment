import { Link, useNavigate } from 'react-router-dom';
import "./forgotPassword.css";
import { useEffect, useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import axios from 'axios';
import useColorMode from '../../hooks/useColorMode';


export default function ForgotPassword() {
  const navigate = useNavigate();

  const [colorMode, setColorMode] = useColorMode();

  const [formData, setFormData] = useState({
    "username":"",
    "email":""
  });

  const [loading, setLoading] = useState(false);

  const [success, setSuccess] = useState(false);

  const [error, setError] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  }

  useEffect(() => {
    setColorMode("light");
  }, []);

  const handleSubmit = async (e) => {
    if (loading) return;
    setLoading(true);
    setSuccess(false);
    setError(false);
    e.preventDefault();
    try {
      await axios.post("http://localhost:8080/api/auth/update-password", formData, {
        headers: { "Content-Type": "application/json" },
      });


      setSuccess(true);

      setFormData({
        "username":"",
        "email":""
      });
    } catch (error) {
      console.error(error.message);
      setError(true);
    }
    setLoading(false);
  };

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
        <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-10 md:p-20 border border-gray-200 dark:bg-gray-800 dark:border-gray-700" id="forgot-password-slight-margin">
          <h2 className="text-3xl md:text-4xl font-semibold text-center mb-10 text-black dark:text-white">
            Glemt passord?
          </h2>
          <h5 className="text-3xl md:text-xl font-semibold text-center mb-10 text-black dark:text-white">Du vil få et nytt passord på mail</h5>
          <form onSubmit={handleSubmit} >
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {/* Username Field */}
              <div>
                <label htmlFor="username" className="block text-lg font-medium text-black dark:text-white mb-2">
                  Brukernavn
                </label>
                <input
                  type="text"
                  id="username"
                  placeholder="Skriv inn brukernavnet ditt"
                  name='username'
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full px-5 py-4 text-lg border rounded-lg shadow-sm border-gray-300 focus:ring-primary focus:border-primary dark:border-gray-600 dark:bg-gray-900 dark:text-white"
                />
              </div>
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-lg font-medium text-black dark:text-white mb-2">
                  E-post
                </label>
                <input
                  type="email"
                  id="email"
                  name='email'
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Skriv inn e-posten din"
                  className="w-full px-5 py-4 text-lg border rounded-lg shadow-sm border-gray-300 focus:ring-primary focus:border-primary dark:border-gray-600 dark:bg-gray-900 dark:text-white"
                />
              </div>
            </div>
            {/* Submit Button */}
            <div className="flex flex-col mt-8 gap-4 md:flex-row md:justify-between">
              <button
                type="submit"
                className="w-full md:w-auto px-8 py-4 text-lg bg-primary text-white rounded-lg hover:bg-primary-dark focus:ring-4 focus:ring-primary-light"
              >
                Send inn
              </button>
            </div>
          </form>
          {/* Back to Login Link */}
          <div className="mt-4 text-center">
            <button
              type="button"
              className="text-lg text-primary hover:underline dark:text-primary-light"
              onClick={() => navigate("/auth/signin")}
            >
              Tilbake til innlogging
            </button>
          </div>
          {success && (
            <div className="flex w-full border-l-6 border-[#34D399] bg-[#34D399] bg-opacity-[15%] px-7 py-8 shadow-md dark:bg-[#1B1B24] dark:bg-opacity-30 md:p-9" id='successmessage'>
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
                Suksess
              </h5>
              <p className="text-base leading-relaxed text-body">
                Det nye passordet skal nå ha blitt sendt på mail. Hvis mailen ikke ble sendt kan du dobbeltsjekke mailen du skrev inn
                eller sjekke at du har en gyldig bruker. Hvis ingenting funker ta kontakt med oss
              </p>
            </div>
          </div>
          )}
          {error && (
            <div className="flex w-full border-l-6 border-[#F87171] bg-[#F87171] bg-opacity-[15%] px-7 py-8 shadow-md dark:bg-[#1B1B24] dark:bg-opacity-30 md:p-9" id='password-error-message'>
            <div className="mr-5 flex h-9 w-full max-w-[36px] items-center justify-center rounded-lg bg-[#F87171]">
              <svg
                width="13"
                height="13"
                viewBox="0 0 13 13"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6.4917 7.65579L11.106 12.2645C11.2545 12.4128 11.4715 12.5 11.6738 12.5C11.8762 12.5 12.0931 12.4128 12.2416 12.2645C12.5621 11.9445 12.5623 11.4317 12.2423 11.1114C12.2422 11.1113 12.2422 11.1113 12.2422 11.1113C12.242 11.1111 12.2418 11.1109 12.2416 11.1107L7.64539 6.50351L12.2589 1.91221L12.2595 1.91158C12.5802 1.59132 12.5802 1.07805 12.2595 0.757793C11.9393 0.437994 11.4268 0.437869 11.1064 0.757418C11.1063 0.757543 11.1062 0.757668 11.106 0.757793L6.49234 5.34931L1.89459 0.740581L1.89396 0.739942C1.57364 0.420019 1.0608 0.420019 0.740487 0.739944C0.42005 1.05999 0.419837 1.57279 0.73985 1.89309L6.4917 7.65579ZM6.4917 7.65579L1.89459 12.2639L1.89395 12.2645C1.74546 12.4128 1.52854 12.5 1.32616 12.5C1.12377 12.5 0.906853 12.4128 0.758361 12.2645L1.1117 11.9108L0.758358 12.2645C0.437984 11.9445 0.437708 11.4319 0.757539 11.1116C0.757812 11.1113 0.758086 11.111 0.75836 11.1107L5.33864 6.50287L0.740487 1.89373L6.4917 7.65579Z"
                  fill="#ffffff"
                  stroke="#ffffff"
                ></path>
              </svg>
            </div>
            <div className="w-full">
              <h5 className="mb-3 font-semibold text-[#B45454]">
                Det oppsto en feil
              </h5>
              <ul>
                <li className="leading-relaxed text-[#CD5D5D]">
                  Feilen skyldes mest sannsynlig at mailen du skrev inn ikke samsvarer med mailen
                  til brukeren du skrev inn, eller at brukernavnet er feil
                </li>
              </ul>
            </div>
          </div>
          )}
        </div>
      </div>
    </>
  );
};
