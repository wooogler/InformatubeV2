import React, {useState, useRef, useEffect, useCallback} from 'react';
import {
  View, 
  FlatList,
  StyleSheet,
  Dimensions,
  Text,
} from 'react-native';
import YoutubePlayer, {getYoutubeMeta} from 'react-native-youtube-iframe';
import {gql, useQuery, useLazyQuery} from '@apollo/client';
import SystemListHeader from '../components/SystemListHeader';
import CommentItem from '../components/CommentItem';
import AddCommentView from '../components/AddCommentView';
import ShowCommentView from '../components/ShowCommentView';
import { Picker } from '@react-native-community/picker';

export const VIEW_COMMENTS = gql`
  query ViewComments ($sortNum: Float! = 1.0) {
    viewComments(sortNum: $sortNum) {
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
      sort
    }
  }
`;

const VIEW_RANDOM_COMMENTS = gql`
  query ViewRandomComments {
    viewRandomComments {
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

const appWidth = Dimensions.get('window').width;

const Video = () => {

  const [videoId, setVideoId] = useState("BQUz0X4E_9c");
  const [videoMeta, setVideoMeta] = useState(null);
  const [openedAddView, setOpenedAddView] = useState(false);
  const [openedShowView, setOpenedShowView] = useState(false);
  const [commentData, setCommentData] = useState(null);
  const [comments, setComments] = useState(null);
  const [evalStage, setEvalStage] = useState(true);
  const [likeId, setLikeId] = useState([]);
  const [dislikeId, setDislikeId] = useState([]);
  const [sortedNum, setSortedNum] = useState(1.0);
  const [time, setTime] = useState('0:00');
  const [refresh, setRefresh] = useState(0);
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

  const {data, loading, error, refetch} = useQuery(VIEW_COMMENTS, {
    variables: {sortedNum},
    notifyOnNetworkStatusChange: true,
  });
  const {data: randomData, loading: randomLoading, error: randomError, refetch: randomRefetch} = useQuery(VIEW_RANDOM_COMMENTS);

  useEffect(() => {
    getYoutubeMeta(videoId).then(meta => {
      setVideoMeta(meta);
    });
  }, [])

  useEffect(() => {
    console.log('loading', loading);
  }, [loading])

  useEffect(() => {
    if(evalStage === true){
      setComments(randomData?.viewRandomComments);
    }
  }, [randomData])

  useEffect(() => {
    if(evalStage === false) {
      setComments(data?.viewComments);
    }
  }, [data])

  useEffect(() => {
    if(evalStage===false) {
      setTimeout(() => {
        refetch();
        console.log(data?.viewComments);
        console.log(sortedNum);
        setComments(data?.viewComments);
        setRefresh(state => state+1);
      }, 50);
    }
  }, [evalStage, sortedNum])

  const handlePressOpen = () => {
    setOpenedAddView(true);
  }

  if(randomLoading) {
    return (<Text>Loading Random Comments...</Text>);
  }

  if(randomError) {
    return (<Text>Loading Random Comments Error! {String(randomError)}</Text>);
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
    {
      comments &&
      <View style={styles.systemListContainer}>
        {loading ?
          <Text>Loading</Text> :
          <FlatList 
          style={styles.systemList}
          ListHeaderComponent={
            <SystemListHeader 
              handlePressOpen={handlePressOpen} 
              time={time} playerRef={playerRef} 
              commentNumber={comments.length} 
              meta={videoMeta}
              evalStage={evalStage}
              setEvalStage={setEvalStage}
              dislikeId={dislikeId}
              likeId={likeId}
              setSortedNum={setSortedNum}
              refetch={refetch}
            />}
          data={comments}
          extraData={refresh}
          keyExtractor={(item,index) => index}
          renderItem={({item: comment}) => (
            <CommentItem
              data={comment} 
              layerRef={playerRef} 
              setCommentData={setCommentData} 
              setOpenedShowView={setOpenedShowView} 
              evalStage={evalStage}
              setLikeId={setLikeId}
              setDislikeId={setDislikeId}
              refetch={refetch}
            />
          )}
        />
        }
        
        <AddCommentView 
          opened={openedAddView} 
          setOpened={setOpenedAddView} 
          time={time} 
          playerRef={playerRef} 
          refetch={refetch}
        />
        <ShowCommentView 
          opened={openedShowView}
          setOpened={setOpenedShowView} 
          data={commentData}
          playerRef={playerRef}
        />
      </View>
    }
    
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