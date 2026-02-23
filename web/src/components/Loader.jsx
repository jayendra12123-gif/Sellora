const Loader = ({ size = 56, minHeight = '50vh' }) => {
  const outerSize = Number(size);
  const innerSize = Math.max(18, Math.round(outerSize * 0.55));
  const dotSize = Math.max(6, Math.round(outerSize * 0.18));

  return (
    <div
      className="flex justify-center items-center"
      style={{ minHeight }}
      role="status"
      aria-live="polite"
      aria-label="Loading"
    >
      <div className="relative" style={{ width: outerSize, height: outerSize }}>
        <div
          className="absolute inset-0 rounded-full border-4 border-[#f1e3d1] border-t-[#d4af88] animate-spin"
        />
        <div
          className="absolute rounded-full border-2 border-[#d4af88] border-b-transparent animate-spin"
          style={{
            width: innerSize,
            height: innerSize,
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            animationDuration: '1.4s'
          }}
        />
        <div
          className="absolute rounded-full bg-[#d4af88] animate-pulse"
          style={{
            width: dotSize,
            height: dotSize,
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)'
          }}
        />
      </div>
    </div>
  );
};

export default Loader;
  
