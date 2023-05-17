import { HTTPError } from 'ky';
import { toast } from 'react-toastify';

const throwErrorMessage = (error: HTTPError, defaultMessage: string) => {
  if (error.response && error.message) {
    error.response
      .json()
      .then(errorMessage => {
        toast.error(errorMessage.message || defaultMessage);
      })
      .catch(() => {
        toast(defaultMessage);
      });
  } else {
    toast(defaultMessage);
  }
};

export default throwErrorMessage;
