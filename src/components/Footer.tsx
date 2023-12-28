import React from 'react';
import Link from 'next/link';
import GetStartedBlock from './HomePage/GetStartedBlock';

const additionalLinks = [
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms of Service', href: '/terms' },
  { label: 'Cookie Policy', href: '/cookies' },
];

const Footer = () => {
  return (
    <footer className="pt-29 px-32 pb-4">
      <GetStartedBlock></GetStartedBlock>
      <div className="bg-primary py-8 pl-8 pr-20 flex items-center">
        <div className="flex text-white flex-1">
          {additionalLinks.map((link, index) => (
            <React.Fragment key={link.href}>
              <Link
                href={link.href}
                className="mr-1 text-base hover:text-dark-blue"
                key={link.href}
              >
                {link.label} {index !== 2 && '/'}
              </Link>
            </React.Fragment>
          ))}
        </div>
        <div className="flex items-center gap-6">
          <span className="text-white text-base font-medium">© 2024</span>
          <span className="text-white text-4xl">Newsletter Hub</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
