import { useRef, useEffect, useState } from "react";
import { format } from 'date-fns';
const CreateTask = (props) => {
    const nameInput = useRef();
    const dateInput = useRef();
    const [nameValue, setNameValue] = useState("");
    const [dateValue, setDateValue] = useState("");
    useEffect(() => {
        if (props.edit) {
            console.log(format(new Date(props.date), 'yyyy-MM-dd'));
            setNameValue(props.name);
            setDateValue(format(new Date(props.date), 'yyyy-MM-dd'));
        }
    }, [props.edit, props.name, props.date]);

    const handleSubmit = (e) => {
        const name = nameInput.current.value;
        const date = dateInput.current.value;
        e.preventDefault();

        // edit task => edit name or date of a task
        if (props.edit) {
            console.log("date: " + date);
            fetch(process.env.REACT_APP_BACKEND_API_URL + '/task/edit', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ "taskid": props.taskid, "list": props.listname, "date": date, "name": props.name, "status": "edit", "newname": name, "userid": props.userId })
            }).then(res => res.json())
                .then(res => {
                    console.log(res);
                    if (res === true) {
                        props.taskAdded(true);
                        setNameValue("");
                        setDateValue("");
                    }
                })
                .catch(err => console.error(err));
        }
        // Create new task
        else {
            fetch(process.env.REACT_APP_BACKEND_API_URL + '/task/create', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ "list": props.listname, "name": name, "date": date, "userid": props.userId })
            }).then(res => res.json())
                .then(res => {
                    console.log(res);
                    if (res.added === true) {
                        props.taskAdded(true);
                    }
                    setNameValue("");
                    setDateValue("");
                })
                .catch(err => console.error(err));
        }
    }
    return (
        <div id="newtask" name="newtask">
            <div className="w-full max-w-4xl m-auto mt-3 ">
                < h1 className="text-3xl  text-gray-600">{props.text}</h1>
            </div>
            <div className={'w-full max-w-4xl m-auto  max-h-2xl bg-gray-100   \
                border border-primaryBorder shadow-default shadow-lg mt-6 py-4 mb-28'} >
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-rows-3 grid-flow-col gap-4">
                        {/* left col */}
                        <label className="ml-3 text-xl text-black font-semibold">Task name</label>
                        <input value={nameValue} onChange={(e) => setNameValue(e.target.value)} className="ml-3 py-3 border border-gray-400 text-base px-4" ref={nameInput} type="text" required="required"></input>
                        <button className=" ml-3 w-1/2 border rounded-md border-green-500 bg-acceptbutton hover:bg-hoveracceptbutton" type="submit">
                            <h2 className='text-center text-xl text-white font-semibold'>
                                {props.buttonText}
                            </h2>
                        </button>

                        {/* Right col */}
                        <label className="ml-3 text-xl text-black font-semibold">Due date</label>
                        <input value={dateValue} onChange={(e) => setDateValue(e.target.value)} className="ml-3 py-3 border border-gray-400 mr-3 px-4" ref={dateInput} type="date" required="required"></input>
                    </div>
                </form>
            </div>
        </div>
    );

}

export default CreateTask;