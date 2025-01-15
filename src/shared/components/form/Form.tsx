import './Form.css';

interface FormProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
}

const Form = ({ children, className, title }: FormProps) => {
  return (
    <div className={`form-container ${className || ''}`}>
      {title && <h2 className="form-title">{title}</h2>}
      <div className="form-content">
        {children}
      </div>
    </div>
  );
};

export default Form; 