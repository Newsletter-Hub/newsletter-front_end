import Image from 'next/image';
import { parseISO, format } from 'date-fns';

import { User } from '@/types/user';

interface TipItemProps {
  tipper: User;
  amount: string;
  note: string;
  date: string;
  isLastItem: boolean;
}

const TipItem = ({ tipper, amount, note, date, isLastItem }: TipItemProps) => {
  const parsedDate = parseISO(date);
  const formattedDate = format(parsedDate, 'MMM d yyyy');

  const charForAvatar = tipper.username.charAt(0).toUpperCase();

  return (
    <li
      className={
        !isLastItem
          ? 'flex items-center gap-x-6 py-6 min-h-[188px] border-b border-light-grey'
          : 'flex items-center gap-x-6 py-6 min-h-[188px]'
      }
    >
      <div>
        {tipper?.avatar ? (
          <Image
            src={tipper.avatar}
            width={118}
            height={140}
            alt={tipper?.username}
          />
        ) : (
          <div className="flex items-center justify-center w-[118px] h-[118px] rounded-full bg-primary text-white text-2xl">
            {charForAvatar}
          </div>
        )}
      </div>
      <div className="flex flex-col justify-between w-full">
        <p className="font-alegreya text-xl text-dark-blue mb-2">
          {tipper.username}
        </p>
        <p className="font-inter font-normal text-base text-dark-blue mb-4">
          {note}
        </p>
        <div className="flex items-center justify-between w-full">
          <p className="font-inter font-normal text-sm text-grey-chat">
            {formattedDate}
          </p>
          <p className="rounded-[30px] px-5 py-[6px] min-w-[140px] h-[36px] bg-primary-light">
            <span className="font-inter font-normal text-base text-dark-grey">
              Donated{' '}
            </span>
            <span className="font-inter font-semibold text-base text-primary">
              {amount}
            </span>
          </p>
        </div>
      </div>
    </li>
  );
};

export default TipItem;
