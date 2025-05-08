import PropTypes from "prop-types";

/**
 * Section header component used consistently across panels
 */
const SectionHeader = ({ title, icon, className = "", children }) => {
  return (
    <div
      className={`flex items-center justify-between border-b pb-3 border-blue-100 ${className}`}
    >
      <div className="flex items-center gap-2">
        {icon && (
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-1.5 rounded-lg shadow-md">
            {icon}
          </div>
        )}
        <h2 className="text-lg md:text-xl font-bold text-slate-800">{title}</h2>
      </div>
      {children}
    </div>
  );
};

SectionHeader.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.node,
  className: PropTypes.string,
  children: PropTypes.node,
};

export default SectionHeader;
