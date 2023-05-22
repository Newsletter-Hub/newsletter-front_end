import { Interest } from '@/types/interests';

import Button from '../Button';

interface ProfileInterestsProps {
  interests: Interest[];
  interestsPayload: Interest[];
  handleInterestClick: (interest: Interest) => void;
}

const ProfileInterests = ({
  interests,
  handleInterestClick,
  interestsPayload,
}: ProfileInterestsProps) => {
  return (
    <div className="pt-10">
      <h3 className="text-xl text-dark-blue font-medium mb-8">Interests</h3>
      <div className="flex max-w-[768px] flex-wrap h-[400px] mb-12">
        {interests.map(item => (
          <Button
            label={item.interestName}
            key={item.id}
            rounded="xl"
            fontSize="md"
            customStyles="mr-3 mb-6"
            height="sm"
            onClick={() => handleInterestClick(item)}
            selected={interestsPayload?.some(
              userInterest => userInterest.id === item.id
            )}
            variant="primary-selected"
          />
        ))}
      </div>
    </div>
  );
};

export default ProfileInterests;
