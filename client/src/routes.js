// very broken by react navigation 3

// import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { NavigationActions, createStackNavigator, createBottomTabNavigator, createAppContainer } from 'react-navigation';
import {
    createReduxContainer,
//   createReduxBoundAddListener,
    createReactNavigationReduxMiddleware,
} from 'react-navigation-redux-helpers';
import { Text, View, StyleSheet } from 'react-native';
import { connect } from 'react-redux';

import Groups from './screens/groups';
import Messages from './screens/messages';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    tabText: {
        color: '#777',
        fontSize: 10,
        justifyContent: 'center',
    },
    selected: {
        color: 'blue',
    },
});

const TestScreen = title => () => (
    <View style={styles.container}>
        <Text> {title} </Text>
    </View>
);

// tabs in main screen
const MainScreenNavigator = createBottomTabNavigator({
    Chats: { screen: Groups },
    Settings: { screen: TestScreen('Settings') },
}, {
    initialRouteName: 'Chats',
});

const AppNavigator = createStackNavigator({
    Main: { screen: MainScreenNavigator },
    Messages: { screen: Messages }
}, {
    mode: 'modal'
});

// reducer initialization code
const initialState=AppNavigator.router.getStateForAction(NavigationActions.init({
	index: 0,
	actions: [
        NavigationActions.navigate({
            routeName: 'Main',
        }),
	],
}));

export const navigationReducer = (state = initialState, action) => {
    console.log(AppNavigator.router)
    const nextState = AppNavigator.router.getStateForAction(action, state);
    // Simply return the original `state` if `nextState` is null or undefined.
    return nextState || state;
};
    
// Note: createReactNavigationReduxMiddleware must be run before createReduxBoundAddListener
export const navigationMiddleware = createReactNavigationReduxMiddleware(
    "root",
    state => state.nav,
);

// const addListener = createReduxBoundAddListener("root");
// const addListener = createReduxContainer("root");

class AppWithNavigationState extends Component {
    render() {
        return (
            <AppNavigator navigation={{
                dispatch: this.props.dispatch,
                state: this.props.nav,
                // addListener,
            }} />
        );
    }
}
const mapStateToProps = state => ({
    nav: state.nav,
});

export default createAppContainer(AppNavigator);