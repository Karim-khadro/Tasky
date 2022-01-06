import { useState, useEffect } from 'react';
import Content from '../componants/Content';
import { postRequest, getRequest } from "../utile";

const Home = (props) => {
  const [activeList, setActiveList] = useState();
  return (
    <div className="h-screen grid grid-cols-custom-sidenav-layout">
      <Sidenav activeList={activeList} setActiveList={setActiveList} username={props.username} token={props.token} />
      <Content activeList={activeList} setActiveList={setActiveList} username={props.username} token={props.token} />
    </div>
  );
}

const Sidenav = ({ activeList, setActiveList, username, token }) => {
  return (
    <div className=' bg-menu text-green-50 px-4 py-6 w-full max-w-6xl'>
      <SidenavHeader />
      <SidenavMenu activeList={activeList} setActiveList={setActiveList} username={username} token={token} />
    </div>
  )
}

const SidenavHeader = () => (
  <div className=' text-green-50 px-2'>
    <a href='#home' className='hover:text-green-100 font-bold text-center text-4xl font-serif py-4'>TASKY</a>
  </div>
)

const SidenavMenu = ({ activeList, setActiveList, username, token }) => {
  const handelCreateList = (e) => {
    setActiveList("#new");
  }
  return (
    //  Get existing lists from server
    <div>
      <GetLists activeList={activeList} setActiveList={setActiveList} username={username} token={token} />
      <button className='mt-8 text-right text-2xl  hover:text-gray-400' onClick={handelCreateList}>
        Create New List</button>
    </div>
  );
}

// Get lists name dynamiclly from the server 
const GetLists = ({ activeList, setActiveList, username, token }) => {
  const [lists, setLists] = useState([]);

  useEffect(() => {
    fetchLists();
  }, [activeList]);


  const fetchLists = async () => {
    var resultGet = await getRequest('/list/load', token)
    setLists(resultGet.lists);
  };

  if (lists) {
    return (
      <div>
        <h1 className=' text-xl font-mono mt-6 mb-1'> Lists</h1>
        <ul className=' list-none ml-2'>
          {lists.map((list) => {
            return (
              <li className={`flex items-center no-underline text-green-50 hover:text-green-100 p-3 rounded-md ${activeList === list.name ? 'bg-green-700' : ''}`}>
                <button onClick={() => setActiveList(list.name)} >
                  {list.name}
                </button>
              </li>
            );
          })
          }
        </ul>
      </div>
    );
  }
  else {
    return (
      <div>
        <h1 className=' text-xl font-mono mt-6 mb-1'> Lists</h1>

      </div>
    );
  }

};



export default Home;