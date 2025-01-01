import "./UpdateEvent.css";
import { Link, useNavigate, useParams } from 'react-router-dom';
import flatpickr from 'flatpickr';
import { useEffect, useRef, useState } from 'react';

export default function UpdateEvent(props) {  // Burde hatt alt data i formData og ikke hver for seg med time

  const params = useParams();

  const [error, setError] = useState(false);

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const [changing, setChanging] = useState(false);

  const dateInputRef = useRef(null); // Create a ref for the input element

  const [formData, setFormData] = useState({
    "title": "",
    "description": "",
    "happeningTime": {
      year: "",
      month: "",
      dayInMonth: "",
      hour: "",
      minute: ""
    }
  });

  const handleTimeChange = (event) => {
    const { name, value } = event.target;

    setFormData((prevFormData) => ({
      ...prevFormData,
      happeningTime: {
        ...prevFormData.happeningTime,
        [name]: value
      }
    }));
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value
    }));
  };

  const fetchSite = async () => {
    if (loading) return;
    setLoading(true);
    try {
        const response1 = await fetch(`${props.API_URL}/api/site?id=${params.siteId}`, {
            method:"GET",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
            },
        });
        const data1 = await response1.json();

    } catch (error) {
        console.error(error.message);
    } finally {
        setLoading(false);
    }
  }

  const fetchCurrentEvent = async () => {
    if (loading) return;
    setLoading(true);
    try {
        const response = await fetch(`${props.API_URL}/api/event?id=${params.eventId}`, {
            method:"GET",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
            }
        });
        const data = await response.json();
        setFormData({
            title: data.title,
            description: data.description,
            happeningTime: {
                year: data.happeningTime.year,
                month: data.happeningTime.month,
                dayInMonth: data.happeningTime.dayInMonth,
                hour: data.happeningTime.hour,
                minute: data.happeningTime.minute
            }
        });
    } catch (error) {
        console.error(error.message);
    } finally {
        setLoading(false);
    }
    }
  
  useEffect(() => {
    fetchSite();
    fetchCurrentEvent();
  }, []);

    useEffect(() => {
        // Initialize flatpickr
        const picker = flatpickr(dateInputRef.current, {
          mode: 'single', // single date selection
          static: true,    // keeps the datepicker visible
          monthSelectorType: 'static',
          dateFormat: 'j M, Y', // Format the date (e.g., 25 Dec, 2024)
          prevArrow: '<svg className="fill-current" width="7" height="11" viewBox="0 0 7 11"><path d="M5.4 10.8l1.4-1.4-4-4 4-4L5.4 0 0 5.4z" /></svg>',
          nextArrow: '<svg className="fill-current" width="7" height="11" viewBox="0 0 7 11"><path d="M1.4 10.8L0 9.4l4-4-4-4L1.4 0l5.4 5.4z" /></svg>',
          onChange: (selectedDates) => {
            if (selectedDates.length > 0) {
              const selectedDate = selectedDates[0]; // Get the first selected date
    
              // Update happeningTime with the selected date
              setFormData((prevFormData) => ({
                ...prevFormData,
                happeningTime: {
                  ...prevFormData.happeningTime,
                  year: selectedDate.getFullYear(),
                  month: selectedDate.getMonth() + 1, // Add 1 to make it 1-based
                  dayInMonth: selectedDate.getDate()
                }
              }));
            }
          }
        });
    
        // Cleanup function to destroy flatpickr when component unmounts
        return () => picker.destroy();
      }, [changing]);

    const handleSubmit = async (e) => {
      e.preventDefault();
      setError(false);

      const hour = formData.happeningTime.hour;
      const minute = formData.happeningTime.minute;
      
      if (isNaN(hour) || isNaN(minute)) {
        setError(true);
        return;
      }

        if (hour > 23 || minute < 0 || minute > 59 || minute < 0) {
            setError(true);
            return;
        }
        
        if ((hour !== "" || minute !== "") && formData.happeningTime.year === "") {
            setError(true);
            return;
        }

        if ((hour && !minute) || (minute && !hour)) {
            setError(true);
            return;
        }
        try {
            const response = await fetch(`${props.API_URL}/api/event/update?id=${params.eventId}`, {
                method:"PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify(formData)
            });
            const data = await response.json();
            navigate(`/site/${params.siteId}`);
        } catch (error) {
            console.error(error.message);
            setError(true);
        }
      }

    const handleMouseDown = () => {
        setChanging(!changing);
    }

      return (
        <>
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
          <h3 className="font-medium text-black dark:text-white">
            Oppdater en hendelse
          </h3>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-6.5">
            <div className="mb-4.5">
              <label className="mb-2.5 block text-black dark:text-white">
                Ny Tittel
              </label>
              <input
                type="text"
                required
                value={formData.title}
                name='title'
                onChange={handleChange}
                placeholder="Skriv inn tittelen på hendelsen"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
            </div>

            <div>
                <label className="mb-3 block text-black dark:text-white">
                  Ny Beskrivelse
                </label>
                <textarea
                rows={6}
                value={formData.description}
                name='description'
                onChange={handleChange}
                placeholder="Skriv inn teksten på hendelsen"
                className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                ></textarea>
            </div>
            
            <div>
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Ny Dato (valgfri)
                </label>
                <div className="relative">
                    <input
                    ref={dateInputRef}
                    className="form-datepicker w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    placeholder="dd/mm/yyyy"
                    data-class="flatpickr-right"
                    onMouseDown={handleMouseDown}
                    id="date-selector"
                    />

                    <div className="pointer-events-none absolute inset-0 left-auto right-5 flex items-center">
                    <svg
                        width="18"
                        height="18"
                        viewBox="0 0 18 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                        d="M15.7504 2.9812H14.2879V2.36245C14.2879 2.02495 14.0066 1.71558 13.641 1.71558C13.2754 1.71558 12.9941 1.99683 12.9941 2.36245V2.9812H4.97852V2.36245C4.97852 2.02495 4.69727 1.71558 4.33164 1.71558C3.96602 1.71558 3.68477 1.99683 3.68477 2.36245V2.9812H2.25039C1.29414 2.9812 0.478516 3.7687 0.478516 4.75308V14.5406C0.478516 15.4968 1.26602 16.3125 2.25039 16.3125H15.7504C16.7066 16.3125 17.5223 15.525 17.5223 14.5406V4.72495C17.5223 3.7687 16.7066 2.9812 15.7504 2.9812ZM1.77227 8.21245H4.16289V10.9968H1.77227V8.21245ZM5.42852 8.21245H8.38164V10.9968H5.42852V8.21245ZM8.38164 12.2625V15.0187H5.42852V12.2625H8.38164V12.2625ZM9.64727 12.2625H12.6004V15.0187H9.64727V12.2625ZM9.64727 10.9968V8.21245H12.6004V10.9968H9.64727ZM13.8379 8.21245H16.2285V10.9968H13.8379V8.21245ZM2.25039 4.24683H3.71289V4.83745C3.71289 5.17495 3.99414 5.48433 4.35977 5.48433C4.72539 5.48433 5.00664 5.20308 5.00664 4.83745V4.24683H13.0504V4.83745C13.0504 5.17495 13.3316 5.48433 13.6973 5.48433C14.0629 5.48433 14.3441 5.20308 14.3441 4.83745V4.24683H15.7504C16.0316 4.24683 16.2566 4.47183 16.2566 4.75308V6.94683H1.77227V4.75308C1.77227 4.47183 1.96914 4.24683 2.25039 4.24683ZM1.77227 14.5125V12.2343H4.16289V14.9906H2.25039C1.96914 15.0187 1.77227 14.7937 1.77227 14.5125ZM15.7504 15.0187H13.8379V12.2625H16.2285V14.5406C16.2566 14.7937 16.0316 15.0187 15.7504 15.0187Z"
                        fill="#64748B"
                        />
                    </svg>
                    </div>
                </div>
                </div>

            <div className="time-container">
                <h2>Nytt Klokkeslett (valgfritt):</h2>
            <div>
                <input
                id='hour-field'
                type="text"
                name='hour'
                value={formData.happeningTime.hour}
                onChange={handleTimeChange}
                placeholder="Time: Eks: 15"
                min={0}
                max={23}
                maxLength={2}
                className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
            </div>
            <div>
                <input
                id='minute-field'
                type="text"
                value={formData.happeningTime.minute}
                name='minute'
                onChange={handleTimeChange}
                placeholder="Minutt: Eks: 00"
                min={0}
                max={59}
                maxLength={2}
                className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
            </div>
            </div>

            <button className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90" type='submit'>
              Oppdater hendelse
            </button>
            {error && (
                <div className="flex w-full border-l-6 border-[#F87171] bg-[#F87171] bg-opacity-[15%] px-7 py-8 shadow-md dark:bg-[#1B1B24] dark:bg-opacity-30 md:p-9" id='err-msg'>
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
                    Det oppstod en feil
                </h5>
                <ul>
                    <li className="leading-relaxed text-[#CD5D5D]">
                    Det oppstod en feil under opprettingen av hendelsen. Dette skyldes mest sannsynlig
                    at siden som hendelsen er bundet til ikke finnes eller at du har skrevt inn feil / ulovlig informasjon.
                    </li>
                </ul>
                </div>
            </div>
            )}
          </div>
        </form>
      </div>
        </>
    );
}