import { updateUser } from '@/actions/user';

import { useRouter } from 'next/router';

import { Interest } from '@/types/interests';
import { UserInfoStepsProps } from '@/types/signup';

import Button from '../Button';

const ChooseInterests = ({
  payload,
  setPayload,
  setPage,
  page,
  interests,
}: UserInfoStepsProps & { interests?: Interest[] }) => {
  const router = useRouter();

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
    const response = await updateUser(formattedPayload);
    if (response && !response.error) {
      router.push('/');
    } else {
      console.error(response?.error);
    }
  };
  return (
    <>
      <div className="flex w-[600px] flex-wrap h-[400px] mb-12">
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
          <span>Loading..</span>
        )}
      </div>
      <div className="flex justify-between items-center w-full">
        <span
          className="font-inter text-dark-blue text-base font-semibold border-b border-dark-blue cursor-pointer"
          onClick={handlePreviousStep}
        >
          Back
        </span>
        <Button
          label="Finish"
          onClick={handleSubmit}
          customStyles="w-1/2"
          rounded="xl"
          fontSize="md"
        />
      </div>
    </>
  );
};

export default ChooseInterests;
