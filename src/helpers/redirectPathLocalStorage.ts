import { REDIRECT_AFTER_LOGIN_PATH } from '@/config/constants';

// Set the redirect path and timestamp in localStorage
export const setRedirectPath = (path: string) => {
  const item = {
    path: path,
    timestamp: new Date().getTime(),
  };
  localStorage.setItem(REDIRECT_AFTER_LOGIN_PATH, JSON.stringify(item));
};

// Retrieve and check the redirect path
export const getRedirectPath = () => {
  const itemStr = localStorage.getItem(REDIRECT_AFTER_LOGIN_PATH);
  if (!itemStr) {
    return null;
  }
  const item = JSON.parse(itemStr);
  const now = new Date().getTime();
  const threshold = 30 * 60 * 1000; // 30 minutes in milliseconds

  if (now - item.timestamp > threshold) {
    // The stored data is considered stale, remove it
    localStorage.removeItem(REDIRECT_AFTER_LOGIN_PATH);
    return null;
  }

  return item.path;
};
