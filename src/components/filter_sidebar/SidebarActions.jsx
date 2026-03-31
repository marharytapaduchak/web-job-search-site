import PrimaryButton from '../PrimaryButton';
import './SidebarActions.css';

const SidebarActions = ({ onReset, onApply }) => {
  return (
    <div className="sidebar-actions">
      <button 
        className="reset-button" 
        onClick={onReset}
        type="button"
      >
        Скинути
      </button>

      <PrimaryButton onClick={onApply}>
        Застосувати
      </PrimaryButton>
    </div>
  );
};

export default SidebarActions;
