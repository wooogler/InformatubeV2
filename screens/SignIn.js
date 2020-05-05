import React, {useState, useContext} from 'react';
import {
  View,
  TextInput,
  Button,
} from 'react-native';
import {AuthContext} from '../App';

const SignIn = () => {

  const [username, setUsername] = useState('');
  const {signIn} = useContext(AuthContext)
  return (
    <View>
      <TextInput 
        placeholder="유저 이름"
        value={username}
        onChangeText={setUsername}
      />
      <Button 
        title="로그인"
        onPress={() => {
          signIn({username})
        }}
      />
    </View>
  )
}

export default SignIn;