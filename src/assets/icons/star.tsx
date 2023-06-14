interface StarIconProps {
  className?: string;
  onClick?: (event: React.MouseEvent<SVGSVGElement>) => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

const StarIcon = ({
  className,
  onClick,
  onMouseEnter,
  onMouseLeave,
}: StarIconProps) => {
  return (
    <svg
      width="21"
      height="20"
      viewBox="0 0 21 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <path d="M9.66208 1.85876L7.3618 6.38359L2.21522 7.11152C1.29229 7.24139 0.922411 8.34526 1.59171 8.97751L5.31514 12.4976L4.43448 17.4701C4.27596 18.3689 5.25174 19.0422 6.06899 18.6218L10.6731 16.274L15.2772 18.6218C16.0944 19.0388 17.0702 18.3689 16.9117 17.4701L16.031 12.4976L19.7544 8.97751C20.4237 8.34526 20.0539 7.24139 19.1309 7.11152L13.9844 6.38359L11.6841 1.85876C11.2719 1.05222 10.0778 1.04196 9.66208 1.85876Z" />
    </svg>
  );
};

export default StarIcon;
