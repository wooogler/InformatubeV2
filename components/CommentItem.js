import React, {useState, useContext} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {gql, useMutation, useQuery} from '@apollo/client';
import moment from 'moment';

const stc = require('string-to-color');

Icon.loadFont();

const LIKE = gql`
  mutation Like ($commentId: Int!) {
    like (commentId: $commentId) {
      id
    }
  }
`

const CANCEL_LIKE = gql`
  mutation CancelLike ($commentId: Int!) {
    cancelLike (commentId: $commentId) {
      id
    }
  }
`

const DISLIKE = gql`
  mutation Dislike ($commentId: Int!) {
    dislike (commentId: $commentId) {
      id
    }
  }
`

const CANCEL_DISLIKE = gql`
  mutation CancelDislike ($commentId: Int!) {
    cancelDislike (commentId: $commentId) {
      id
    }
  }
`

const ME = gql`
  {
    me {
      id
    }
  }
`

let username = '';
const CommentItem = ({data, playerRef, setCommentData, setOpenedShowView, refetch, evalStage}) => {
  username = data.author.name;
  const me = useQuery(ME).data?.me;
  const minsec = data.time.split(':');
  const [min, setMin] = useState(parseInt(minsec[0]));
  const [sec, setSec] = useState(parseInt(minsec[1]));
  
  const [liked, setLiked] = useState(data.likeUsers.filter(item => item?.id === me?.id).length === 1);
  const [disliked, setDisliked] = useState(data.dislikeUsers.filter(item => item?.id === me?.id).length === 1);
  const [like] = useMutation(LIKE);
  const [cancelLike] = useMutation(CANCEL_LIKE);
  const [dislike] = useMutation(DISLIKE);
  const [cancelDislike] = useMutation(CANCEL_DISLIKE);
  const nameColor = {
    backgroundColor: stc(data.author.name),
  }

  const handlePressTime = () => {
    playerRef.current.seekTo(min*60+sec);
  }
  
  const handlePressBrowser = () => {
    setCommentData(data);
    setOpenedShowView(true);
  }

  const handlePressLike = () => {
    if(liked == true) {
      setLiked(false);
      cancelLike({variables: {
        commentId: parseInt(data.id),
      }})
    }
    else {
      setLiked(true);
      like({variables: {
        commentId: parseInt(data.id),
      }})
    }
    refetch();
  }

  const handlePressDislike = () => {
    if(disliked == true) {
      setDisliked(false);
      cancelDislike({variables: {
        commentId: parseInt(data.id),
      }})
    }
    else {
      setDisliked(true);
      dislike({variables: {
        commentId: parseInt(data.id),
      }})
    }
    refetch();
  }

  return (
    <View style={styles.commentItemContainer}>
      <View style={styles.commentImageContainer}>
        <View style={[styles.profileIcon, nameColor]}>
          <Text style={styles.profileText}>{data.author.name.charAt(0)}</Text>
        </View>
      </View>
      <View style={styles.commentTextContainer}>
        <Text>
          <Text>{data.author.name} · </Text>
          <Text>{moment(data.createdAt).fromNow()}</Text>
        </Text>
        <Text>
          <Text style={styles.timeText} onPress={handlePressTime}>{data.time} </Text>
          <Text>{data.text}</Text>
        </Text>
        <View style={styles.commentInteractionContainer}>
          {
          me?.id !== data?.author.id && <><TouchableOpacity 
            style={styles.commentLikeButton}
            onPress={handlePressLike}
          >
            <Icon name='ios-thumbs-up' color={liked ? "#1366D4" : "#909090"} size={16}></Icon>
          </TouchableOpacity>
          <Text>{data.likeUsers.length}</Text>
          <TouchableOpacity 
            style={styles.commentDislikeButton}
            onPress={handlePressDislike}
          >
            <Icon name='ios-thumbs-down' color={disliked ? "#1366D4" : "#909090"} size={16}></Icon>
          </TouchableOpacity></>
          }
          <TouchableOpacity onPress={handlePressBrowser} style={styles.commentWebpageButton}>
            <Icon name='ios-browsers' color="#909090" size={16}></Icon>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  profileIcon: {
    height: 40,
    width: 40,
    borderRadius: 20,
    marginRight: 15,
  },
  profileText: {
    color: 'white',
    textAlign: 'center',
    lineHeight: 40,
    fontSize: 20,
  },
  timeText: {
    fontSize: 15,
    color: '#1366D4',
    marginRight: 5,
  },
  commentItemContainer: {
    backgroundColor: 'white',
    padding: 15,
    borderTopColor: '#DBDBDB',
    borderTopWidth: 1,
    flexDirection: 'row',
  },
  commentImageContainer: {
    // backgroundColor: 'red',
  },
  commentTextContainer: {
    // backgroundColor: '#606060', 
    flex: 1,
  },
  commentInteractionContainer: {
    marginTop: 10,
    flexDirection: 'row',
  },
  commentLikeButton: {
    marginRight: 10,
  },
  commentDislikeButton: {
    marginLeft: 20,
    marginRight: 30,
  },
  commentWebpageButton: {
    
  }
});

export default CommentItem;