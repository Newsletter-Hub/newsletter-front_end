interface SortProps {
  className?: string;
}

const SortIcon = ({ className }: SortProps) => {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.62808 2.07506L4.0442 6.5549C3.93944 6.68586 4.03267 6.87984 4.20038 6.87984H11.3681C11.5358 6.87984 11.6291 6.68586 11.5243 6.5549L7.94042 2.07506C7.86036 1.97498 7.70814 1.97498 7.62808 2.07506ZM7.94043 13.6847L11.5243 9.20482C11.6291 9.07387 11.5358 8.87989 11.3681 8.87989L4.20039 8.87988C4.03268 8.87988 3.93945 9.07387 4.04421 9.20482L7.62809 13.6847C7.70815 13.7847 7.86037 13.7847 7.94043 13.6847Z"
        fill="#253646"
      />
    </svg>
  );
};

export default SortIcon;
