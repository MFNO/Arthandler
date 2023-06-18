import { useEffect, useState } from 'react';
import './Navigation.css'
import axios from 'axios';
import { Project } from '../../types/Project';

function Navigation() {

  const [menuItems, setMenuItems] = useState<Array<Project>>([]);
  const [showMenu, setShowMenu] = useState<boolean>(false);

  const hideShowMenu = () => { console.log(showMenu); setShowMenu(!showMenu) }

  useEffect(() => {
    axios.get(import.meta.env.VITE_APP_API_URL + "/projects")
      .then(response => {
        setMenuItems(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  return (

    <nav className="w-full bg-white border-gray-200 dark:bg-gray-900">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <h2 className='text-white md:hidden'>De Guzman</h2>
        <button data-collapse-toggle="navbar-default" type="button" className="inline-flex items-center p-2 ml-3 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-default" aria-expanded="false">
          <span className="sr-only">Open main menu</span>
          <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"></path></svg>
        </button>
        <div className="text-white w-full hidden justify-around md:flex" id="navbar-default">
          <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
            {menuItems.map((menuItem, index) =>
              <li>
                <a key={index} className="color-white">
                  {menuItem.ProjectName}
                </a>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>



  )
}

export default Navigation
