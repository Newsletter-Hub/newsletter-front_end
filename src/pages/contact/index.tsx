import Link from 'next/link';

const Contact = () => {
  return (
    <div className="md:shadow-md md:p-12 p-3 pt-6 md:pt-12 rounded-3xl max-w-[696px] max-h-[95vh] overflow-y-auto">
      <p className="text-lightBlack font-semibold text-center mb-8 text-5xl">
        Contact Us
      </p>
      <div>
        <p className="text-xs font-semibold text-lightDark mb-2 font-inter">
          Customer Support
        </p>
        <p className="text-start max-w-[395px] font-inter text-sm mb-8 text-dark-blue">
          For help with your account, adding a newsletter, navigating our site,
          or anything else, email us at&nbsp;
          <Link href="mailto: team@newsletterhub.co">
            team@newsletterhub.co
          </Link>
          .
        </p>
        <p className="text-xs font-semibold text-lightDark mb-2 font-inter">
          Business Inquires
        </p>
        <p className="text-start max-w-[395px] font-inter text-sm mb-8 text-dark-blue">
          For advertising, partnerships, and all things business, email us
          at&nbsp;
          <Link href="mailto: team@newsletterhub.co">
            team@newsletterhub.co
          </Link>
          .
        </p>
        <p className="text-xs font-semibold text-lightDark mb-2 font-inter">
          Feedback
        </p>
        <p className="text-start max-w-[395px] font-inter text-sm mb-8 text-dark-blue">
          Tell us how we are doing or what you would like to see, email us
          at&nbsp;
          <Link href="mailto: team@newsletterhub.co">
            team@newsletterhub.co
          </Link>
          .
        </p>
        <p className="text-xs font-semibold text-lightDark mb-2 font-inter">
          Report Content
        </p>
        <p className="text-start max-w-[395px] font-inter text-sm mb-8 text-dark-blue">
          Found inaccuarte or inapproriate content posted by other users on our
          site? You can directly report newsletters by locating the
          &quot;Report&quot; button on the page of the newsletter. For reporting
          other things like reviews, users, etc., email us at&nbsp;
          <Link href="mailto: team@newsletterhub.co">
            team@newsletterhub.co
          </Link>
          .
        </p>
        <p className="text-xs font-semibold text-lightDark mb-2 font-inter">
          Social
        </p>
        <p className="text-start max-w-[395px] font-inter text-sm mb-8 text-dark-blue">
          You can find us on&nbsp;
          <Link
            href="https://twitter.com/newsletter_hub'"
            legacyBehavior
            passHref
          >
            <a target="_blank" rel="noopener noreferrer">
              Twitter&nbsp;
            </a>
          </Link>
          at @newsletter_hub.
        </p>
      </div>
    </div>
  );
};

Contact.layout = 'entry';
Contact.type = 'contact';

export default Contact;
