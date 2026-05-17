import { useState, useCallback, memo } from 'react';
import { 
    QUAL_OPTIONS, 
    ENGLISH_OPTIONS, 
    EMPLOYMENT_TYPES, 
    WORK_FORMATS, 
    INITIAL_FILTER_STATE 
} from './filterConstants';

import SortDropdown from './SortDropdown';
import FilterGroup from './FilterGroup';
import Checkbox from './Checkbox';
import DropdownSelect from '../DropdownSelect';
import SearchInput from '../search_section/SearchInput'; 
import SidebarActions from './SidebarActions';
import SidebarLayout from '../SidebarLayout';
import './FilterSidebar.css';

const MIN_SALARY = 1000;
const MAX_SALARY = 100000;
const SLIDER_STEPS = 1000;

const sliderToSalary = (val) => {
    const n = Number(val);
    if (n === 0) return 0;
    
    const salary = MIN_SALARY * Math.pow(MAX_SALARY / MIN_SALARY, (n - 1) / (SLIDER_STEPS - 1));
    return Math.round(salary / 100) * 100;
};

const salaryToSlider = (salary) => {
    const s = Number(salary);
    if (s <= 0) return 0;
    if (s <= MIN_SALARY) return 1;
    
    const val = 1 + (SLIDER_STEPS - 1) * Math.log(s / MIN_SALARY) / Math.log(MAX_SALARY / MIN_SALARY);
    return Math.round(val);
};

const FilterSidebar = memo(({ onApplyFilters }) => {
    const [filters, setFilters] = useState(INITIAL_FILTER_STATE);

    const updateFilter = useCallback((field, value) => {
        setFilters(prev => ({ ...prev, [field]: value }));
    }, []);

    const updateNestedFilter = useCallback((group, field, value) => {
        setFilters(prev => ({
            ...prev,
            [group]: {
                ...prev[group],
                [field]: value
            }
        }));
    }, []);

    const handleReset = useCallback(() => {
        setFilters(INITIAL_FILTER_STATE);
    }, []);

    const handleApply = useCallback(() => {
        onApplyFilters(filters);
    }, [onApplyFilters, filters]);

    return (
        <SidebarLayout
            topSlot={<SortDropdown sortValue={filters.sortBy} onSortChange={(v) => updateFilter('sortBy', v)} />}
            title="Фільтри"
            bottomSlot={<SidebarActions onReset={handleReset} onApply={handleApply} />}
        >
            <FilterGroup title="Тип зайнятості">
                {EMPLOYMENT_TYPES.map(({ id, label }) => (
                    <Checkbox 
                        key={id} 
                        label={label} 
                        checked={filters.employmentType[id]} 
                        onChange={(v) => updateNestedFilter('employmentType', id, v)} 
                    />
                ))}
            </FilterGroup>

            <FilterGroup title="Формат роботи">
                {WORK_FORMATS.map(({ id, label }) => (
                    <Checkbox 
                        key={id} 
                        label={label} 
                        checked={filters.workFormat[id]} 
                        onChange={(v) => updateNestedFilter('workFormat', id, v)} 
                    />
                ))}
            </FilterGroup>

            <FilterGroup title="Рівень кваліфікації">
                <DropdownSelect 
                    options={QUAL_OPTIONS} 
                    value={filters.qualification} 
                    onChange={(v) => updateFilter('qualification', v)} 
                />
            </FilterGroup>

            <FilterGroup title="Країна, місто">
                <SearchInput 
                    value={filters.location} 
                    onChange={(e) => updateFilter('location', e.target.value)} 
                    placeholder="Вибрати" 
                />
            </FilterGroup>

            <FilterGroup title="Зарплатні очікування">
                <input 
                    type="range" 
                    min="0" max={SLIDER_STEPS} step="1"
                    className="salary-slider" 
                    value={salaryToSlider(filters.salary)} 
                    onChange={(e) => updateFilter('salary', sliderToSalary(e.target.value))} 
                />
                <div className="salary-label">від {filters.salary.toLocaleString()}₴</div>
            </FilterGroup>

            <FilterGroup title="Рівень англійської">
                <DropdownSelect 
                    options={ENGLISH_OPTIONS} 
                    value={filters.englishLevel} 
                    onChange={(v) => updateFilter('englishLevel', v)} 
                />
            </FilterGroup>
        </SidebarLayout>
    );
});

export default FilterSidebar;
