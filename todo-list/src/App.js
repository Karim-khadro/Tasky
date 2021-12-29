import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import {
  Routes,
  Route,
  BrowserRouter,
  Navigate,
} from "react-router-dom";
import { useState } from 'react';

export default function App() {
  const [auth, setAuth ] = useState(false);
  const [username, setUsername ] = useState("");
  const [userId, setUserId ] = useState("");

  return (
    <BrowserRouter>
      <Routes>
        {/* protected routes */}
        <Route path="/" element={<IsAuthenticated auth={ auth } username = {username} userId = {userId} />} />

        {/* login route */}
        <Route path="/login" element={<Login  loggedin={auth =>setAuth(auth)} getusername={username =>setUsername(username)} userId={userId=>setUserId(userId)} />} />
        <Route path="/register" element={<Register loggedin={auth =>setAuth(auth)} getusername={username =>setUsername(username)} userId={userId=>setUserId(userId)} />} />
      </Routes>
    </BrowserRouter>
  );
}

function IsAuthenticated(props) { 
  console.log("IsAuthenticated props.auth :"+ props.auth );
  return props.auth ? <Home username = {props.username} userId = {props.userId}/> : <Navigate to="/login" />;
}
