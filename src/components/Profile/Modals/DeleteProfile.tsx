import { useRouter } from 'next/router';
import { logout } from '@/actions/auth';
import { useUser } from '@/contexts/UserContext';
import { Alegreya } from 'next/font/google';
import { deleteProfile } from '@/actions/user';

import { useMutation } from 'react-query';

import clsx from 'clsx';

import Button from '@/components/Button';
import Modal from '@/components/Modal';

import { ModalProps } from './propsType';

const alegreya = Alegreya({ subsets: ['latin'] });

const DeleteProfile = ({ open, handleClose }: ModalProps) => {
  const { setUser } = useUser();
  const router = useRouter();
  const deleteProfileMutation = useMutation(deleteProfile);

  const onSubmit = async () => {
    logout({ setUser });
    const response = await deleteProfileMutation.mutateAsync({ token: null });
    if (response.isDeleted) {
      router.push('/');
    } else {
      handleClose();
    }
  };
  const modalTitleStyles = clsx(
    'text-dark-blue text-5xl mb-1 font-medium',
    alegreya.className
  );
  return (
    <Modal open={open} handleClose={handleClose} size="sm">
      <div className="flex flex-col items-center">
        <h4 className={modalTitleStyles}>Delete Profile</h4>
        <p className="mb-9 font-inter mb-8 text-md text-dark-blue">
          We&apos;ll be sad to see you go!
        </p>
        <p className="text-start max-w-[395px] font-inter text-sm mb-8 text-dark-blue">
          WARNING: By clicking the button below this form, you are verifying
          that you want your account to be deleted from the Newsletter Hub
          directory. In doing so, any ratings, reviews, bookmarks, etc. left on
          the site will be removed. Are you sure you want to proceed?
        </p>
        <Button
          label="Delete profile"
          rounded="xl"
          fontSize="base"
          size="full"
          type="submit"
          onClick={onSubmit}
        />
      </div>
    </Modal>
  );
};

export default DeleteProfile;
