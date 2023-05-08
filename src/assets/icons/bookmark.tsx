const BookmarkIcon = ({ className }: { className?: string }) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M10.5 1.5H6.46875C5.38143 1.5 4.5 2.38143 4.5 3.46875V21.6295C4.5 22.0154 4.91861 22.2558 5.25194 22.0614L12.375 17.9062L19.4981 22.0614C19.8314 22.2558 20.25 22.0154 20.25 21.6295V12"
        stroke="#253646"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M18 1.5V7.5M15 4.5H21"
        stroke="#253646"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default BookmarkIcon;
