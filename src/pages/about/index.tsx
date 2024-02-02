import Avatar from '@/components/Avatar';
import Icon from '@/assets/images/icon.svg';
import Link from 'next/link';

const About = () => {
  return (
    <div className="bg-profile bg-cover bg-no-repeat bg-top w-screen pt-20 flex flex-col items-center">
      <Avatar
        src={Icon}
        width={252}
        height={252}
        alt="Newsletter Hub"
        className="min-h-[252px] object-fill mb-8"
        username="Newsletter Hub"
        size="xl"
      />
      <h1 className="text-dark-blue text-5xl font-medium">Newsletter Hub</h1>
      <div className="text-center flex flex-wrap justify-center">
        <p className="font-inter text-dark-grey text-sm mb-8 max-w-[512px] px-3">
          The ultimate destination for everything newsletters. Readers, find
          your next daily source of knowledge and information. Writers, get
          exposure, feedback, and social proof for your newsletter.
        </p>
      </div>
      <div className="flex flex-col sm:flex-row items-center gap-2 sm:pt-10 pb-5 border-t border-light-grey mt-10">
        <div className="flex flex-col">
          <h3 className="font-medium text-5xl text-dark-blue mb-2">
            Who We Are
          </h3>
          <p className="text-start max-w-[395px] font-inter text-sm mb-8 text-dark-blue">
            Newsletter Hub was launched in 2023. It was created by a technical
            founder from California, who is also an avid newsletter consumer,
            and advocate of learning and teaching via newsletters. With the
            influx of newsletters being created, there lacked a way to find the
            best newsletters in a niche on your own; and thus, Newsletter Hub
            was born.
            <br />
            <br />
            The mission of Newsletter Hub is to play a role in making
            newsletters as mainstream as podcasts. In a world where newsletters
            are hosted on so many different platforms, we hope to be a
            platform-agnostic newsletter database.
          </p>
          <h3 className="font-medium text-5xl text-dark-blue mb-2">
            What We Offer Now
          </h3>
          <ul className="list-disc text-start max-w-[395px] font-inter text-sm mb-8 text-dark-blue">
            <li>
              <span className="text-start max-w-[395px] font-inter text-sm mb-8 text-dark-blue">
                Instantly add newsletters to our site in under a minute.
              </span>
            </li>
            <li>
              <span className="text-start max-w-[395px] font-inter text-sm mb-8 text-dark-blue">
                See what newsletters your friends are reading
              </span>
            </li>
            <li>
              <span className="text-start max-w-[395px] font-inter text-sm mb-8 text-dark-blue">
                Find out if a newsletter is a good fit for you from our
                community’s reviews.
              </span>
            </li>
            <li>
              <span className="text-start max-w-[395px] font-inter text-sm mb-8 text-dark-blue">
                Disovery newsletters with our search, filter, and sort
                capabilities, or browse through our 30+ categories.
              </span>
            </li>
            <li>
              <span className="text-start max-w-[395px] font-inter text-sm mb-8 text-dark-blue">
                Follow newsletters you love, and bookmark ones you want to check
                out.{' '}
              </span>
            </li>
          </ul>
          <h3 className="font-medium text-5xl text-dark-blue mb-2">
            What We Will Offer In The Future
          </h3>
          <ul className="list-disc text-start max-w-[395px] font-inter text-sm mb-8 text-dark-blue">
            <li>
              <span className="text-start max-w-[395px] font-inter text-sm mb-8 text-dark-blue">
                Check out your personalized newsletter recommendations.
              </span>
            </li>
            <li>
              <span className="text-start max-w-[395px] font-inter text-sm mb-8 text-dark-blue">
                A directory of specific issues sent by newsletters.
              </span>
            </li>
            <li>
              <span className="text-start max-w-[395px] font-inter text-sm mb-8 text-dark-blue">
                Allow Newsletter writers to claim and customize the landing
                pages for their newsletters.
              </span>
            </li>
            <li>
              <span className="text-start max-w-[395px] font-inter text-sm mb-8 text-dark-blue">
                Newsletter promotions.
              </span>
            </li>
            <li>
              <span className="text-start max-w-[395px] font-inter text-sm mb-8 text-dark-blue">
                ...and more tools to power newsletter writers and readers alike.
                If you have any features you&apos;d like to see, please email us
                at&nbsp;
                <Link href="mailto: team@newsletterhub.co">
                  team@newsletterhub.co
                </Link>
                .
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default About;
