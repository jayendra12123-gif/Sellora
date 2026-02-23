import { buttonVariants } from '../../utils/theme';

export default function Button({ 
  variant = 'primary', 
  children, 
  className = '', 
  disabled = false,
  isLoading = false,
  ...props 
}) {
  return (
    <button
      disabled={disabled || isLoading}
      className={`
        py-3 px-6 font-semibold text-sm uppercase tracking-wide
        transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed
        flex items-center justify-center gap-2
        ${buttonVariants[variant]}
        ${className}
      `}
      {...props}
    >
      {isLoading && (
        <div className="relative w-4 h-4">
          <div className="absolute inset-0 rounded-full border-2 border-current border-t-transparent animate-spin" />
          <div
            className="absolute rounded-full border border-current border-b-transparent animate-spin"
            style={{ inset: 3, animationDuration: '1.1s' }}
          />
        </div>
      )}
      {children}
    </button>
  );
}
