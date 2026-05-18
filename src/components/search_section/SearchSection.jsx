import SearchInput from './SearchInput';
import DropdownSelect from '../DropdownSelect';
import PrimaryButton from '../PrimaryButton';
import './SearchSection.css';

const specializationOptions = [
  { value: 'ui / ux', label: 'UI / UX Designer' },
  { value: 'моушн', label: 'Моушн дизайнер' },
  { value: 'бренд', label: 'Бренд-дизайнер' },
  { value: 'ілюстратор', label: 'Ілюстратор' },
  { value: 'інфографік', label: 'Дизайнер інфографіки' }
];

const SearchSection = ({ 
  searchQuery, 
  onSearchChange, 
  specialization, 
  onSpecializationChange, 
  onSearchSubmit 
}) => {

  return (
    <section className="search-section-hero">
      <div className="search-section-container">
        
        <h1 className="search-title">Шукати вакансії</h1>
        
        <div className="search-controls-row">
          <div className="search-wrapper">
            <SearchInput 
              value={searchQuery} 
              onChange={(e) => onSearchChange(e.target.value)} 
              onKeyDown={(e) => {
                if (e.key === 'Enter' && onSearchSubmit) {
                  onSearchSubmit();
                }
              }}
              placeholder="Пошук" 
            />
          </div>
          
          <div className="dropdown-wrapper">
            <DropdownSelect 
              options={specializationOptions}
              value={specialization}
              onChange={onSpecializationChange}
              placeholder="Спеціалізація"
            />
          </div>
          
          <PrimaryButton onClick={onSearchSubmit}>
            Пошук
          </PrimaryButton>
        </div>

      </div>
    </section>
  );
};

export default SearchSection;
