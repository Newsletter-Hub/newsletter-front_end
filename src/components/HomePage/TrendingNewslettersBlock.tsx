import trendingNewsletters from '@/assets/images/trendingNewsletters.png';
import Image from 'next/image';
import Quotes from '@/assets/icons/quotes';
import Link from 'next/link';
import Button from '../Button';

const newsletters = [
  {
    name: 'Name',
    description: 'Keys to writing copy that actually converts and sells users',
    image:
      'https://img.freepik.com/free-vector/mysterious-mafia-man-smoking-cigarette_52683-34828.jpg?w=1380&t=st=1681986171~exp=1681986771~hmac=438a21f876e9a20d5ee1cc104226678c40d0b18639b1383d6a97c42581f9cc06',
    authorName: 'Author name',
  },
  {
    name: 'Name',
    description: 'Keys to writing copy that actually converts and sells users',
    image:
      'https://img.freepik.com/free-vector/mysterious-mafia-man-smoking-cigarette_52683-34828.jpg?w=1380&t=st=1681986171~exp=1681986771~hmac=438a21f876e9a20d5ee1cc104226678c40d0b18639b1383d6a97c42581f9cc06',
    authorName: 'Author name',
  },
  {
    name: 'Name',
    description: 'Keys to writing copy that actually converts and sells users',
    image:
      'https://img.freepik.com/free-vector/mysterious-mafia-man-smoking-cigarette_52683-34828.jpg?w=1380&t=st=1681986171~exp=1681986771~hmac=438a21f876e9a20d5ee1cc104226678c40d0b18639b1383d6a97c42581f9cc06',
    authorName: 'Author name',
  },
];

const TrendingNewslettersBlock = () => {
  return (
    <div className="flex gap-16 mb-24">
      <div className="max-w-[40%] shadow-xl rounded-[40px]">
        <div className="p-14 pb-0">
          <h6 className="text-4xl font-bold text-dark-blue mb-9">
            Trending Newsletters
          </h6>
          <p className="text-waterloo text-lg mb-22">
            If you want to get a hand from the amazing team behind BRIX
            Templates, get in touch with BRIX Agency today.
          </p>
        </div>
        <Image src={trendingNewsletters} alt="Trending Newsletters" />
      </div>
      <div>
        <div className="mb-8">
          {newsletters.map(newsletter => (
            <div className="pb-9 border-b border-mercury mb-9">
              <div className="mb-1.5">
                <Quotes />
              </div>
              <div className="flex gap-5">
                <Image
                  src={newsletter.image}
                  alt="avatar"
                  width={72}
                  height={72}
                  className="rounded-[50px] max-h-[72px]"
                />
                <div>
                  <p className="text-3xl text-shark-blue font-medium">
                    {newsletter.name}
                  </p>
                  <p className="text-3xl font-light text-shark-blue">
                    {newsletter.description}
                  </p>
                </div>
              </div>
              <Link href="/" className="text-primary font-semibold">
                {newsletter.authorName}
              </Link>
            </div>
          ))}
        </div>
        <Button label="See more" size="full" rounded />
      </div>
    </div>
  );
};

export default TrendingNewslettersBlock;
