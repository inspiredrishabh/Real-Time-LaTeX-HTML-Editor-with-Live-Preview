import { NavLink } from "react-router-dom";
import PropTypes from "prop-types";

// App header with navigation tabs
const Header = ({ title }) => {
  return (
    <header className="backdrop-blur-md bg-gradient-to-r from-white/90 via-blue-50/80 to-indigo-50/90 shadow-xl border-b border-blue-200 px-3 sm:px-5 py-3 sm:py-4 flex items-center justify-between sticky top-0 z-20 transition-all duration-300">
      <div className="relative">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight drop-shadow-sm">
          <span className="bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-700 bg-clip-text text-transparent">
            {title}
          </span>
        </h1>
      </div>

      <Navigation />
    </header>
  );
};

// Tab navigation for app routes
const Navigation = () => {
  return (
    <nav className="flex space-x-1 sm:space-x-2">
      <NavLink
        to="/"
        className={({ isActive }) =>
          `px-2 sm:px-4 py-1 sm:py-2 rounded-lg transition-all text-sm sm:text-base ${
            isActive
              ? "bg-indigo-600 text-white shadow-md"
              : "hover:bg-indigo-100 text-indigo-700"
          }`
        }
      >
        LaTeX Editor
      </NavLink>
      <NavLink
        to="/html"
        className={({ isActive }) =>
          `px-2 sm:px-4 py-1 sm:py-2 rounded-lg transition-all text-sm sm:text-base ${
            isActive
              ? "bg-indigo-600 text-white shadow-md"
              : "hover:bg-indigo-100 text-indigo-700"
          }`
        }
      >
        HTML View
      </NavLink>
    </nav>
  );
};

Header.propTypes = {
  title: PropTypes.string.isRequired,
};

export default Header;
