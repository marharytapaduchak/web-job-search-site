import SearchInput from './SearchInput';
import DropdownSelect from '../DropdownSelect';
import PrimaryButton from '../PrimaryButton';
import './SearchSection.css';

const SearchSection = ({ 
  searchQuery, 
  onSearchChange, 
  specialization, 
  onSpecializationChange, 
  onSearchSubmit 
}) => {

  const specializationOptions = [
    { value: 'ui-ux', label: 'UI / UX Designer' },
    { value: 'motion', label: 'Моушн дизайнер' },
    { value: 'brand', label: 'Бренд-дизайнер' },
    { value: 'illustrator', label: 'Ілюстратор' },
    { value: 'infographics', label: 'Дизайнер інфографіки' }
  ];

  return (
    <section className="search-section-hero">
      <div className="search-section-container">
        
        <h1 className="search-title">Шукати вакансії</h1>
        
        <div className="search-controls-row">
          <div className="search-wrapper">
            <SearchInput 
              value={searchQuery} 
              onChange={(e) => onSearchChange(e.target.value)} 
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
