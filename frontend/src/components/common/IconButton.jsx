import PropTypes from "prop-types";

/**
 * Reusable icon button with hover effects
 */
const IconButton = ({ onClick, title, className = "", children }) => {
  return (
    <button
      onClick={onClick}
      className={`p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors ${className}`}
      title={title}
    >
      {children}
    </button>
  );
};

IconButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  title: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};

export default IconButton;
