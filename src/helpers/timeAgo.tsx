import { formatDistanceToNow, parseISO } from 'date-fns';

const timeAgo = (dateString: string): string => {
  const date = parseISO(dateString);
  return `${formatDistanceToNow(date)} ago`;
};

export default timeAgo;
