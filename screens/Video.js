import React, {useState, useRef, useEffect, useCallback} from 'react';
import {
  View, 
  FlatList,
  StyleSheet,
  Dimensions,
  Text,
} from 'react-native';
import YoutubePlayer, {getYoutubeMeta} from 'react-native-youtube-iframe';
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
      dislikeUsers {
        id
      }
      author {
        id
        name
      }
      imageUrl
      url
    }
  }
`;

const VIEW_ALL_USERS = gql`
  {
    users {
      id
    }
  }
`;

const appWidth = Dimensions.get('window').width;



const Video = () => {

  const [videoId, setVideoId] = useState("BQUz0X4E_9c");
  const [videoMeta, setVideoMeta] = useState(null);
  const [openedAddView, setOpenedAddView] = useState(false);
  const [openedShowView, setOpenedShowView] = useState(false);
  const [commentData, setCommentData] = useState(null);
  const [evalStage, setEvalStage] = useState(true);
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

  

  useEffect(() => {
    getYoutubeMeta(videoId).then(meta => {
      setVideoMeta(meta);
    });
  }, [])

  const {loading, error, data} = useQuery(VIEW_ALL_COMMENTS);
  const userData = useQuery(VIEW_ALL_USERS).data;
  const _refetch = useQuery(VIEW_ALL_COMMENTS).refetch;
  const refetch = useCallback(() => { setTimeout(() => {
    console.log("refetch!")
    _refetch();
  }, 0) }, [_refetch]);

  useEffect(() => {
    if(data) {
      const {comments} = data;
      const {users} = userData;
      let matrix = [];
      comments.forEach((comment) => {
        let row = [];
        for(let i=0;i<users.length;i++) {
          if(comment.likeUsers.find(likeUser => likeUser.id === users[i].id)){
            row.push(1);
          }
          else if(comment.dislikeUsers.find(dislikeUser => dislikeUser.id === users[i].id)){
            row.push(-1);
          } else {
            row.push(0);
          }
        }
        matrix.push(row);
      })
      console.log(matrix);
    }
    
  }, [data])
  
  useEffect(() => {
    if(evalStage === true) {

    }
  }, [evalStage])

  const handlePressOpen = () => {
    setOpenedAddView(true);
  }

  if(loading) {
    return (<Text>Loading Comments...</Text>);
  }

  if(error) {
    return (<Text>Loading Comments Error! {String(error)}</Text>);
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
        ListHeaderComponent={<SystemListHeader handlePressOpen={handlePressOpen} time={time} playerRef={playerRef} commentNumber={data.comments.length} meta={videoMeta}/>}
        data={data.comments}
        keyExtractor={item => item?.id}
        renderItem={({item}) => (
          <CommentItem 
            data={item} 
            layerRef={playerRef} 
            setCommentData={setCommentData} 
            setOpenedShowView={setOpenedShowView} 
            refetch={refetch}
            evalStage={evalStage}
          />
        )}
      />
      <AddCommentView opened={openedAddView} setOpened={setOpenedAddView} time={time} playerRef={playerRef} refetch={refetch}/>
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