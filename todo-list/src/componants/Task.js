import { useState, useEffect } from "react";
import { postRequest, getRequest } from "../utile";
const Task = (props) => {
  const [taskId, setTaskId] = useState("");
  useEffect(() => {
    setTaskId(props.id);
  }, [taskId]);

  // Select the color that matchs the status
  switch (props.status) {
    case "done":
      return <Item id={props.id} borderColor={"border-green-400"} props={props} taskStatus={"Completed"} doneStroke={"#0f0"} incompleteStroke={"#000"} />
    case "progress":
      var date = new Date(props.date);
      // const dateLimit = moment(item.limit, 'YYYY-MM-DDTHH:mm:ss.SSSZ');
      const now = new Date();
      if (now > date)
        return <Item id={props.id} borderColor={"border-yellow-400"} props={props} taskStatus={"Progress"} status={"Completed"} doneStroke={"#000"} incompleteStroke={"#000"} datecolor={"text-red-700"} />
      return <Item id={props.id} borderColor={"border-yellow-400"} props={props} taskStatus={"Progress"} status={"Completed"} doneStroke={"#000"} incompleteStroke={"#000"} />

    case "late":
      return <Item id={props.id} borderColor={"border-red-400"} props={props} taskStatus={"Late"} status={"Completed"} doneStroke={"#000"} incompleteStroke={"#f00"} />

    default:
      return <Item id={props.id} borderColor={"border-yellow-400"} props={props} taskStatus={"Progress"} status={"Completed"} doneStroke={"#000"} incompleteStroke={"#000"} />

  }

};

async function handelStatusChange(props, action, id) {
  var newStatus = "";

  // work on Task is active again
  if (action === props.status) {
    newStatus = "progress";
  }
  else
    newStatus = action;

  var res = await postRequest('/task/edit', props.token, JSON.stringify({ "taskid": id, "list": props.listname, "name": props.name, "date": props.date, "status": newStatus }))
  if (res === true) {
    props.taskAModified(true);
  }

  // fetch(process.env.REACT_APP_BACKEND_API_URL + '/task/edit', {
  //   method: 'POST',
  //   headers: {
  //     'Accept': 'application/json, text/plain, */*',
  //     'Content-Type': 'application/json',
  //     "token": "token",
  //     'Authorization': "Bearer " + props.token
  //   },
  //   body: JSON.stringify({ "taskid": id, "list": props.listname, "name": props.name, "date": props.date, "status": newStatus })
  // }).then(res => res.json())
  //   .then(res => {
  //     if (res === true) {
  //       props.taskAModified(true);
  //     }

  //   })
  //   .catch(err => console.error(err));
};

function handelEdit(props, id) {
  props.editTask([true, props.name, props.date, id]);
};

const Item = ({ id, borderColor, props, taskStatus, doneStroke, incompleteStroke, datecolor }) => (
  <div className={'w-full max-w-4xl m-auto bg-gray-100 hover:bg-gray-300 rounded-lg border border-primaryBorder shadow-default shadow-lg mt-6 py-4 ' + borderColor} >
    <div className={"relative"}>
      <div className="absolute left-0  ">
        <div className='grid grid-flow-col gap-2 items-center' >
          <div className='ml-3 '>
            <button onClick={() => handelStatusChange(props, 'done', id)}>
              <svg height="8.828" viewBox="0 0 11.828 8.828" width="11.828" xmlns="http://www.w3.org/2000/svg" >
                <path d="M1.414 4.414l3 3m0 0l6-6" fill="none" stroke={doneStroke} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              </svg>
            </button>
          </div>
          <div className=''>
            <button onClick={() => handelStatusChange(props, 'late', id)}>
              <svg height="8.828" viewBox="0 0 8.828 8.828" width="11.828" xmlns="http://www.w3.org/2000/svg">
                <path d="M1.414 1.414l6 6m-6 0l6-6" fill="none" stroke={incompleteStroke} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              </svg>
            </button>
          </div>
          <div className=''>
            <a herf="#newtask">
              <button onClick={() => handelEdit(props, id)}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="11.828">
                  <path d="M497.9 142.1l-46.1 46.1c-4.7 4.7-12.3 4.7-17 0l-111-111c-4.7-4.7-4.7-12.3 0-17l46.1-46.1c18.7-18.7 49.1-18.7 67.9 0l60.1 60.1c18.8 18.7 18.8 49.1 0 67.9zM284.2 99.8L21.6 362.4.4 483.9c-2.9 16.4 11.4 30.6 27.8 27.8l121.5-21.3 262.6-262.6c4.7-4.7 4.7-12.3 0-17l-111-111c-4.8-4.7-12.4-4.7-17.1 0zM124.1 339.9c-5.5-5.5-5.5-14.3 0-19.8l154-154c5.5-5.5 14.3-5.5 19.8 0s5.5 14.3 0 19.8l-154 154c-5.5 5.5-14.3 5.5-19.8 0zM88 424h48v36.3l-64.5 11.3-31.1-31.1L51.7 376H88v48z" />
                </svg>
              </button>
            </a>
          </div>
          <div className=''>
            <button onClick={() => handelStatusChange(props, 'delete', id)} >
              <svg height="13.222" viewBox="0 0 12 13.222" width="11.828" xmlns="http://www.w3.org/2000/svg">
                <path d="M.5 2.944h11m-1.223 0V11.5a1.222 1.222 0 01-1.222 1.222H2.94A1.222 1.222 0 011.718 11.5V2.944m1.833 0V1.722A1.222 1.222 0 014.777.5h2.444A1.222 1.222 0 018.44 1.722v1.222M4.778 6v3.667M7.222 6v3.667" fill="none" stroke="#000" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
          <div className=' ml-4 font-semibold'>{props.name} </div>
        </div>
      </div>
      {/* Right side elements */}
      <div className="absolute right-0 items-center w-1/3">
        <div className=' grid grid-cols-2 gap-3'>
          <div> {taskStatus} </div>
          <div className={'mr-2 ' + datecolor}>{props.date}</div>
        </div>
      </div>
    </div>

    <br />
  </div>
)
export default Task;