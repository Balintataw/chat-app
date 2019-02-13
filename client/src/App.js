/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { ApolloClient } from 'apollo-client';
import { ApolloLink } from 'apollo-link';
import { ApolloProvider } from 'react-apollo';
import { composeWithDevTools } from 'redux-devtools-extension';
import { createHttpLink } from 'apollo-link-http';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import { ReduxCache, apolloReducer } from 'apollo-cache-redux';
import ReduxLink from 'apollo-link-redux';
import { onError } from 'apollo-link-error';;

import AppWithNavigationState from './routes';
// import AppWithNavigationState, {
    // navigationReducer,
    // navigationMiddleware,
// } from './routes';


const URL = 'localhost:8080'

const store = createStore(
    combineReducers({
        apollo: apolloReducer,
        // nav: navigationReducer,
    }),
    {}, // initial state
    composeWithDevTools(
        // applyMiddleware(navigationMiddleware),
    ),
);

const cache = new ReduxCache({ store });

const reduxLink = new ReduxLink(store);

const errorLink = onError(errors => {
    console.log(errors);
});

const httpLink = createHttpLink({ uri: `http://${URL}` });

const link = ApolloLink.from([
    reduxLink,
    errorLink,
    httpLink
]);

export const client = new ApolloClient({
    link, 
    cache
});

export default class App extends Component {
    render() {
        return (
            <ApolloProvider client={client}>
                <Provider store={store}>
                    <AppWithNavigationState onNavigationStateChange={null} />
                </Provider>
            </ApolloProvider>
        );
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
