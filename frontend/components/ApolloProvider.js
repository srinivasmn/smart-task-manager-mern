'use client';

import { ApolloLink, HttpLink } from '@apollo/client';
import {
  ApolloNextAppProvider,
  NextSSRApolloClient,
  NextSSRInMemoryCache,
} from '@apollo/experimental-nextjs-app-support/ssr';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';

function makeClient() {
  const httpLink = new HttpLink({
    uri: `${process.env.NEXT_PUBLIC_API_URL}/api/graphql`,
    credentials: 'include',
  });

  const authLink = setContext((_, { headers }) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      return {
        headers: {
          ...headers,
          authorization: token ? `Bearer ${token}` : '',
        },
      };
    }
    return { headers };
  });

  const errorLink = onError(({ graphQLErrors }) => {
    if (typeof window !== 'undefined' && graphQLErrors) {
      graphQLErrors.forEach(({ message }) => {
        if (message === 'Unauthorized') {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
      });
    }
  });

  return new NextSSRApolloClient({
    cache: new NextSSRInMemoryCache(),
    link: ApolloLink.from([errorLink, authLink, httpLink]),
  });
}

export function ApolloProvider({ children }) {
  return (
    <ApolloNextAppProvider makeClient={makeClient}>
      {children}
    </ApolloNextAppProvider>
  );
}
