
import React, { useState } from 'react';
import SortDropdown from './SortDropdown';
import FilterGroup from './FilterGroup';
import Checkbox from './Checkbox';
import DropdownSelect from '../DropdownSelect';
import SearchInput from '../search_section/SearchInput'; 
import SidebarActions from './SidebarActions';
import './FilterSidebar.css';

const FilterSidebar = ({ onApplyFilters }) => {
  
  const [sortBy, setSortBy] = useState('');
  
  
  const [employmentType, setEmploymentType] = useState({
    fullTime: false,
    partTime: false,
    project: false,
    internship: false,
  });

  const [workFormat, setWorkFormat] = useState({
    remote: false,
    hybrid: false,
    office: false,
  });

  const [qualification, setQualification] = useState('');
  const [location, setLocation] = useState('');
  const [salary, setSalary] = useState(0); 
  const [englishLevel, setEnglishLevel] = useState('');

  
  const handleCheckboxChange = (group, field, value) => {
    if (group === 'employmentType') {
      setEmploymentType(prev => ({ ...prev, [field]: value }));
    } else if (group === 'workFormat') {
      setWorkFormat(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleReset = () => {
    setSortBy('');
    setEmploymentType({ fullTime: false, partTime: false, project: false, internship: false });
    setWorkFormat({ remote: false, hybrid: false, office: false });
    setQualification('');
    setLocation('');
    setSalary(0);
    setEnglishLevel('');
  };

  const handleApply = () => {
    
    onApplyFilters({
      sortBy,
      employmentType,
      workFormat,
      qualification,
      location,
      salary,
      englishLevel
    });
  };

  
  const qualOptions = [
    { value: 'junior', label: 'Junior' },
    { value: 'middle', label: 'Middle' },
    { value: 'senior', label: 'Senior' }
  ];

  const englishOptions = [
    { value: 'beginner', label: 'Beginner' },
    { value: 'pre-intermediate', label: 'Pre-intermediate' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'upper-Intermediate', label: 'Upper-Intermediate' },
    { value: 'advanced', label: 'Advanced' },
    { value: 'proficient', label: 'Proficient' }
  ];

  return (
    <aside className="filter-sidebar">
      
      {}
      <SortDropdown sortValue={sortBy} onSortChange={setSortBy} />

      {}
      <h2 className="filters-main-title">Фільтри</h2>

      {}
      <div className="filters-scroll-container">
        
        <FilterGroup title="Тип зайнятості">
          <Checkbox label="Повна зайнятість" checked={employmentType.fullTime} onChange={(v) => handleCheckboxChange('employmentType', 'fullTime', v)} />
          <Checkbox label="Часткова зайнятість" checked={employmentType.partTime} onChange={(v) => handleCheckboxChange('employmentType', 'partTime', v)} />
          <Checkbox label="Проєктна робота" checked={employmentType.project} onChange={(v) => handleCheckboxChange('employmentType', 'project', v)} />
          <Checkbox label="Стажування" checked={employmentType.internship} onChange={(v) => handleCheckboxChange('employmentType', 'internship', v)} />
        </FilterGroup>

        <FilterGroup title="Формат роботи">
          <Checkbox label="Віддалена" checked={workFormat.remote} onChange={(v) => handleCheckboxChange('workFormat', 'remote', v)} />
          <Checkbox label="Віддалена/офіс" checked={workFormat.hybrid} onChange={(v) => handleCheckboxChange('workFormat', 'hybrid', v)} />
          <Checkbox label="Офіс" checked={workFormat.office} onChange={(v) => handleCheckboxChange('workFormat', 'office', v)} />
        </FilterGroup>

        <FilterGroup title="Рівень кваліфікації">
          <DropdownSelect options={qualOptions} value={qualification} onChange={setQualification} />
        </FilterGroup>

        <FilterGroup title="Країна, місто">
          {}
          <SearchInput value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Вибрати" />
        </FilterGroup>

        <FilterGroup title="Зарплатні очікування">
          {}
          <input 
            type="range" 
            min="0" max="1000000" step="1000"
            className="salary-slider" 
            value={salary} 
            onChange={(e) => setSalary(e.target.value)} 
          />
          <div className="salary-label">від {salary}₴</div>
        </FilterGroup>

        <FilterGroup title="Рівень англійської">
          <DropdownSelect options={englishOptions} value={englishLevel} onChange={setEnglishLevel} />
        </FilterGroup>

      </div>

      {}
      <SidebarActions onReset={handleReset} onApply={handleApply} />

    </aside>
  );
};

export default FilterSidebar;
