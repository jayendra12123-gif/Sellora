const Loader = () => {
  return (
    <div className="flex justify-center items-center min-h-[50vh]" role="status" aria-live="polite" aria-label="Loading">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#f1e3d1] border-t-[#d4af88]"></div>
    </div>
  );
};

export default Loader;
  
