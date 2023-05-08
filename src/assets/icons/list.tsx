const ListIcon = ({ className }: { className?: string }) => {
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
        d="M2.20312 21.1172V3.07031L15 1.40625V22.4531L2.20312 21.1172Z"
        stroke="#253646"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18.75 4.10156V20.9766M22.5 4.54688V19.3594"
        stroke="#253646"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.64124 9.05371V15.0864M6.08594 12.1867L11.1188 12.1312"
        stroke="#253646"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default ListIcon;
