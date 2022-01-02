import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import { decrypt, renewToken,encrypt } from "./utile";
import {
  Routes,
  Route,
  BrowserRouter,
  Navigate,
} from "react-router-dom";
import { useState, useEffect } from 'react';


export default function App() {
  const [auth, setAuth] = useState(false);
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // sessionStorage.removeItem('refreshToken');

  useEffect(async () => {
    async function componentDidMount() {
      var refToken = sessionStorage.getItem('refreshToken');
      if (refToken) {
        refToken = await decrypt(refToken);
        const response = await fetch(process.env.REACT_APP_BACKEND_API_URL + '/user/newtoken', {
          method: 'Get',
          headers: {
            'Accept': 'application/json, text/plain, */*',
            "token": "ref_token",
            'Authorization': "Bearer " + refToken
          }
        });
        const res = await response.json();
        console.log("useEffect res : ");
        console.log(res);

        setAuth(res.isauth);
        if (res.isauth) {
          const cipherToekn = encrypt(res.refreshtoken);
          sessionStorage.setItem('refreshToken', cipherToekn);
          setUsername(res.username);
          setUserId(res.userid);
          setInterval(renewToken, parseInt(res.refreshtoken_age) * 1000);
        }
      }
    };
    await componentDidMount();
    setIsLoading(false);
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* protected routes */}
        {!isLoading &&
          <Route path="/" element={<IsAuthenticated auth={auth} username={username} userId={userId} setAuth={auth => setAuth(auth)} />} />
        }

        {/* login route */}
        <Route path="/login" element={<Login loggedin={auth => setAuth(auth)} getusername={username => setUsername(username)} userId={userId => setUserId(userId)} />} />
        <Route path="/register" element={<Register loggedin={auth => setAuth(auth)} getusername={username => setUsername(username)} userId={userId => setUserId(userId)} />} />
      </Routes>
    </BrowserRouter>
  );
}

function IsAuthenticated(props) {
  console.log("IsAuthenticated props.auth :" + props.auth);
  return props.auth ? <Home username={props.username} userId={props.userId} /> : <Navigate to="/login" />;
}

