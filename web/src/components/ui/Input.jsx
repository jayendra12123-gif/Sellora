import { inputClasses } from '../../utils/theme';

export default function Input({ 
  label, 
  icon: Icon, 
  error, 
  required,
  className = '',
  onBlur,
  ...props 
}) {
  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-[#1a1a1a] mb-3 uppercase tracking-wide">
          {label}
          {required && <span className="text-[#d4af88] ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        <input
          className={`${inputClasses} ${className} ${error ? 'border-b-red-500 input-error' : ''}`}
          onBlur={onBlur}
          {...props}
        />
        {Icon && (
          <div className="absolute right-0 top-3 text-[#d4af88]">
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
      {error && (
        <p className="text-red-600 text-sm mt-2 font-semibold">{error}</p>
      )}
    </div>
  );
}
