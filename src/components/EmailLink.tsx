import React, { ReactNode } from 'react';

interface EmailLinkProps {
  email: string;
  subject: string;
  children: ReactNode;
}

const EmailLink = ({ email, subject, children }: EmailLinkProps) => {
  const href = `mailto:${email}?subject=${encodeURIComponent(subject)}`;

  return <a href={href}>{children}</a>;
};

export default EmailLink;
