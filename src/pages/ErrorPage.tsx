import { useRouteError } from 'react-router-dom';

export default function ErrorPage({ status, statusText }: { status?: number; statusText?: string }) {
  const error: any = useRouteError();
  console.error(error);

  const is404 = status === 404 || error?.status === 404;

  if (is404) {
    return (
      <div id='error-page'>
        <h1>Oops!</h1>
        <p>Sorry, the page you were trying to view does not exist.</p>
        <p>
          <i>Error {error?.status || status}</i>
          <br />
          <i>{error?.statusText || error?.message || statusText}</i>
        </p>
      </div>
    );
  }

  return (
    <div id='error-page'>
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <i>Error {error?.status || status}</i>
        <br />
        <i>{error?.statusText || error?.message || statusText}</i>
      </p>
    </div>
  );
}
