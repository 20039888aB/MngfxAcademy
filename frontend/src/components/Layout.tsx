import { PropsWithChildren } from 'react';

import Footer from './Footer';
import Header from './Header';
import FloatingChatFab from './FloatingChatFab';

const Layout = ({ children }: PropsWithChildren) => {
  return (
    <div className="layout-root">
      <Header />
      <main className="container" style={{ paddingTop: '5rem', paddingBottom: '4rem' }}>
        {children}
      </main>
      <Footer />
      <FloatingChatFab />
    </div>
  );
};

export default Layout;

