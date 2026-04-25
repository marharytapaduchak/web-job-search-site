import { useState, useRef, useEffect } from 'react';
import './DropdownSelect.css';

const DropdownSelect = ({
  options = [],
  value,
  onChange,
  placeholder = "Вибрати"
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [direction, setDirection] = useState('down');
  const dropdownRef = useRef(null);

  const selectedOption = options.find(opt => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    if (!isOpen && dropdownRef.current) {
      const rect = dropdownRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const spaceBelow = viewportHeight - rect.bottom;
      
      if (spaceBelow < 260) {
        setDirection('up');
      } else {
        setDirection('down');
      }
    }
    setIsOpen(!isOpen);
  };

  const handleSelect = (optionValue) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div className="dropdown-container" ref={dropdownRef}>
      <div
        className={`dropdown-trigger ${!selectedOption ? 'placeholder' : ''}`}
        onClick={toggleDropdown}
      >
        <span>{selectedOption ? selectedOption.label : placeholder}</span>

        <svg
          className={`dropdown-icon ${isOpen ? 'open' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>

      {isOpen && (
        <ul className={`dropdown-menu ${direction}`}>
          {options.map((option) => (
            <li
              key={option.value}
              className={`dropdown-item ${value === option.value ? 'selected' : ''}`}
              onClick={() => handleSelect(option.value)}
            >
              {option.label}
            </li>
          ))}
          {options.length === 0 && (
            <li className="dropdown-item" style={{ color: '#9ca3af', cursor: 'default' }}>
              Немає опцій
            </li>
          )}
        </ul>
      )}
    </div>
  );
};

export default DropdownSelect;
