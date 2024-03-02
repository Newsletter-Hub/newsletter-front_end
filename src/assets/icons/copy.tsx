const CopyIcon = ({ className }: { className?: string }) => {
  return (
    <svg
      viewBox="0 0 64 64"
      width="32"
      height="32"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle cx="32" cy="32" r="31" fill="#7f7f7f"></circle>
      <rect
        x="23"
        y="22"
        width="18"
        height="20"
        fill="none"
        stroke="white"
        stroke-width="2"
      />
      <rect
        x="27"
        y="26"
        width="18"
        height="20"
        fill="none"
        stroke="white"
        stroke-width="2"
      />
    </svg>
  );
};

export default CopyIcon;
