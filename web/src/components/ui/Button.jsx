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
        <div className="sellora-spinner" style={{ '--size': '16px', '--color': 'currentColor' }}>
          {Array.from({ length: 12 }).map((_, index) => (
            <span key={index} />
          ))}
        </div>
      )}
      {children}
    </button>
  );
}
