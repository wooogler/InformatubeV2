/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState, useRef} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  StatusBar,
  ScrollView,
  Image,
  FlatList,
  TextInput,
  Animated,
  Alert,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import CommentItem from './components/CommentItem';
import SystemListHeader from './components/SystemListHeader';

const commentDummy = [
  {
    id: 1,
    userName: 'YANGWOO LEE',
    userImage: 'http://www.meconomynews.com/news/photo/201911/35379_37255_3949.png',
    uploadTime: '21시간 전',
    time: '2:33',
    comment: '데톨은 옥시에서 만든겁니다... 가습기 살균제 사건 잊으셨나요?',
    like: 105,
  },
  {
    id: 2,
    userName: 'gentle guy',
    userImage: 'https://i.insider.com/5ba15375e361c01c008b5cf7?width=2500&format=jpeg&auto=webp',
    uploadTime: '21시간 전',
    time: '1:30',
    comment: '코로나.. 이시국 최대의 피해자...',
    like: 33,
  },
]

const appHeight = Dimensions.get('window').height;

const App = () => {
  const [viewerY, setViewerY] = useState(new Animated.Value(appHeight-200));
  const inputRef = useRef();

  const handlePressOpen =() => {
    Animated.timing(viewerY,{
      toValue:0,
      duration: 500,
    }).start();
    inputRef.current.focus();
  }

  const handlePressClose = () => {
    Animated.timing(viewerY,{
      toValue: appHeight-200,
      duration: 500,
    }).start();
    inputRef.current.blur();
  }

  const animatedStyle = () => {
    return {
      width: '100%',
      height: 300,
      position: 'absolute',
      backgroundColor: 'red',
      top: viewerY,
    }
  }

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.appContainer}>
        <View style={styles.playerContatiner}>
        </View>
        <View style={styles.systemListContainer}>
          <FlatList 
            style={styles.systemList}
            ListHeaderComponent={<SystemListHeader handlePressOpen={handlePressOpen}/>}
            data={commentDummy}
            keyExtractor={item => item.id.toString()}
            renderItem={({item}) => <CommentItem data={item}/>}
          />
          <Animated.View style={animatedStyle()}>
            <View style={styles.headerContainer}>
              <TouchableOpacity>
                <Text style={styles.timeText}>2:12</Text>
              </TouchableOpacity>
              <TextInput
                style={styles.textInput}
                placeholder='키워드 검색...'
                ref={inputRef}
              />
              <TouchableOpacity onPress={handlePressClose}>
                <Text>X</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.mainContainer}>
              
            </ScrollView>
            
          </Animated.View>
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  appContainer: {
    flex:1,
    flexDirection: 'column',
  },
  playerContatiner: {
    backgroundColor: 'black',
    aspectRatio: 16/9,
  },
  systemListContainer: {
    flex:1,
  },
  systemList: {
    backgroundColor: 'grey',
    flex: 1,
  },
  headerContainer: {
    backgroundColor: 'white',
    height: 50,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  mainContainer: {

  },
  timeText: {
    fontSize: 15,
    color: '#1366D4',
    flex: 1,
    marginRight: 5
  },
  textInput: {
    fontSize: 15,
    color: '#606060',
    flex: 10,
  },
});

export default App;
