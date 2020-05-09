/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {createContext, useReducer, useEffect, useMemo, useContext} from 'react';
import 'react-native-gesture-handler'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import {
  SafeAreaView,
  StyleSheet,
  StatusBar,
  Text,
  Button,
} from 'react-native';
import gql from 'graphql-tag';
import AsyncStorage from '@react-native-community/async-storage';
import {useMutation} from '@apollo/client';
import Video from './screens/Video';
import SignIn from './screens/SignIn';
import Splash from './screens/Splash';


console.disableYellowBox = true;

export const AuthContext = createContext();

const Stack = createStackNavigator();

const LOG_IN = gql`
  mutation LogIn($name: String!) {
    login (name: $name) {
      token
      user {
        id
        name
      }
    }
  }
`;

const App = () => {
  const [login, {data} ] = useMutation(LOG_IN);

  const [state, dispatch] = useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            userToken: action.token,
            isLoading: false,
          };
        case 'SIGN_IN':
          return {
            ...prevState,
            isSignout: false,
            userToken: action.token,
            me: action.me,
          };
        case 'SIGN_OUT':
          return {
            ...prevState,
            isSignout: true,
            userToken: null,
            me: null,
          };
      }
    },
    {
      isLoading: true,
      isSignout: false,
      userToken: null,
      me: null,
    }
  )

  useEffect(() => {
    const bootstrapAsync = async () => {
      let userToken;
      try {
        userToken = await AsyncStorage.getItem('userToken');
        console.log('usertoken',userToken);
      } catch(e) {
        console.error('No stored token', e);
      }
      dispatch({type: 'RESTORE_TOKEN', token: userToken});
    }
    bootstrapAsync();
  }, [])

  useEffect(() => {
    if(data) {
      AsyncStorage.setItem('userToken',data.login.token);
      dispatch({type: 'SIGN_IN', token: data.login.token});
      console.log(data.login.token);
    }
  }, [data])

  const authContext = useMemo(
    () => ({
      signIn: async ({name}) => {
        console.log('signIn');
        login({variables: {name}})
      },
      signOut: async () => {
        await AsyncStorage.removeItem('userToken');
        dispatch({type: 'SIGN_OUT'});
      },
    }),
    []
  )

  if (state.isLoading) {
    return <Text>loading...</Text>
  }

  return (
    <NavigationContainer>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.appContainer}>
        <AuthContext.Provider value={authContext}>
          <Stack.Navigator>
            {
              state.isLoading ? 
              <Stack.Screen name="Splash" component={Splash} /> :
              state.userToken == null ? 
              <Stack.Screen
                name='SignIn'
                component={SignIn}
                options = {{
                  title: 'Sign In',
                  animationTypeForReplace: state.isSignout ? 'pop' : 'push',
                }}
              /> :
              <Stack.Screen 
                name='Video' 
                component={Video}
                options={({navigation}) => ({
                  headerRight: () => (
                    <Button
                      onPress={() => {
                        AsyncStorage.removeItem('userToken');
                        dispatch({type: 'SIGN_OUT'});}
                      }
                      title="Sign Out"
                    />
                  )
                })}
              />
            }
          </Stack.Navigator>
        </AuthContext.Provider>
      </SafeAreaView>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  appContainer: {
    flex:1,
    flexDirection: 'column',
  },
});

export default App;
