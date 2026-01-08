import { NavLink } from 'react-router-dom';

const MainNavigation = () => {
  return (
    <nav className="flex items-center justify-between p-4 bg-white shadow-sm">
      <div className="flex items-center space-x-8">
        <NavLink 
          to="/" 
          className="text-2xl font-bold text-blue-600"
        >
          PixelCraft
        </NavLink>
        
        <div className="hidden md:flex space-x-6">
          <NavLink 
            to="/" 
            className={({ isActive }) => 
              `px-3 py-2 rounded-md text-sm font-medium ${
                isActive ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
              }`
            }
          >
            Home
          </NavLink>
          <NavLink 
            to="/tools" 
            className={({ isActive }) => 
              `px-3 py-2 rounded-md text-sm font-medium ${
                isActive ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
              }`
            }
          >
            All Tools
          </NavLink>
          <NavLink 
            to="/tools/pdf" 
            className={({ isActive }) => 
              `px-3 py-2 rounded-md text-sm font-medium ${
                isActive ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
              }`
            }
          >
            PDF Tools
          </NavLink>
          <NavLink 
            to="/image-tools" 
            className={({ isActive }) => 
              `px-3 py-2 rounded-md text-sm font-medium ${
                isActive ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
              }`
            }
          >
            Image Tools
          </NavLink>
          <NavLink 
            to="/business" 
            className={({ isActive }) => 
              `px-3 py-2 rounded-md text-sm font-medium ${
                isActive ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
              }`
            }
          >
            Business
          </NavLink>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <NavLink 
          to="/auth/login" 
          className="px-4 py-2 text-gray-700 hover:text-blue-600 transition-colors"
        >
          Login
        </NavLink>
        <NavLink 
          to="/auth/signup" 
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Sign Up
        </NavLink>
      </div>
    </nav>
  );
};

export default MainNavigation;