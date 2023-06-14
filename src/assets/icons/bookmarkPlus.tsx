const BookmarkPlusIcon = ({ className }: { className?: string }) => {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M8.75 1.25H5.39062C4.48452 1.25 3.75 1.98452 3.75 2.89062V17.8795C3.75 18.2654 4.16861 18.5058 4.50194 18.3114L10.3125 14.9219L16.1231 18.3114C16.4564 18.5058 16.875 18.2654 16.875 17.8795V10"
        stroke="#253646"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M15 1.25V6.25M12.5 3.75H17.5"
        stroke="#253646"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default BookmarkPlusIcon;
