const Loader = ({ size = 56, minHeight = '50vh' }) => {
  const spinnerSize = `${Number(size)}px`;
  return (
    <div
      className="flex justify-center items-center"
      style={{ minHeight }}
      role="status"
      aria-live="polite"
      aria-label="Loading"
    >
      <div className="sellora-spinner" style={{ '--size': spinnerSize }}>
        {Array.from({ length: 12 }).map((_, index) => (
          <span key={index} />
        ))}
      </div>
    </div>
  );
};

export default Loader;
  
