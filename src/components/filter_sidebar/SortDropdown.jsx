import DropdownSelect from '../DropdownSelect';
import './SortDropdown.css';

const SortDropdown = ({ sortValue, onSortChange }) => {
  const sortOptions = [
    { value: 'relevant', label: 'За релевантністю' },
    { value: 'date-newest', label: 'За датою (найновіші)' },
    { value: 'salary-high', label: 'За зарплатою (висока > низька)' },
    { value: 'salary-low', label: 'За зарплатою (низька > висока)' },
  ];

  return (
    <div className="sort-section">
      <h3 className="sort-title">Сортувати за</h3>
      
      <DropdownSelect 
        options={sortOptions}
        value={sortValue}
        onChange={onSortChange}
        placeholder="Вибрати"
      />
    </div>
  );
};

export default SortDropdown;
