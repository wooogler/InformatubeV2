/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState, useRef, useEffect} from 'react';
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
import YoutubePlayer from 'react-native-youtube-iframe';
import CommentItem from './components/CommentItem';
import SystemListHeader from './components/SystemListHeader';
import PopupView from './components/PopupView';

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
const appWidth = Dimensions.get('window').width;

const App = () => {
  const [viewerY, setViewerY] = useState(new Animated.Value(appHeight-200));
  const [videoId, setVideoId] = useState("AVAc1gYLZK0");
  const [opened, setOpened] = useState(false);
  const [time, setTime] = useState("2:02");
  const playerRef = useRef();

  const handlePressOpen = () => {
    setOpened(true);
  }

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.appContainer}>
        <View style={styles.playerContatiner}>
          <YoutubePlayer
            videoId={videoId}
            width={appWidth}
            height={appWidth*9/16}
            ref={playerRef}
          />
        </View>
        <View style={styles.systemListContainer}>
          <FlatList 
            style={styles.systemList}
            ListHeaderComponent={<SystemListHeader handlePressOpen={handlePressOpen} time={time}/>}
            data={commentDummy}
            keyExtractor={item => item.id.toString()}
            renderItem={({item}) => <CommentItem data={item}/>}
          />
          <PopupView opened={opened} setOpened={setOpened}/>
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
    aspectRatio: 16/9,
    width: appWidth,
  },
  systemListContainer: {
    flex:1,
  },
  systemList: {
    backgroundColor: 'grey',
    flex: 1,
  },
});

export default App;
