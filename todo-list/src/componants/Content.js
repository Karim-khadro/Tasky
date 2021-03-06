import Task from './Task';
import CreateTask from './CreateTask';
import CreteList from './CreteList'
import { useState, useEffect } from 'react';
import { postRequest, getRequest } from "../utile";


const Content = ({ activeList, setActiveList, username, token }) => {
    const [items, setItems] = useState([]);
    const [taskAdded, setTaskAdded] = useState();
    const [taskAModified, setTaskAModified] = useState(false);
    const [editTask, setEditTask] = useState([]);
  
    // console.log("activeList: " + res);
    useEffect(() => {
      if (taskAModified || activeList || taskAdded || editTask[0]) {
        setTaskAModified(false);
        setTaskAdded(false);
        setEditTask([false]);
        fetchItems();
      }
    }, [taskAdded, activeList, taskAModified]);
  
    // Get tasks of a list
    const fetchItems = async () => {
      var resultGet = await getRequest('/list/tasks?list=' + encodeURIComponent(activeList), token)
      setItems(resultGet.items);
    };
  
  
    const handelEditList = () => {
      setActiveList("#edit-" + activeList);
    }
  
    // Send request to server and re-render
    const handelDeleteList = async () => {
      var resultpost = await postRequest('/list/delete', token, JSON.stringify({ "list": activeList, "token": token }))
      if (resultpost === true) {
        setActiveList("");
        setTaskAModified(true);
      }
    }
  
    const Buttons = () => (
      <div className="w-full max-w-4xl m-auto mt-3 ">
        <div className="flow-root ">
          <h1 className="float-left  text-3xl text-gray-600 ">TASKS</h1>
          <button className="hover:bg-hoverdeletebutton float-right ml-3 w-1/5 py-2 border rounded-md border-red-500 bg-deletebutton" onClick={handelDeleteList}>
            <h2 className='text-center text-xl text-white font-semibold'>
              DELETE LIST
            </h2>
          </button>
          <button className=" hover:bg-hoveracceptbutton float-right ml-3 w-1/4 py-2 border rounded-md border-green-500 bg-acceptbutton" onClick={handelEditList}>
            <h2 className='text-center text-xl text-white font-semibold'>
              EDIT LIST NAME
            </h2>
          </button>
        </div>
        <hr className='mt-4 ' />
      </div>
    );
  
    var doneTasks = [];
    var lateTasks = [];
    var progTasks = [];
  
    const ProgressTasksList = () => (
      <div>
        <div className="w-full max-w-4xl m-auto mt-3 ">
          <div className="flow-root ">
            <h2 className="mt-2 float-left text-2xl text-gray-600 " >ACTIVE</h2>
          </div>
        </div>
        {
          progTasks.map((progitem) => {
            return (
              <div>
                <Task token={token} id={progitem.id} name={progitem.name} date={progitem.date} status={progitem.status} listname={activeList}
                  taskAModified={taskAModified => setTaskAModified(taskAModified)} editTask={editTask => setEditTask(editTask)} />
              </div>
            );
  
          })
        }
      </div>
    );
  
    const DoneTasksList = () => (
      <div>
        <div className="w-full max-w-4xl m-auto mt-3 ">
          <div className="flow-root ">
            <h2 className="mt-2 float-left text-2xl text-gray-600 " >COMPLETED</h2>
          </div>
        </div>
        {
          doneTasks.map((doneitem) => {
            return (
              <div>
                <Task token={token} id={doneitem.id} name={doneitem.name} date={doneitem.date} status={doneitem.status} listname={activeList}
                  taskAModified={taskAModified => setTaskAModified(taskAModified)} editTask={editTask => setEditTask(editTask)} />
              </div>
            );
  
          })
        }
      </div>
    )
  
    const UncompleteTasksList = () => (
      <div>
        <div className="w-full max-w-4xl m-auto mt-3 ">
          <div className="flow-root ">
            <h2 className="mt-2 float-left text-2xl text-gray-600 " >UNCOMPLETED</h2>
          </div>
        </div>
        {
          lateTasks.map((lateitem) => {
            return (
              <div>
                <Task token={token} id={lateitem.id} name={lateitem.name} date={lateitem.date} status={lateitem.status} listname={activeList}
                  taskAModified={taskAModified => setTaskAModified(taskAModified)} editTask={editTask => setEditTask(editTask)} />
              </div>
            );
          })
        }
  
      </div>
  
    )
  
    const TasksOfList = () => {
      if (progTasks.length > 0) {
        if (doneTasks.length > 0) {
          if (lateTasks.length > 0) {
            return (
              <div className='mb-16'>
                <ProgressTasksList />
                <DoneTasksList />
                <UncompleteTasksList />
              </div>
            );
          }
          else {
            return (
              <div className='mb-16'>
                <ProgressTasksList />
                <DoneTasksList />
              </div>
            );
          }
        }
        else {
          if (lateTasks.length > 0) {
            return (
              <div className='mb-16'>
                <ProgressTasksList />
                <UncompleteTasksList />
              </div>
            );
          }
          else {
            return (
              <div className='mb-16'>
                <ProgressTasksList />
              </div>
            );
          }
  
        }
      }
      else {
        if (doneTasks.length > 0) {
          if (lateTasks.length > 0) {
            return (
              <div className='mb-16'>
                <DoneTasksList />
                <UncompleteTasksList />
              </div>
            );
          }
          else {
            return (
              <div className='mb-16'>
                <DoneTasksList />
              </div>
            );
          }
        }
        else {
          if (lateTasks.length > 0) {
            return (
              <div className='mb-16'>
                <UncompleteTasksList />
              </div>
            );
          }
          else {
            return (
              <div className='mb-16'>
              </div>
            );
          }
        }
      }
    }
  
    const handelLogOut= () =>{
      sessionStorage.removeItem('refreshToken');
      sessionStorage.removeItem('isAuth');
      // refresh after removing refresh token
      window.location.reload();
    }
  
    const Header = () => {
      return (
        <div className="w-full relative   ">
          <div className=" absolute left-0  text-xl font-bold text-gray-600  pt-6 pb-2 px-6">List {activeList} </div>
          <div className=" absolute right-0 pt-6 pb-2 ">
            <button className="hover:bg-red-500  bg-red-400  px-8 py-2 mr-12 rounded-lg text-white text-lg" onClick={handelLogOut}>Log out</button>
          </div>
          <div className="relative top-20 border-b-2 border-green-200 "></div>
        </div>
      )
  
    }
  
    if (activeList) {
      // Create new list
      if (activeList === "#new") {
        console.log("New list");
        return (
          <div className="flex flex-col">
            <div className="text-xl font-bold text-gray-600 border-b-2 border-green-200 pt-6 pb-2 px-6">New list </div>
            {/*Body div */}
            <CreteList token={token} text="CREATE NEW LIST" buttonText="CREATE LIST" newlist={activeList => setActiveList(activeList)} token={token} />
  
          </div>
        );
      }
      // Edit list name
      else if (activeList.split('-')[0] === "#edit") {
        console.log("Edit list");
        return (
          <div className="flex flex-col">
            <div className="text-xl font-bold text-gray-600 border-b-2 border-green-200 pt-6 pb-2 px-6">New list </div>
            {/*Body div */}
            {/* taskAdded is used to refresh without creating new var :p */}
            <CreteList token={token} list={activeList.split("-")[1]} text={"EDIT LIST " + activeList.split("-")[1]} buttonText="EDIT LIST" newlist={activeList => setActiveList(activeList)} token={token} />
          </div>
        );
      }
      // An empty list is selected
      else {
        if (items && items.length > 0) {
          // Edit a task of a list
          if (editTask[0]) {
            console.log("Edit task");
            return (
              <div className="flex flex-col">
                <Header />
                {/*Body div */}
                <div >
                  <CreateTask token={token} taskid={editTask[3]} edit={true} name={editTask[1]} date={editTask[2]} listname={activeList} taskAdded={taskAdded => setTaskAdded(taskAdded)} text="EDIT TASK" buttonText="EDIT TASK" token={token} />
                  {/* Edit/Delete list buttons */}
                  <Buttons />
                  {items.map((item) => {
                    if (item.status === "progress")
                      progTasks.push(item);
                    else if (item.status === "done")
                      doneTasks.push(item);
                    else if (item.status === "late")
                      lateTasks.push(item);
                  })}
                  <TasksOfList />
                </div>
              </div>
            );
          }
          // display all the task of a list
          else {
            console.log("Tasks in a list");
            return (
              <div className="flex flex-col">
                <Header />
                {/*Body div */}
                <div >
                  <CreateTask token={token} listname={activeList} taskAdded={taskAdded => setTaskAdded(taskAdded)} text="CREATE NEW TASK" buttonText="CREATE TASK" token={token} />
                  {/* Edit/Delete list buttons */}
                  <Buttons />
                  {items.map((item) => {
                    if (item.status === "progress")
                      progTasks.push(item);
                    else if (item.status === "done")
                      doneTasks.push(item);
                    else if (item.status === "late")
                      lateTasks.push(item);
                  })}
                  <TasksOfList />
                </div>
  
              </div>
            );
          }
        }
        else {
          console.log("An empty list is selected");
          return (
            <div className="flex flex-col">
              <Header />
              {/*Body div */}
              <CreateTask token={token} listname={activeList} taskAdded={taskAdded => setTaskAdded(taskAdded)} text="CREATE NEW TASK" buttonText="CREATE TASK" token={token} />
              {/* Edit/Delete list buttons */}
              <Buttons />
  
            </div>
          );
        }
      }
    }
    // No active list
    else {
      console.log("No active list");
      return (
        <div className="flex flex-col">
  
          <Header />
          {/*Body div */}
  
        </div>
      )
    }
  
  };
  

  export default Content;