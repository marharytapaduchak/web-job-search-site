import { memo } from 'react';
import './Checkbox.css';

const Checkbox = memo(({ label, checked, onChange }) => {
    return (
        <label className="checkbox-label">
            <input 
                type="checkbox" 
                className="checkbox-input" 
                checked={checked} 
                onChange={(e) => onChange(e.target.checked)} 
            />
            {label}
        </label>
    );
});

export default Checkbox;
