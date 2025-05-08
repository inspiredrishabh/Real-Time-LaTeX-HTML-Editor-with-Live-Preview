import PropTypes from "prop-types";

// Reusable panel container with consistent styling
const PanelContainer = ({ className = "", children }) => {
  return (
    <div
      className={`h-full flex flex-col bg-white/95 p-3 md:p-6 rounded-xl shadow-lg border border-blue-100 ${className}`}
    >
      {children}
    </div>
  );
};

PanelContainer.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};

export default PanelContainer;
