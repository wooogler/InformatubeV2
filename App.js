/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {createContext, useReducer, useEffect, useMemo} from 'react';
import 'react-native-gesture-handler'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import {
  SafeAreaView,
  StyleSheet,
  StatusBar,
} from 'react-native';
import Video from './screens/Video';
import SignIn from './screens/SignIn';
import Splash from './screens/Splash';
import AsyncStorage from '@react-native-community/async-storage';

console.disableYellowBox = true;

const AuthContext = createContext();
const Stack = createStackNavigator();

const App = () => {

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
          };
        case 'SIGN_OUT':
          return {
            ...prevState,
            isSignout: true,
            userToken: null,
          };
      }
    },
    {
      isLoading: true,
      isSignout: false,
      userToken: null,
    }
  )
  useEffect(() => {
    const bootstrapAsync = async () => {
      let userToken;
      try {
        userToken = await AsyncStorage.getItem('userToken');
      } catch(e) {
        console.error(e);
      }
      
      //여기서 서버와 통신하여 맞는 토큰인지 확인

      dispatch({type: 'RESTORE_TOKEN', token: userToken});
    }

    bootstrapAsync();
  }, [])

  export const authContext = useMemo(
    () => ({
      signIn: async data => {
        //데이터(username)를 보내고 서버에서 토큰 받기
        //sign in 실패에 대한 에러 처리하기
        //토큰을 받으면 asyncStorage에 저장하기
        dispatch({type: 'SIGN_IN', token: 'dummy-auth-token'});
      },
      signOut: () => dispatch({type: 'SIGN_OUT'}),
      signUp: async data => {
        //마찬가지로 유저 정보 보내고 토큰 받아오기
        //sign up 실패에 대한 에러 처리하기
        //토큰 받으면 마찬가지로 asyncstorage에 저장하기
        dispatch({type: 'SIGN_IN', token: 'dummy-auth-token'})
      }
    }),
    []
  )

  if (isLoading) {
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
              <Stack.Screen name='Video' component={Video}/>
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
