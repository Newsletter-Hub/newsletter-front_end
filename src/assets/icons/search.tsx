interface SearchProps {
  className?: string;
}

const Search = ({ className }: SearchProps) => {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 25 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M20.5 11C20.5 15.97 16.47 20 11.5 20C6.53 20 2.5 15.97 2.5 11C2.5 6.03 6.53 2 11.5 2"
        stroke="#292D32"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19.4304 20.6898C19.9604 22.2898 21.1704 22.4498 22.1004 21.0498C22.9504 19.7698 22.3904 18.7198 20.8504 18.7198C19.7104 18.7098 19.0704 19.5998 19.4304 20.6898Z"
        stroke="#292D32"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.5 5H20.5"
        stroke="#292D32"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.5 8H17.5"
        stroke="#292D32"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default Search;
