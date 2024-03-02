import React from 'react';

import Link from 'next/link';

const productLinks = [
  { label: 'About Us', href: '/about' },
  { label: 'Contact Us', href: '/contact' },
  { label: 'Site Map', href: '/sitemap.xml' },
];

const newsletterLinks = [
  { label: 'Explore Newsletters', href: '/newsletters/categories/all' },
  { label: 'Explore Categories', href: '/newsletters/categories' },
  { label: 'Explore Community', href: '/users' },
  { label: 'Add Newsletter', href: '/newsletters/add' },
  { label: 'Claim Newsletter', href: '/newsletters/claim' },
];

const socialMediaLinks = [
  { label: 'X/Twitter', href: 'https://twitter.com/newsletter_hub' },
  { label: 'Facebook', href: 'https://www.facebook.com/newsletterhub' },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/company/newsletterhub',
  },
];

const additionalLinks = [
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms of Service', href: '/terms' },
  { label: 'Cookie Policy', href: '/cookies' },
];

const Footer = () => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();

  return (
    <footer className="lg:pt-[88px] pt-16 max-w-[1280px] mx-auto px-4">
      <div className="bg-light-grey pt-12 pb-24 pl-8 pr-21">
        <div className="flex flex-col lg:flex-row gap-48">
          <div className="flex flex-col gap-3.5">
            <h5 className="text-primary font-medium">Newsletters</h5>
            {newsletterLinks.map(link => (
              <Link href={link.href} key={link.href}>
                {link.label}
              </Link>
            ))}
          </div>
          <div className="flex flex-col gap-3.5">
            <h5 className="text-primary font-medium">Resources</h5>
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
            <h5 className="text-primary font-medium">Follow</h5>
            {socialMediaLinks.map(link => (
              <Link href={link.href} key={link.href} legacyBehavior passHref>
                <a target="_blank" rel="noopener noreferrer">
                  {link.label}
                </a>
              </Link>
            ))}
          </div>
          <div>
            <h4 className="text-2xl mb-3">What is Newsletter Hub?</h4>
            <p className="text-sm text-dark-grey">
              The ultimate destination for everything newsletters. Readers, find
              your next daily source of knowledge and information. Writers, get
              exposure, feedback, and social proof for your newsletter.
            </p>
          </div>
        </div>
      </div>
      <div className="bg-primary py-8 pl-8 pr-20 flex items-center">
        <div className="flex text-white flex-1">
          {additionalLinks.map((link, index) => (
            <React.Fragment key={link.href}>
              <Link href={link.href} className="mr-1 text-base" key={link.href}>
                {link.label} {index !== 2 && '/'}
              </Link>
            </React.Fragment>
          ))}
        </div>
        <div className="flex items-center gap-6">
          <span className="text-white text-base font-medium">
            © {currentYear}
          </span>
          <span className="text-white text-4xl">Newsletter Hub</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
