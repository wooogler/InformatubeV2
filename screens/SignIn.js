import React, {useState, useContext} from 'react';
import {
  View,
  TextInput,
  Button,
} from 'react-native';
import {AuthContext} from '../App';

const SignIn = () => {

  const [name, setName] = useState('');
  const { signIn } = useContext(AuthContext);
  return (
    <View>
      <TextInput 
        placeholder="유저 이름"
        value={name}
        onChangeText={setName}
      />
      <Button 
        title="로그인"
        onPress={() => {
          signIn({name})
        }}
      />
    </View>
  )
}

export default SignIn;