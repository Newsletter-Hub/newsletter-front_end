import { signUpSetCookie } from '@/actions/auth';
import { updateUser } from '@/actions/user';
import { useUser } from '@/contexts/UserContext';

import { useRouter } from 'next/router';

import { Interest } from '@/types/interests';
import { UserInfoStepsProps } from '@/types/signup';

import Button from '../Button';
import Loading from '../Loading';

const ChooseInterests = ({
  payload,
  setPayload,
  setPage,
  page,
  interests,
}: UserInfoStepsProps & { interests?: Interest[] }) => {
  const router = useRouter();
  const { setUser } = useUser();
  const { accessToken } = router.query;

  const handlePreviousStep = () => setPage(page - 1);
  const handleInterestClick = (id: number) => {
    if (payload.interests) {
      if (payload.interests.includes(id)) {
        const formattedInterests = payload.interests.filter(
          item => item !== id
        );
        setPayload({ ...payload, interests: formattedInterests });
      } else {
        setPayload({ ...payload, interests: [...payload.interests, id] });
      }
    } else {
      setPayload({ ...payload, interests: [id] });
    }
  };

  const handleSubmit = async () => {
    delete payload.avatarURL;
    const formattedPayload = Object.fromEntries(
      Object.entries(payload).filter(([key, value]) => value !== undefined)
    );
    const res = await signUpSetCookie({
      accessToken: accessToken as string,
    });
    if (res && res.username) {
      updateUser({
        ...formattedPayload,
        username: res.username,
        router,
        setUser,
      });
    }
  };
  return (
    <>
      <div className="flex md:w-[600px] flex-wrap h-[400px] mb-12 overflow-scroll md:overflow-visible interests-container">
        {interests ? (
          interests.map(item => (
            <Button
              label={item.interestName}
              key={item.id}
              rounded="xl"
              fontSize="md"
              customStyles="mr-3 mb-6"
              height="sm"
              onClick={() => handleInterestClick(item.id)}
              selected={Boolean(
                payload.interests?.length &&
                  payload.interests?.includes(item.id)
              )}
              variant="primary-selected"
            />
          ))
        ) : (
          <Loading />
        )}
      </div>
      <div className="flex justify-between items-center w-full px-3 md:px-0">
        <span
          className="font-inter text-dark-blue text-base font-semibold border-b border-dark-blue cursor-pointer"
          onClick={handlePreviousStep}
        >
          Back
        </span>
        <Button
          label="Finish"
          onClick={handleSubmit}
          customStyles="max-w-[200px]"
          size="full"
          rounded="xl"
          fontSize="md"
        />
      </div>
    </>
  );
};

export default ChooseInterests;
