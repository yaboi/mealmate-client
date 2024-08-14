import React from "react";
import PropTypes from "prop-types";

import {
  ApolloClient,
  ApolloProvider as ApolloClientProvider,
  createHttpLink,
  InMemoryCache,
  from,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";

function ApolloProvider(props: any) {
  const { children } = props;

  const [client, setClient] = React.useState<ApolloClient<any> | undefined>(
    undefined
  );

  React.useEffect(() => {
    async function init() {
      const errorLink = onError(({ graphQLErrors, networkError }) => {
        /**
         * TODO:
         * Disable this for production environments
         */
        if (graphQLErrors) {
          if (graphQLErrors.length > 0) {
            graphQLErrors.forEach(({ message }) => {
              // eslint-disable-next-line no-console
              console.error(`[GraphQL error]: Message: ${message}`);
            });
          } else {
            // eslint-disable-next-line no-console
            console.error(`[GraphQL] ${JSON.stringify(graphQLErrors)}`);
          }
        }
        if (networkError) {
          // eslint-disable-next-line no-console
          console.error(`[Network error]: ${networkError}`);
        }
      });

      const httpLink = createHttpLink({
        uri: process.env.REACT_APP_GRAPHQL_ENDPOINT,
      });

      const link = from([errorLink, httpLink]);

      setClient(
        new ApolloClient({
          cache: new InMemoryCache(),
          link,
          defaultOptions: {
            watchQuery: {
              errorPolicy: "all",
            },
          },
          // Enable Apollo DevTools for Chrome in non Prod envs
          // ref: https://chrome.google.com/webstore/detail/apollo-client-devtools/jdkknkkbebbapilgoeccciglkfbmbnfm
          connectToDevTools: process.env.NODE_ENV !== "production",
        })
      );
    }

    // eslint-disable-next-line no-console
    init().catch(console.error);
  }, []);

  /**
   * TODO:
   * - Introduce some sort of application loading state
   */

  if (!client) {
    return null;
  }

  return (
    <ApolloClientProvider client={client}>{children}</ApolloClientProvider>
  );
}

ApolloProvider.propTypes = {
  /**
   * Your component tree.
   */
  children: PropTypes.node,
};

export default ApolloProvider;
