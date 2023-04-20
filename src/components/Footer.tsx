import Link from 'next/link';

const productLinks = [
  { label: 'Blog', href: '/blog' },
  { label: 'Site Map', href: '/site-map' },
  { label: 'F.A.Q', href: '/faq' },
];

const companyLinks = [
  { label: 'Bronze', href: '/bronze' },
  { label: 'Silver', href: '/silver' },
  { label: 'Gold', href: '/gold' },
];

const socialMediaLinks = [
  { label: 'Facebook', href: 'https://www.facebook.com/' },
  { label: 'Linkedin', href: 'https://www.linkedin.com/' },
  { label: 'Twitter', href: 'https://twitter.com/' },
];

const additionalLinks = [
  { label: 'Privacy Policy', href: 'privacy-policy' },
  { label: 'Personal Information', href: 'personal-information' },
  { label: 'Terms of Service', href: 'terms-of-service' },
];

const Footer = () => {
  return (
    <footer className="bg-white pt-29 px-32 pb-4">
      <div className="bg-light-grey pt-12 pb-24 pl-8 pr-21">
        <div className="flex gap-48">
          <div className="flex flex-col gap-3.5">
            <h5 className="text-primary font-medium">Product</h5>
            {productLinks.map(link => (
              <Link
                href={link.href}
                key={link.href}
                className="whitespace-nowrap"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="flex flex-col gap-3.5">
            <h5 className="text-primary font-medium">Company</h5>
            {companyLinks.map(link => (
              <Link href={link.href} key={link.href}>
                {link.label}
              </Link>
            ))}
          </div>
          <div className="flex flex-col gap-3.5">
            <h5 className="text-primary font-medium">Follow</h5>
            {socialMediaLinks.map(link => (
              <Link href={link.href} key={link.href}>
                {link.label}
              </Link>
            ))}
          </div>
          <div>
            <h4 className="text-2xl mb-3">Ready to get started?</h4>
            <p className="text-sm text-gull-grey">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </p>
          </div>
        </div>
      </div>
      <div className="bg-primary py-8 pl-8 pr-20 flex items-center">
        <div className="flex text-white flex-1">
          {additionalLinks.map((link, index) => (
            <>
              <Link href={link.href} className="mr-1 text-base" key={link.href}>
                {link.label} {index !== 2 && '/'}
              </Link>
            </>
          ))}
        </div>
        <div className="flex items-center gap-6">
          <span className="text-white text-base font-medium">2021</span>
          <span className="text-white text-4xl">TRADE</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
