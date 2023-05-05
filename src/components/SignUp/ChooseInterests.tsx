import { UseQueryResult, useQuery } from 'react-query';

import { updateUser } from '@/pages/api/user';
import { getInterests } from '@/pages/api/user/interests';

import { Interest } from '@/types/interests';
import { UserInfoStepsProps } from '@/types/signup';

import Button from '../Button';

const ChooseInterests = ({
  payload,
  setPayload,
  setPage,
  page,
}: UserInfoStepsProps) => {
  const { data }: UseQueryResult<Interest[], Error> = useQuery(
    'interests',
    getInterests
  );

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

  const handleSubmit = () => {
    delete payload.avatarURL;
    const formattedPayload = Object.fromEntries(
      Object.entries(payload).filter(([key, value]) => value !== undefined)
    );
    updateUser(formattedPayload);
  };
  return (
    <>
      <div className="flex w-[600px] flex-wrap h-[500px] mb-12">
        {data ? (
          data.map(item => (
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
            />
          ))
        ) : (
          <span>Loading..</span>
        )}
      </div>
      <div className="flex gap-2 w-full">
        <Button
          label="Back"
          customStyles="w-full"
          rounded="xl"
          variant="secondary"
          onClick={handlePreviousStep}
          fontSize="md"
        />
        <Button
          label="Save"
          type="submit"
          customStyles="w-full"
          rounded="xl"
          fontSize="md"
          onClick={handleSubmit}
        />
      </div>
    </>
  );
};

export default ChooseInterests;
