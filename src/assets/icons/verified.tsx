const VerifiedIcon = ({ className }: { className?: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="16"
      height="16"
      className={className}
    >
      <circle cx="12" cy="12" r="10" fill="#01AAED" />
      <path
        fill="white"
        d="M10.3,17.3l-4.3-4.3c-0.4-0.4-0.4-1,0-1.4s1-0.4,1.4,0l3.9,3.9l8.3-8.3c0.4-0.4,1-0.4,1.4,0s0.4,1,0,1.4l-9.3,9.3 C11.3,17.7,10.7,17.7,10.3,17.3z"
      />
    </svg>
  );
};

export default VerifiedIcon;
