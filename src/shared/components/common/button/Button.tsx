import { ButtonHTMLAttributes } from 'react';
import './button.css';

// DeleteButton
interface DeleteButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  disabled?: boolean;
}

export const DeleteButton = ({ onClick, disabled = false, ...props }: DeleteButtonProps) => {
  return (
    <button 
      className={`delete-button ${disabled ? 'disabled' : ''}`}
      onClick={onClick}
      disabled={disabled}
      type="button"
      aria-label="삭제"
      {...props}
    >
      <svg 
        width="16" 
        height="16" 
        viewBox="0 0 16 16" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <path 
          d="M12 4L4 12M4 4L12 12" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
        />
      </svg>
    </button>
  );
};

// ToggleButton
interface ToggleButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isActive?: boolean;
  onToggle?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
}

export const ToggleButton = ({ 
  isActive = false, 
  onToggle,
  disabled = false,
  ...props 
}: ToggleButtonProps) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    onToggle?.(e);
  };

  return (
    <button 
      className={`toggle-button ${isActive ? 'active' : ''} ${disabled ? 'disabled' : ''}`}
      onClick={handleClick}
      disabled={disabled}
      type="button"
      {...props}
    >
      <div className="toggle-slider" />
    </button>
  );
};

// SaveButton
interface SaveButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  disabled?: boolean;
}

export const SaveButton = ({ onClick, disabled = false, ...props }: SaveButtonProps) => {
  return (
    <button 
      className={`save-button ${disabled ? 'disabled' : ''}`}
      onClick={onClick}
      disabled={disabled}
      type="button"
      {...props}
    >
      저장
    </button>
  );
};

export const UpdateButton = ({ onClick, disabled = false, ...props }: SaveButtonProps) => {
  return (
    <button 
        className={`update-button ${disabled ? 'disabled' : ''}`}
        onClick={onClick} 
        disabled={disabled} 
        type="button"
        {...props}
    >
        수정
    </button>
  );
};
