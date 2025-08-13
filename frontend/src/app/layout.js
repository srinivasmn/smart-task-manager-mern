// frontend/src/app/layout.js
import "./globals.css";
import { ApolloProvider } from '../../components/ApolloProvider';

export const metadata = {
  title: 'My App',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ApolloProvider>{children}</ApolloProvider>
      </body>
    </html>
  );
}
