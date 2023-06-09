import { NextPageContext } from 'next';

interface ErrorProps {
  statusCode: number | undefined;
}

const ErrorPage = ({ statusCode }: ErrorProps) => {
  return (
    <div>
      {statusCode
        ? `An error ${statusCode} occurred on server`
        : 'An error occurred on client'}
    </div>
  );
};

ErrorPage.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default ErrorPage;
