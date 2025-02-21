import { FaSpinner } from 'react-icons/fa';

import { Button, type ButtonProps } from '../ui/button';

type FormButtonProp = {
  label?: string;
  className?: string;
  icon?: React.ReactNode;
  loading?: boolean;
};

export const LoadingButton = ({
  label,
  className,
  type = 'submit',
  onClick,
  icon,
  loading,
  ...props
}: FormButtonProp & ButtonProps) => {
  return (
    <Button
      disabled={loading}
      type={type}
      onClick={onClick}
      className={`${loading ? 'bg-gray-500' : ''} ${className}`}
      {...props}
    >
      {loading
        ? (
            <FaSpinner className="mr-1 animate-spin" />
          )
        : (
            icon && <span className="mr-1">{icon}</span>
          )}

      {label}
    </Button>
  );
};
