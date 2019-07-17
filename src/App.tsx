import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloClient } from 'apollo-client';
import { ApolloLink } from 'apollo-link';
import { onError } from 'apollo-link-error';
import { HttpLink } from 'apollo-link-http';
import { RetryLink } from 'apollo-link-retry';
import React, { Component, createContext } from 'react';
import { ApolloProvider } from 'react-apollo';
import './App.css';
import Todos from './components/Todos';
import logo from './logo.svg';

export const OnlineContext = createContext(false);

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: ApolloLink.from([
    onError(({ graphQLErrors, networkError }) => {
      if (graphQLErrors) {
        graphQLErrors.map(({ message, locations, path }) => {
          // tslint:disable-next-line
          console.log(
            `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
          );
          return null;
        });
      }
      if (networkError) {
        // tslint:disable-next-line
        console.log(`[Network error]: ${networkError}`);
      }
    }),
    new RetryLink({ attempts: { max: Infinity } }),
    new HttpLink({
      uri: 'http://localhost:5000/graphql',
    }),
  ]),
});

interface State {
  online: boolean;
}

export default class App extends Component<{}, State> {
  public state = {
    online: window.navigator.onLine,
  };

  public componentDidMount() {
    window.addEventListener('online', this.handleOnline);
    window.addEventListener('offline', this.handleOffline);
  }

  public componentWillUnmount() {
    window.removeEventListener('online', this.handleOnline);
    window.removeEventListener('offline', this.handleOffline);
  }

  public render() {
    const { online } = this.state;
    return (
      <OnlineContext.Provider value={online}>
        <ApolloProvider client={client}>
          <div className="App">
            <header className="App-header">
              <img src={logo} className="App-logo" alt="logo" />
              <p>
                Edit <code>src/App.tsx</code> and save to reload.
              </p>
              <a
                className="App-link"
                href="https://reactjs.org"
                target="_blank"
                rel="noopener noreferrer"
              >
                Learn React
              </a>
              <Todos />
            </header>
          </div>
        </ApolloProvider>
      </OnlineContext.Provider>
    );
  }

  private handleOnline = () => {
    this.setState({ online: true });
  };

  private handleOffline = () => {
    this.setState({ online: false });
  };
}
