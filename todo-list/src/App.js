import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import { decrypt, encrypt } from "./utile";
import {
  Routes,
  Route,
  BrowserRouter,
  Navigate,
} from "react-router-dom";
import { useState, useEffect } from 'react';


export default function App() {
  const [username, setUsername] = useState("");
  const [token, setToken] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  function renewToken() {
    var refToken = sessionStorage.getItem('refreshToken');
    if (refToken) {
      console.log('renewToken');
      refToken = decrypt(refToken);
      fetch(process.env.REACT_APP_BACKEND_API_URL + '/user/newtoken', {
        method: 'Get',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          "token": "ref_token",
          'Authorization': "Bearer " + refToken
        },
      }).then(res => res.json())
        .then(res => {
          if (res.isauth) {
            // Encrypt the refresh token & store it
            const cipherToekn = encrypt(res.refreshtoken);
            sessionStorage.setItem('refreshToken', cipherToekn);
            setToken(res.token);
          }
        }).catch(err => console.error(err));
    }
  };


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

        sessionStorage.setItem('isAuth', res.isauth);
        if (res.isauth) {
          const cipherToekn = encrypt(res.refreshtoken);
          sessionStorage.setItem('refreshToken', cipherToekn);
          setUsername(res.username);
          setToken(res.token);
          setInterval(renewToken, parseInt(res.refreshtoken_age) * 1000);
        }
      }
    };
    await componentDidMount();
    setIsLoading(false);
  }, [sessionStorage.getItem('isAuth')]);

  return (
    <BrowserRouter>
      <Routes>
        {/* protected routes */}
        {!isLoading &&
          <Route path="/" element={<IsAuthenticated username={username} token={token} />} />
        }

        {/* login route */}
        <Route path="/login" element={<Login setUsername={username => setUsername(username)} setToken={token => setToken(token)} />} />
        <Route path="/register" element={<Register setUsername={username => setUsername(username)} setToken={token => setToken(token)} />} />
      </Routes>
    </BrowserRouter>
  );
}

function IsAuthenticated(props) {
  console.log("IsAuthenticated auth :" + sessionStorage.getItem('isAuth'));
  var auth = sessionStorage.getItem('isAuth');
  return auth ? <Home username={props.username} token={props.token} /> : <Navigate to="/login" />;
}

