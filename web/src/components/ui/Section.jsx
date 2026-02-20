export default function Section({ 
  title, 
  subtitle, 
  children, 
  className = '',
  centered = false,
  dark = false
}) {
  return (
    <section className={`py-20 ${dark ? 'bg-[#1a1a1a] text-white' : 'bg-white text-[#2d2d2d]'} ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        {(title || subtitle) && (
          <div className={`mb-16 ${centered ? 'text-center' : ''}`}>
            {title && (
              <h2 className={`text-4xl md:text-5xl font-serif font-bold mb-4 ${dark ? 'text-white' : 'text-[#1a1a1a]'}`}>
                {title}
              </h2>
            )}
            {subtitle && (
              <p className={`text-lg ${dark ? 'text-gray-300' : 'text-[#666666]'}`}>
                {subtitle}
              </p>
            )}
          </div>
        )}

        {/* Content */}
        {children}
      </div>
    </section>
  );
}
