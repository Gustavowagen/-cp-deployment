import { useEffect, useState } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';

import Loader from './common/Loader';
import PageTitle from './components/PageTitle';
import SignIn from './pages/Authentication/SignIn';
import SignUp from './pages/Authentication/SignUp';
import Calendar from './pages/Calendar';
import FormElements from './pages/Form/FormElements';
import FormLayout from './pages/Form/FormLayout';
import Profile from './pages/Profile';
import Tables from './pages/Tables';
import Alerts from './pages/UiElements/Alerts';
import DefaultLayout from './layout/DefaultLayout';
import Chat from './pages/Chat';
import ForgotPassword from './pages/Authentication/ForgotPassword';
import SelectSite from './pages/SelectSite';
import RequestDashboard from './pages/Requests';
import SiteOverview from './pages/SiteOverview';
import EventOverview from './pages/EventOverview';
import CreateEvent from './pages/CreateEvent';
import UpdateEvent from './pages/UpdateEvent';
import EditProfile from './pages/EditProfile';
import WelcomePage from './pages/Dashboard/WelcomePage';
import HelpPage from './pages/Help';
import { jwtDecode } from 'jwt-decode';


function App() {
  const [loading, setLoading] = useState(true);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  
  const [token, setToken] = useState("");

  const API_URL = import.meta.env.VITE_API_URL;

  const isTokenExpired = (jwtToken) => {
    if (!jwtToken)  {
      return true;
    }
    try {
      const decodedToken = jwtDecode(jwtToken);
      const currentTime = Date.now() / 1000;
      if (decodedToken.exp < currentTime + 5 * 60) {
        refreshToken(jwtToken);
      }
      return decodedToken.exp < currentTime;
    } catch (error) {
      console.error('Error decoding token:', error);
      return true;
    }
  };

  const refreshToken = async (_token_) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/refresh-token`, {
        method:"POST",
        headers: {
          "Authorization": `Bearer ${_token_}`,
          "Content-Type": "application/json"},
      });
      const data = await response.json(); 
      setToken(data.token);
      localStorage.setItem("token", data.token);
    } catch (error) {
      console.error("Error updating token", error.message);
    }
  }

  useEffect(() => {
    window.scrollTo(0, 0);
    if (localStorage.getItem('token')) {
      const _token = localStorage.getItem('token');
      if (isTokenExpired(_token)) {
        localStorage.removeItem('token');
        setToken("");
      } else { 
        setToken(_token);     // Kanskje trenger jeg ikke denne siden den alltid er satt med localstorage
      }
    } else {
      //console.log("Could not find token");
    }
    if (!localStorage.getItem("token") && pathname != "/auth/signup" && pathname != "/auth/forgot-password") {
      navigate("/auth/signin");
    }
  }, [pathname]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  const authRoutes = (
    <Routes>
      <Route path="/auth/forgot-password" element={<><PageTitle title="Glemt passord" /><ForgotPassword /></>} />
      <Route path="/auth/signin" element={<><PageTitle title="Logg inn" /><SignIn setToken={setToken} API_URL={API_URL} /></>} />
      <Route path="/auth/signup" element={<><PageTitle title="Spør om bruker" /><SignUp API_URL={API_URL} /></>} />
    </Routes>
  );

  const appRoutes = (
    <DefaultLayout>
      <Routes>
        <Route index element={<><PageTitle title="Hjem" /><WelcomePage setToken={setToken} API_URL={API_URL} /></>} />
        
        <Route path="/profile" element={<><PageTitle title="Profil" /><Profile API_URL={API_URL} /></>} />
        
        <Route path="/edit-profile" element={<><PageTitle title="Rediger profil" /><EditProfile setToken={setToken} API_URL={API_URL} /></>} />
        
        <Route path="/chat" element={<><PageTitle title="Chat" /><Chat API_URL={API_URL} /></>} />
        
        <Route path="/select-site" element={<><PageTitle title="Velg side" /><SelectSite API_URL={API_URL} /></>} />
        
        <Route path="/request-dashboard" element={<><PageTitle title="Se requests" /><RequestDashboard API_URL={API_URL} /></>} />
        
        <Route path="/site/:id" element={<><PageTitle title="Side info" /><SiteOverview API_URL={API_URL} /></>} />
        
        <Route path="/event/:siteId/:eventId" element={<><PageTitle title="Hendelse info" /><EventOverview API_URL={API_URL} /></>} />
        
        <Route path="/create-event/:siteId" element={<><PageTitle title="Lag hendelse" /><CreateEvent API_URL={API_URL} /></>} />
        
        <Route path="/edit-event/:siteId/:eventId" element={<><PageTitle title="Rediger hendelse" /><UpdateEvent API_URL={API_URL} /></>} />
        
        <Route path="/help" element={<><PageTitle title="Hjelp" /><HelpPage API_URL={API_URL} /></>} />
      </Routes>
    </DefaultLayout>
  );

  return loading ? <Loader /> : pathname.startsWith("/auth/") ? authRoutes : appRoutes;
}

export default App;