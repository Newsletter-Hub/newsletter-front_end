interface EyeIconProps {
  onClick?: React.MouseEventHandler<SVGSVGElement>;
  className?: string;
}

const EyeOnIcon = ({ onClick, className }: EyeIconProps) => {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      onClick={onClick}
      className={className}
    >
      <path
        d="M10.2004 8.00001C10.2004 9.21546 9.21511 10.2008 7.99967 10.2008C6.78423 10.2008 5.79892 9.21546 5.79892 8.00001C5.79892 6.78457 6.78423 5.79926 7.99967 5.79926C9.21511 5.79926 10.2004 6.78457 10.2004 8.00001Z"
        stroke="#A8AFB5"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M1 7.99999C1.93479 5.02378 4.71528 2.86493 7.99999 2.86493C11.2847 2.86493 14.0652 5.0238 15 8.00004C14.0652 10.9763 11.2847 13.1351 8.00001 13.1351C4.71527 13.1351 1.93477 10.9762 1 7.99999Z"
        stroke="#A8AFB5"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};

export default EyeOnIcon;
