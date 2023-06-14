import { HTTPError } from 'ky';
import { toast } from 'react-toastify';

const throwErrorMessage = (error: HTTPError, defaultMessage: string) => {
  if (error.response && error.message) {
    error.response
      .json()
      .then(errorMessage => {
        toast.error(
          (Array.isArray(errorMessage.message) && errorMessage.message[0]) ||
            errorMessage.message ||
            defaultMessage
        );
      })
      .catch(() => {
        toast.error(defaultMessage);
      });
  } else {
    toast.error(defaultMessage);
  }
};

export default throwErrorMessage;
