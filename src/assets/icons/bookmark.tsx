const BookmarkIcon = ({ className }: { className?: string }) => {
  return (
    <svg
      width="18"
      height="22"
      viewBox="0 0 18 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M1.5 2.875V20.1295C1.5 20.5154 1.91861 20.7558 2.25194 20.5614L9 16.625L15.7481 20.5614C16.0814 20.7558 16.5 20.5154 16.5 20.1295V2.3C16.5 1.58203 15.918 1 15.2 1H3.375C2.33945 1 1.5 1.83945 1.5 2.875Z"
        stroke="#253646"
        stroke-width="1.5"
        stroke-linecap="round"
      />
    </svg>
  );
};

export default BookmarkIcon;
