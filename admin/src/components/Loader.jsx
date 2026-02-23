export default function Loader({ size = 56 }) {
  return (
    <div className="admin-loader" role="status" aria-live="polite" aria-label="Loading">
      <div className="sellora-spinner" style={{ '--size': `${Number(size)}px` }}>
        {Array.from({ length: 12 }).map((_, index) => (
          <span key={index} />
        ))}
      </div>
    </div>
  );
}
