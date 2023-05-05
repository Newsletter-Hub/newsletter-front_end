const DeleteIconWithBg = ({ className }: { className?: string }) => {
  return (
    <svg
      width="38"
      height="38"
      viewBox="0 0 38 38"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect width="38" height="38" rx="19" fill="white" />
      <path
        d="M23.6667 15.6667L23.0885 23.7617C23.0387 24.4594 22.4581 25 21.7586 25H16.2416C15.5421 25 14.9615 24.4594 14.9116 23.7617L14.3334 15.6667M17.6667 18.3333V22.3333M20.3334 18.3333V22.3333M21.0001 15.6667V13.6667C21.0001 13.2985 20.7016 13 20.3334 13H17.6667C17.2986 13 17.0001 13.2985 17.0001 13.6667V15.6667M13.6667 15.6667H24.3334"
        stroke="#253646"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};

export default DeleteIconWithBg;
