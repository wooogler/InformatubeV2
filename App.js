/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  StatusBar,
  Image,
  FlatList,
  TextInput,
} from 'react-native';

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

const ListHeader = () => {
  return (
    <>
      <View style={styles.infoContainer}>
        <Text style={styles.videoTitle}>
          Video Title
        </Text>
        <Text style={styles.videoUploaderName}>
          Video Uploader
        </Text>
      </View>
      <View style={styles.commentsHeaderContainer}>
        <Text style={styles.commentsText}>댓글 141</Text>
        <View style={styles.commentInputContainer}>
          <Image
            style={styles.profileImage}
            source={{
              uri: 'https://cdn.business2community.com/wp-content/uploads/2017/08/blank-profile-picture-973460_640.png'
            }}
          />
          <Text style={styles.timeInput}>2:12</Text>
          <TextInput 
            style={styles.textInput}
            placeholder='키워드 검색...'
          />
        </View>
      </View>
    </>
  )
}

const CommentItem = ({data}) => {
  return (
    <View>
      <Text>{data.comment}</Text>
    </View>
  )
}

const App = () => {
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.appContainer}>
        <View style={styles.playerContatiner}>

        </View>
        <FlatList 
          style={styles.systemList}
          ListHeaderComponent={ListHeader}
          data={commentDummy}
          keyExtractor={item => item.id}
          renderItem={({item}) => <CommentItem data={item}/>}
        />
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
  systemList: {
    backgroundColor: 'grey',
    flex: 1,
  },
  infoContainer: {
    backgroundColor: 'red',
    aspectRatio: 4,
    padding: 15,
  },
  videoTitle: {
    fontSize: 18,
    marginBottom: 10,
  },
  videoUploaderName: {
    fontSize: 20,
  },
  commentsHeaderContainer: {
    padding: 15,
    backgroundColor: 'white',
    height: 100,
  },
  commentsText: {
    fontSize: 20,
    marginBottom: 10,
  },
  commentInputContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImage:{
    height: 40,
    width: 40,
    borderRadius: 20,
    marginRight: 15,
  },
  timeInput: {
    fontSize: 15,
    color: '#1366D4',
    marginRight: 5,
  },
  textInput: {
    fontSize: 15,
    color: '#606060',
  }
});

export default App;
