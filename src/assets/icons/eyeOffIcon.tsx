interface EyeIconProps {
  onClick?: React.MouseEventHandler<SVGSVGElement>;
  className?: string;
}

const EyeOffIcon = ({ onClick, className }: EyeIconProps) => {
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
        d="M1.39742 1.39774L4.03037 4.03068M14.6019 14.6022L11.9692 11.9696M9.37504 13.0064C8.92964 13.0909 8.46999 13.1351 8.00001 13.1351C4.71527 13.1351 1.93477 10.9762 1 7.99996C1.25448 7.18975 1.64574 6.4401 2.14672 5.7781M6.4435 6.44382C6.84176 6.04556 7.39195 5.79924 7.99967 5.79924C9.21511 5.79924 10.2004 6.78455 10.2004 7.99999C10.2004 8.60771 9.95409 9.1579 9.55584 9.55616M6.4435 6.44382L9.55584 9.55616M6.4435 6.44382L4.03037 4.03068M9.55584 9.55616L4.03037 4.03068M9.55584 9.55616L11.9692 11.9696M4.03037 4.03068C5.17463 3.29298 6.53732 2.8649 7.99999 2.8649C11.2847 2.8649 14.0652 5.02378 15 8.00002C14.4814 9.65108 13.3948 11.0506 11.9692 11.9696"
        stroke="#A8AFB5"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default EyeOffIcon;
