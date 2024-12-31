import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom";
import * as React from 'react';
import Avatar from '@mui/joy/Avatar';
import Chip from '@mui/joy/Chip';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import ButtonGroup from '@mui/joy/ButtonGroup';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import CardOverflow from '@mui/joy/CardOverflow';
import CardActions from '@mui/joy/CardActions';
import IconButton from '@mui/joy/IconButton';
import Typography from '@mui/joy/Typography';
import SvgIcon from '@mui/joy/SvgIcon';
import "./SiteOverview.css";
import InfiniteScroll from "react-infinite-scroll-component";
import AltButton from '@mui/material/Button';


export default function SiteOverview() {

    const [loading, setLoading] = useState(false);
    const [site, setSite] = useState({});
    const params = useParams();
    const [events, setEvents] = useState([]);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [allowedAccess, setAllowedAccess] = useState(false);
    

    const fetchSite = async () => {
        if (loading) return;
        setLoading(true);
        try {
            const response1 = await fetch(`https://9eb0-85-164-168-215.ngrok-free.app/api/site?id=${params.id}`, {
                method:"GET",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                },
            });
            const data1 = await response1.json();
            setSite(data1);

            const response = await fetch("https://9eb0-85-164-168-215.ngrok-free.app/api/user/self", {
                method: "GET",
                headers: {
                  "Authorization": `Bearer ${localStorage.getItem("token")}`
                }
              });
              const data = await response.json();

              if (data1.user.username === data.username) {
                setAllowedAccess(true);
              }
        } catch (error) {
            console.error(error.message);
        } finally {
            setLoading(false);
        }
    }

    const fetchEvents = async () => {
        if (loading) return;
        setLoading(true);
        try {
            const response = await fetch(`https://9eb0-85-164-168-215.ngrok-free.app/api/lim-events/related?page=${page}&size=22&siteId=${params.id}`, {
                method:"GET",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                }
            });
            const data = await response.json();
            if (data.events.length <= 0) {
                setHasMore(false);
            }
            setEvents(prevEvents => {
                // Create a new array that combines the current and new requests,
                // but removes any duplicates based on the `id` field.
                const combinedEvents = [...prevEvents, ...data.events];
                const uniqueEvents = combinedEvents.filter((value, index, self) =>
                    index === self.findIndex((t) => (
                        t.id === value.id
                    ))
                );
                return uniqueEvents;
            });
        } catch (error) {
            console.error(error.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchSite();
    }, []);

    useEffect(() => {
        fetchEvents();
    }, [page]);

    const loadMoreData = () => {
        if (!loading) {
            setPage(prev => prev + 1);
        }
    }

    const deleteEvent = async (id) => {
        if (loading) return;
        setLoading(true);
        try {
            const response = await fetch(`https://9eb0-85-164-168-215.ngrok-free.app/api/event/delete?id=${id}`, {
                method:"DELETE",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                }
            });
            setEvents(prevEvents => prevEvents.filter(ev => ev.id !== id));
        } catch (error) {
            console.error(error.message);
        } finally {
            setLoading(false);
            setOpen(false);
        }
    }

    const handleDelClick = (id) => {
        setSelectedEvent(id);
        setOpen(true);
    }

    return (
        <>
        {allowedAccess ? (
        <div id="main-container">
            <h1 className="text-black dark:text-white text-3xl font-bold mb-6 leading-snug">
                Oversikt: {site.name}
            </h1>
            <h3
                className="text-black dark:text-white text-lg font-medium max-w-lg mb-6 leading-relaxed"
                id="exp-text"
            >
                Du kan her endre hendelser eller annen informasjon på nettsiden din som kan endres. 
                Endringer er tilgjengelige dersom du har mottatt beskjed om dette fra oss. <br />
                Har du spørsmål? Ta kontakt med oss <a className="text-blue-600 hover:underline" href="/chat">her </a> 
                eller besøk vår <a className="text-blue-600 hover:underline" href="/help"> hjelpeside</a>.
            </h3>
            {!events.length <= 0 ? (
                <div id="event-scroll-container" className="dark:bg-gray-800">
                    <InfiniteScroll
                        dataLength={events.length}
                        next={loadMoreData}
                        hasMore={hasMore}
                        scrollableTarget="event-scroll-container"
                    >
                    <div id="event-holder">
                        {events.map((e) => (
                            <Card sx={{ width: 320, maxWidth: '100%', boxShadow: 'lg' }} className="event-card bg-gradient-to-br from-[#8baff3] to-[#b4c9e6] dark:from-[#09081f] dark:to-[#253e8f]" key={e.id}>
                                <CardContent sx={{ alignItems: 'center', textAlign: 'center' }}>
                                    <Typography className="dark:text-white text-black" level="title-lg">{e.title}</Typography>
                                    <Typography style={{borderBottom:"1px solid black"}} className="dark:text-white text-black" level="body-sm" sx={{ maxWidth: '24ch' }}>
                                        Beskrivelse: {e.description}
                                    </Typography>
                                    <Typography className="dark:text-white text-black" level="body-sm" sx={{ maxWidth: '24ch' }}>
                                        {e.happeningTime.year && (
                                            <span className="dark:text-white text-black">
                                                Tidspunkt: {e?.happeningTime?.dayInMonth}.{e?.happeningTime?.month}.{e?.happeningTime?.year}
                                                <br />
                                                {e.happeningTime.hour && (
                                                    <span className="dark:text-white text-black" >Kl: {e?.happeningTime?.hour}:{e?.happeningTime?.minute}</span>
                                                )}
                                            </span>
                                        )}
                                    </Typography>
                                </CardContent>
                                <CardOverflow sx={{ bgcolor: 'background.level1' }}>
                                    <CardActions buttonFlex="1">
                                        <ButtonGroup variant="outlined" sx={{ bgcolor: 'background.surface' }}>
                                            <Button onClick={() => navigate(`/event/${site.id}/${e.id}`)}>Vis</Button>
                                            <Button onClick={() => navigate(`/edit-event/${site.id}/${e.id}`)}>Oppdater</Button>
                                            <Button onClick={() => handleDelClick(e.id)}>Slett</Button>
                                        </ButtonGroup>
                                    </CardActions>
                                </CardOverflow>
                            </Card>
                        ))}
                    </div>
                    </InfiniteScroll>
                </div>
            ) : (
                <div id="noEventContainer">
                    Du har ingen hendelser på siden din for øyeblikket
                    <br />
                    Du kan opprette en ny hendelse ved å trykke på knappen under
                    <br />
                    <AltButton variant="outlined" color="primary" onClick={() => navigate(`/create-event/${params.id}`)} style={{marginTop:"20px"}}>
                        Opprett
                    </AltButton>
                </div>
            )}

            {open && (
                <div id="event-delete-container">
                    <div id="conf-delete-event">
                        <h3>Er du sikker på at du vil slette?</h3>
                        <br />
                        <AltButton variant="outlined" color="error" onClick={() => deleteEvent(selectedEvent)}>
                            Slett
                        </AltButton>
                        <AltButton variant="outlined" color="primary" onClick={() => setOpen(false)}>
                            Avbryt
                        </AltButton>
                    </div>
                </div>
            )}
            <button onClick={() => navigate(`/create-event/${site.id}`)} id='create-new-event-btn'>
                <h3>+</h3>
            </button>
        </div>
        ): <div>Du har ikke tilgang til dette stedet</div>}
        </>
    );
    
}