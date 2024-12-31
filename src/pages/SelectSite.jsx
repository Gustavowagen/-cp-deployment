import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import webImg from "../../src/images/cards/website.png";
import { useEffect, useState } from 'react';
import "./SelectSite.css";
import { useNavigate } from 'react-router-dom';

export default function SelectSite() {
  const [sites, setSites] = useState([]);

  const [wrongText, setWrongText] = useState(false);

  const [showDeleteForm, setShowDeleteForm] = useState(false);

  const [currentSiteId, setCurrentSiteId] = useState(null);

  const [deleteText, setDeleteText] = useState("");

  const [showRequestForm, setShowRequestForm] = useState(false);

  const [newSiteData, setNewSiteData] = useState({
    "name": "",
    "url": ""
  });

  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;

    setNewSiteData({
      ...newSiteData,
      [name]: value,
    });
  }

  const fetchSites = async () => {
    try {
      const response = await fetch("https://9eb0-85-164-168-215.ngrok-free.app/api/sites/related", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      setSites(data);
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    fetchSites();
  }, []);

  useEffect(() => {
    //console.log(sites);
  }, [sites]);

  const handleDelete = async (e) => {
    e.preventDefault();
    if (deleteText !== "slett side") {
        setWrongText(true);
        return;
    }
    try {
        const response = await fetch(`https://9eb0-85-164-168-215.ngrok-free.app/api/site/delete?id=${currentSiteId}`, {
            method:"DELETE",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json",
            }
        });
        toggleDeleteForm();
        setSites(prevSites => prevSites.filter(site => site.id !== currentSiteId));
    } catch (error) {
        console.error(error.message);
    }
  }

  const toggleDeleteForm = () => {
    setShowDeleteForm(prev => !prev);
    setDeleteText("");
  }

  const requestNewSite = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`https://9eb0-85-164-168-215.ngrok-free.app/api/site/request`, {
        method:"POST",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newSiteData),
      });
      const data = await response.json();
      setNewSiteData({
        "name": "",
        "url": ""
      });
      setShowRequestForm(false);
    } catch (error) {
      console.error(error.message);
    }
  }

  return (
    <>
    {showDeleteForm && (
            <div id='alt-site-contaiener'>
            <div id='delete-site-container'>
                <form onSubmit={handleDelete}>
                    <h5 style={{color: "black", marginBottom: "15px", marginLeft: "5px"}} >Skriv: "slett side" for å slette siden</h5>
                    <input
                    onChange={(e) => setDeleteText(e.target.value)}
                    value={deleteText}
                      type="text"
                      placeholder="Skriv her"
                      className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                    <Button variant="outlined" color="error" type='submit' id='site-del-btn'>
                        Bekreft sletting
                    </Button>
                    {wrongText && (<h3>Ikke riktig tekst</h3>)}
                    <br />
                    <button style={{marginLeft:"5px", marginTop:"5px"}} onClick={toggleDeleteForm} className='dark: text-black'>Gå tilbake</button>
                </form>
            </div>
        </div>
    )}


        <div id="card-container">
            {sites.map((site) => (
            <Card sx={{ maxWidth: 345 }} key={site.id} className='site-card'>
            <CardMedia sx={{ height: 140 }} image={webImg} title="green iguana" />
            <CardContent>
            <Typography gutterBottom variant="h4" component="div">
                {site.name}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }} className='site-card-text-large'>
                Her kan du endre innholdet på din side
            </Typography>
              <a href={site.url} style={{color: "blue"}}>
                {site.url}
              </a>
            </CardContent>
            <CardActions>
            <Button size="small" onClick={() => navigate(`/site/${site.id}`)}>Vis / Rediger</Button>
            <Button size="small" onClick={() => {toggleDeleteForm(); setCurrentSiteId(site.id)}}>Slett</Button>
            </CardActions>
        </Card>
            ))}
        </div>
        {sites.length === 0 && (
          <div id='nosite-container'>
            <h3>Du har ingen sider her for øyeblikket. Trykk på knappen under for å sende foresørsel om en side</h3>
            <Button variant="contained" size="large" id='button-margin-top' onClick={() => setShowRequestForm(true)}>
              Be om side
            </Button>
          </div>
        )}
        {showRequestForm && (
              <div id="request-site-form">
                <form id='just-the-form' onSubmit={requestNewSite} >
                  <h1>Send en forespørsel</h1>
                  <h3>Sidens navn</h3>
                  <input
                    type="text"
                    value={newSiteData.name}
                    name='name'
                    onChange={handleChange}
                    placeholder="Sidens navn"
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                    <input
                    type="text"
                    value={newSiteData.url}
                    name='url'
                    onChange={handleChange}
                    placeholder="Valgfri link til siden"
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                    <Button variant="contained" size="large" id='button-margin-top' type='submit'>
                      Send forespørsel
                    </Button>
                  <br />
                  <button style={{marginLeft:"5px", marginTop:"15px"}} onClick={() => setShowRequestForm(false)} className='dark: text-black'>Gå tilbake</button>
                </form>
              </div>
            )}
            <button onClick={() => setShowRequestForm(true)} id='create-new-site-btn'><h3>+</h3></button>
    </>
  );
}
