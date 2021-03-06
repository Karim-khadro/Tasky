
// Simple Login: email & password 
// 
import { useNavigate } from 'react-router-dom';
import { useRef, useState } from "react";
import { encrypt ,postRequest} from "../utile";


export default function Login(props) {

    // sessionStorage.removeItem('refreshToken');
    const emailInput = useRef();
    const passwordInput = useRef();
    const [errorMsg, setErrorMsg] = useState("");
    const navigate = useNavigate();
    // console.log("Login: ");
    // console.log(props);
    const handleSubmit = async(e) => {
        e.preventDefault();
        const email = emailInput.current.value;
        const password = passwordInput.current.value;


        var res = await postRequest('/user/login', null, JSON.stringify({ "email": email, "password": password }))
        if (res.isauth) {
            setErrorMsg("");
            // Encrypt the refresh token & store it
            const cipherToekn = encrypt(res.refreshtoken);
            sessionStorage.setItem('refreshToken', cipherToekn);

            sessionStorage.setItem('isAuth', res.isauth);

            props.setUsername(res.username);
            props.setToken(res.token);     
            navigate("/");
        }
        else {
            setErrorMsg(res.errormsg);
            sessionStorage.setItem('isAuth', res.isauth);
        }

    }

    return (
        <div className='h-screen flex bg-gray-bg1'>
            <div className='w-full max-w-md m-auto bg-white rounded-lg border border-primaryBorder shadow-default py-10 px-16'>
                <h1 className="mb-6 text-4xl -mt-1 text-center">Login</h1>
                <form onSubmit={handleSubmit}>
                    <div className="ml-2 mb-4 ">
                        <label>E-mail</label>
                        <input required="required" ref={emailInput} type="text" id="email" className="border-2 w-full mb-4 h-8"></input>
                        <label>Password</label>
                        <input required="required" ref={passwordInput} type="password" id="password" className="border-2 w-full mb-4 h-8"></input>
                    </div>
                    <h2 className=' text-red-600 mb-3'>{errorMsg}</h2>
                    <div className="ml-2 mb-6 ">
                        <button type="submit" className=" bg-green-500 rounded-lg border-2 border-green-500 w-1/3 h-10 text-xl text-white ">Login</button>
                    </div>
                </form>
                <a href='/register' className="ml-2 mt-4 text-blue-600 underline ">New user?</a>
            </div>
        </div>
    )
}