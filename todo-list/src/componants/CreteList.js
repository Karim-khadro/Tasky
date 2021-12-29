import { useRef, useEffect, useState } from "react";

const CreteList = (props) => {
    const nameInput = useRef();
    const [nameValue, setNameValue] = useState("");
    const [errormsg, setErrormsg] = useState("");

    useEffect(() => {
        if (props.list)
            setNameValue(props.list);
    }, [props.list]);

    const handleSubmit = (e) => {
        const name = nameInput.current.value;
        e.preventDefault();

        // prevent user from using # at the start of a name 
        if (name.indexOf('#') === 0) {
            setErrormsg("Name must start with char or number");
        }
        else {
            if (props.list) {
                fetch(process.env.REACT_APP_BACKEND_API_URL+'/list/edit', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json, text/plain, */*',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ "list": props.list, "newlist": name, "userid": props.userId })

                }).then(res => res.json())
                    .then(res => {
                        if (res === true) {
                            props.newlist(name);
                        }

                    })
                    .catch(err => console.error(err));
            }
            else {
                fetch(process.env.REACT_APP_BACKEND_API_URL+'/list/create', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json, text/plain, */*',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ "list": name, "userid": props.userId })

                }).then(res => res.json())
                    .then(res => {
                        console.log("res: " + res);
                        if (res === true) {
                            props.newlist(name);
                        }
                        if (res.error) {
                            setErrormsg(res.error);
                        }
                    })
                    .catch(err => console.error(err));
            }
        }
    }
    return (
        <div>
            <div className="w-full max-w-4xl m-auto mt-3 ">
                < h1 className="text-3xl  text-gray-600">{props.text}</h1>
            </div>
            <div className={'w-full max-w-4xl m-auto  max-h-2xl bg-gray-100 border border-primaryBorder shadow-default shadow-lg mt-6 py-4 mb-28'} >
                {/*  */}
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-rows-4 grid-flow-col gap-4">
                        {/* left col */}
                        <label className="ml-3 text-xl text-black font-semibold">List name</label>
                        <input value={nameValue} onChange={(e) => setNameValue(e.target.value)} className="ml-6 mr-6 py-3 border border-gray-400 text-base px-4" ref={nameInput} type="text" required="required"></input>
                        <p className=" ml-6 mt-2 text-red-500">{errormsg} </p>
                        <button className=" ml-6 w-1/2 border rounded-md border-green-500 bg-acceptbutton hover:bg-hoveracceptbutton" type="submit">
                            <h2 className='text-center text-xl text-white font-semibold'>
                                {props.buttonText}
                            </h2>
                        </button>
                        
                    </div>
                </form>
                
            </div>

        </div>
    );

}

export default CreteList;