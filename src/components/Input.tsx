import Search from '@/assets/icons/search';

interface InputProps {
  placeholder?: string;
}

const Input = ({ placeholder }: InputProps) => {
  return (
    <div className="relative flex items-center">
      <Search className="absolute right-3" />
      <input
        className="bg-input-grey border-0 outline-none rounded-lg h-9 w-72 pl-2 pr-8 font-body text-sm"
        placeholder={placeholder}
      />
    </div>
  );
};

export default Input;
