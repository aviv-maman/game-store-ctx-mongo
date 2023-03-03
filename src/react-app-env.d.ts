/// <reference types="react-scripts" />
interface Window {
  google?: {
    accounts: {
      id: {
        initialize: (input: IdConfiguration) => void;
        prompt: (momentListener: (res: PromptMomentNotification) => void) => void;
        renderButton: (parent: HTMLElement | unknown, options: GsiButtonConfiguration) => void;
        disableAutoSelect: Function;
        storeCredential: Function<{
          credentials: { id: string; password: string };
          callback: Function;
        }>;
        cancel: () => void;
        onGoogleLibraryLoad: Function;
        revoke: Function<{
          hint: string;
          callback: Function<{ successful: boolean; error: string }>;
        }>;
      };
    };
  };
}
