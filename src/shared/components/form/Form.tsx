import './Form.css';

interface FormProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  height?: string;
  buttons?: React.ReactNode;
}

const Form = ({ children, className, title, height, buttons }: FormProps) => {
  return (
    <div className={`form-container ${className || ''}`} style={{height: height}}>
      {title && <h2 className="form-title">{title}</h2>}
      <div className="form-content" style={{height: height}}>
        {children}
      </div>
      {buttons && <div className="form-buttons">{buttons}</div>}
    </div>
  );
};

export default Form; 