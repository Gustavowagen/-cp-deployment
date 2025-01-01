import React, { useEffect, useState } from 'react';
import CoverOne from '../images/cover/cover-01.png';
import userSix from '../images/user/user-06.png';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Button from '@mui/material/Button';
import "./EventOverview.css";

export default function EventOverview(props) {

    const [loading, setLoading] = useState(false);
    const [event, setEvent] = useState({});
    const params = useParams();
    const [allowedAccess, setAllowedAccess] = useState(false);
    const navigate = useNavigate();

    const fetchData = async () => {
      if (loading) return;
        setLoading(true);
        try {
            // Event
            const response2 = await fetch(`${props.API_URL}/api/event?id=${params.eventId}`, {
                method:"GET",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                }
            });
            const data2 = await response2.json();
            setEvent(data2);

            // Site
            const response1 = await fetch(`${props.API_URL}/api/site?id=${params.siteId}`, {
              method:"GET",
              headers: {
                  "Authorization": `Bearer ${localStorage.getItem("token")}`,
              },
          });
          const data1 = await response1.json();

          // User
          const response = await fetch(`${props.API_URL}/api/user/self`, {
              method: "GET",
              headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`
              }
            });
            const data = await response.json();

            if (data1.user.username === data.username && (response2.title !== "" || response2.title !== undefined)) {
              setAllowedAccess(true);
            }
        } catch (error) {
            console.error(error.message);
            setAllowedAccess(false);
            console.log(allowedAccess)
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    return (
      <>
        {allowedAccess ? (
        <div className="event-card-container dark:bg-meta-4">
          {/* Cover Image Section */}
          <div className="event-cover-image">
            <img
              src={CoverOne}
              alt="Event Cover"
              className="event-cover-img"
            />
          </div>
    
          {/* Event Details */}
          <div className="event-details">
            {/* Event Title */}
            <h1 className="event-title text-black dark:text-white">{event.title}</h1>
            {/* Event Date and Time */}
            {event.happeningTime?.year && (
              <div className="event-datetime">
                <p className='dark:text-white text-black'>
                  <span className="event-label">Tidspunkt:</span> {event?.happeningTime?.dayInMonth}.{event?.happeningTime?.month}.{event?.happeningTime?.year}
                </p>
                {event.happeningTime.hour && (
                  <p className='dark:text-white text-black'>
                    <span className="event-label">Kl:</span> {event?.happeningTime?.hour}:{event?.happeningTime?.minute}
                  </p>
                )}
              </div>
            )}
    
            {/* Event Description */}
            <div className="event-description-container">
              <h2 className="event-description-title dark:text-white text-black">Beskrivelse:</h2>
              <p className="event-description-text dark:text-white text-black">{event.description}</p>
            </div>
    
            {/* Edit Button */}
            <div className="event-actions">
              <button
                className="edit-event-button"
                onClick={() => navigate(`/edit-event/${params.siteId}/${event.id}`)}
              >
                Rediger
              </button>
            </div>
          </div>
        </div>
        ): <div>Du har ikke tilgang til dette stedet</div>}
      </>
    );
    
}