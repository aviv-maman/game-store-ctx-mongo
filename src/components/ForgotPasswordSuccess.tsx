//React
import type { FC } from 'react';
//React Router DOM
import { useNavigation } from 'react-router-dom';
//PrimeReact
import { Button } from 'primereact/button';
//Assets
import resetEmailSuccess from '../assets/images/reset-email-success.svg';
import { Mail28Regular, MailInboxCheckmark28Regular } from '@fluentui/react-icons';

type ForgotPasswordSuccessProps = {
  handleForgetPasswordAction: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
};

const ForgotPasswordSuccess: FC<ForgotPasswordSuccessProps> = ({ handleForgetPasswordAction }) => {
  const navigation = useNavigation();

  return (
    <>
      <img src={resetEmailSuccess} alt='Reset Email Success' />
      <MailInboxCheckmark28Regular />
      <h2>Reset Email Sent</h2>
      <p>Check your email for a link to reset your password.</p>
      <span>
        Click on the reset link provided in the email to set a new password for your account. If the email has not reached you, click on the button
        below.
      </span>
      <Button
        label='Re-send Reset Email'
        type='button'
        onClick={handleForgetPasswordAction}
        loading={navigation.state !== 'idle'}
        disabled={navigation.state !== 'idle'}
        icon={<Mail28Regular />}
      />
    </>
  );
};

export default ForgotPasswordSuccess;
