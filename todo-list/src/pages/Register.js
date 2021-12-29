
// Simple Login: email & password 
import { useNavigate } from 'react-router-dom';
import { useRef, useState } from "react";


export default function Register(props) {

  const nameInput = useRef();
  const emailInput = useRef();
  const passwordInput = useRef();
  const [errorMsg,setErrorMsg] = useState("");

  const navigate = useNavigate();

  console.log(process.env.REACT_APP_BACKEND_API_URL);
  const handleSubmit = (e) => {

    e.preventDefault();
    const name = nameInput.current.value;
    const email = emailInput.current.value;
    const password = passwordInput.current.value;

    fetch(process.env.REACT_APP_BACKEND_API_URL + '/user/signup', {
      method: 'POST',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ "name": name, "email": email, "password": password })

    }).then(res => res.json())
      .then(res => {
        console.log(res);
        if (res.isauth) {
          // Changing the stat of the parent 
          props.loggedin(true);
          props.getusername(res.username);
          props.userId(res.userid); 
          // To go the main page
          navigate("/");
        }
        else {
          setErrorMsg(res.errormsg);
          props.loggedin(false);
        }
      })
      .catch(err => console.error(err));
  }

  return (
    <div className='h-screen flex bg-gray-bg1'>
      <div className='w-full max-w-md m-auto bg-white rounded-lg border border-primaryBorder shadow-default py-10 px-16'>
        <h1 className="mb-6 text-4xl -mt-1 text-center">Register</h1>
        <form onSubmit={handleSubmit}>
          <div className="ml-2 mb-4 ">
            <label>Name</label>
            <input required="required" ref={nameInput} type="text" id="name" className="border-2 w-full mb-4 h-8"></input>
            <label>E-mail</label>
            <input required="required" ref={emailInput} type="text" id="email" className="border-2 w-full mb-4 h-8"></input>
            <label>Password</label>
            <input required="required" ref={passwordInput} type="password" id="password" className="border-2 w-full mb-4 h-8"></input>
          </div>
          <h2 className=' text-red-600 mb-3'>{errorMsg}</h2> 
          <div className="ml-2 mb-4 ">
            
            <button type="submit" className=" bg-green-500 rounded-lg border-2 border-green-500 w-1/3 h-10 text-xl text-white ">Sign up</button>
          </div>
          <a href='/login' className="ml-2 mb-4 text-blue-600 underline ">Sign in</a>
        </form>
      </div>
    </div>
  )
}
