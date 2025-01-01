
import { useEffect, useState } from 'react';
import CoverOne from '../images/cover/bg-ex.png';
import defaultProfile from '../images/user/default-profile.png';
import { Link, useNavigate } from 'react-router-dom';
import "./Profile.css";
import Button from '@mui/material/Button';

const Profile = (props) => {

  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(false);
  const [sites, setSites] = useState([]);
  const navigate = useNavigate();

  const fetchProfile = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const response = await fetch(`${props.API_URL}/api/user/self`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      });
      const data = await response.json();
      setUser(data);
    } catch (error) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  const fetchRelSites = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const response = await fetch(`${props.API_URL}/api/sites/related`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      });
      const data = await response.json();
      setSites(data);
      console.log(data);
    } catch (error) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <>

      <div className="overflow-hidden rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="relative z-20 h-35 md:h-65">
          <img
            src={CoverOne}
            alt="profile cover"
            className="h-full w-full rounded-tl-sm rounded-tr-sm object-cover object-center"
          />
        </div>
        <div className="px-4 pb-6 text-center lg:pb-8 xl:pb-11.5">
          <div className="relative z-30 mx-auto -mt-22 h-30 w-full max-w-30 rounded-full bg-white/80 p-1 backdrop-blur sm:h-44 sm:max-w-44 sm:p-3">
            <div className="relative drop-shadow-2">
              <img src={defaultProfile} alt="profile" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="mb-1.5 text-2xl font-semibold text-black dark:text-white">
              {user.username}
            </h3>
            <p className="font-medium">Medlem siden: {user.created}</p>

            <br />
            <div className="mx-auto max-w-180">
              <h4 className="font-semibold text-black dark:text-white">
                Email: {user.email}
              </h4>
              <br />
              <h4 className="font-semibold text-black dark:text-white">
                Tlf: {user.phone}
              </h4>
              <br />
              <Button variant="outlined" onClick={() => navigate("/select-site")}>Mine sider</Button>
              <br />
              <Button variant="outlined" color='success' onClick={() => navigate("/edit-profile")} id='edit-pf-btn'>Rediger profil</Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
