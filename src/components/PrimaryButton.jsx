import './PrimaryButton.css';

const PrimaryButton = ({ children, ...props }) => {
  return (
    <button 
      className="primary-button" 
      {...props}
    >
      {children}
    </button>
  );
};

export default PrimaryButton;
