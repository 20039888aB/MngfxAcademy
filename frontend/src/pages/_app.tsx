import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';

import Layout from '@/components/Layout';
import '@/styles/globals.css';
import '@/styles/auth.css';

type NextComponentWithLayout = AppProps['Component'] & {
  disableLayout?: boolean;
};

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const PageComponent = Component as NextComponentWithLayout;
  const content = <PageComponent {...pageProps} />;

  return (
    <SessionProvider session={session}>
      {PageComponent.disableLayout ? content : <Layout>{content}</Layout>}
    </SessionProvider>
  );
}

export default MyApp;

