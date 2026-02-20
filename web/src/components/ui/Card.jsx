export default function Card({ children, className = '', bordered = false, dark = false, ...props }) {
  return (
    <div
      className={`
        ${dark ? 'bg-[#f5f5f5] text-[#1a1a1a]' : 'bg-white'}
        ${bordered ? 'border border-[#e8e8e8]' : 'shadow-sm'}
        transition-all duration-300 hover:shadow-lg
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}
