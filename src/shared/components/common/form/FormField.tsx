interface FormFieldProps {
  children: React.ReactNode;
  label?: string;
  htmlFor?: string;
  required?: boolean;
}

const FormField = ({ children, label, htmlFor, required }: FormFieldProps) => {
  return (
    <div className="form-field">
      {label && (
        <label htmlFor={htmlFor} className="form-label">
          {label}
          {required && <span className="required-mark">*</span>}
        </label>
      )}
      {children}
    </div>
  );
};

export default FormField; 