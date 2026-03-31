import './FilterGroup.css';

const FilterGroup = ({ title, children }) => {
  return (
    <div className="filter-group">
      <h3 className="filter-group-title">{title}</h3>

      <div className="filter-group-content">
        {children}
      </div>
    </div>
  );
};

export default FilterGroup;
