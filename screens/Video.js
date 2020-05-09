import React, {useState, useRef, useEffect, useReducer} from 'react';
import {
  View, 
  FlatList,
  StyleSheet,
  Dimensions,
  Text,
} from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';
import {gql, useQuery} from '@apollo/client';
import SystemListHeader from '../components/SystemListHeader';
import CommentItem from '../components/CommentItem';
import AddCommentView from '../components/AddCommentView';
import ShowCommentView from '../components/ShowCommentView';

const VIEW_ALL_COMMENTS = gql`
  {
    comments{
      id
      text
      time
      createdAt
      likeUsers {
        id
      }
      author {
        name
      }
    }
  }
`;

const commentDummy = [
  {
    id: 1,
    userName: 'YANGWOO LEE',
    userImage: 'http://www.meconomynews.com/news/photo/201911/35379_37255_3949.png',
    uploadTime: '21시간 전',
    time: '2:33',
    comment: '데톨은 옥시에서 만든겁니다... 가습기 살균제..',
    url: 'https://namu.wiki/w/%EA%B0%80%EC%8A%B5%EA%B8%B0%20%EC%82%B4%EA%B7%A0%EC%A0%9C%20%EC%82%AC%EB%A7%9D%EC%82%AC%EA%B1%B4',
    like: 105,
  },
  {
    id: 2,
    userName: 'gentle guy',
    userImage: 'https://i.insider.com/5ba15375e361c01c008b5cf7?width=2500&format=jpeg&auto=webp',
    uploadTime: '21시간 전',
    time: '1:30',
    comment: '코로나.. 이시국 최대의 피해자...',
    url: 'http://ncov.mohw.go.kr/',
    like: 33,
  },
]

const appWidth = Dimensions.get('window').width;

const Video = () => {

  const [videoId, setVideoId] = useState("AVAc1gYLZK0");
  const [openedAddView, setOpenedAddView] = useState(false);
  const [openedShowView, setOpenedShowView] = useState(false);
  const [commentData, setCommentData] = useState(null);
  const [comments, setComments] = useState(null);
  const [time, setTime] = useState('0:00');
  const playerRef = useRef();

  useEffect(() => {
    const interval = setInterval(async() => {
      const raw_sec = await playerRef.current.getCurrentTime();

      const raw_ms = Math.floor(raw_sec * 1000);
      const min = Math.floor(raw_ms / 60000);
      const seconds = Math.floor((raw_ms-min*60000)/1000);

      setTime(
        min.toString() +
        ':' +
        seconds.toString().padStart(2,'0')
      );
    }, 100);
    return () => {
      clearInterval(interval);
    }
  }, []);

  const {loading, error, data} = useQuery(VIEW_ALL_COMMENTS);

  useEffect(()=> {
    if(data) {
      setComments(data.comments);
      console.log(data.comments);
    }
  },[data]);

  const handlePressOpen = () => {
    setOpenedAddView(true);
  }

  if(loading) {
    return (<Text>Loading Comments...</Text>);
  }

  if(error) {
    return (<Text>Loading Comments Error!</Text>);
  }

  return (
    <>
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
        ListHeaderComponent={<SystemListHeader handlePressOpen={handlePressOpen} time={time} playerRef={playerRef}/>}
        data={comments}
        keyExtractor={item => item.id}
        renderItem={({item}) => <CommentItem data={item} playerRef={playerRef} setCommentData={setCommentData} setOpenedShowView={setOpenedShowView}/>}
      />
      <AddCommentView opened={openedAddView} setOpened={setOpenedAddView} time={time} playerRef={playerRef}/>
      <ShowCommentView opened={openedShowView} setOpened={setOpenedShowView} data={commentData} playerRef={playerRef}/>
    </View>
    </>
  );
}

const styles = StyleSheet.create({
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
})

export default Video;