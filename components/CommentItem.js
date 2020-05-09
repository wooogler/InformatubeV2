import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

Icon.loadFont();

const CommentItem = ({data, playerRef, setCommentData, setOpenedShowView}) => {

  const minsec = data.time.split(':');
  const [min, setMin] = useState(parseInt(minsec[0]));
  const [sec, setSec] = useState(parseInt(minsec[1]));

  const handlePressTime = () => {
    playerRef.current.seekTo(min*60+sec);
  }
  
  const handlePressBrowser = () => {
    setCommentData(data);
    setOpenedShowView(true);
  }

  return (
    <View style={styles.commentItemContainer}>
      <View style={styles.commentImageContainer}>
        <Image
          style={styles.profileImage}
          source={{
            uri: 'http://www.meconomynews.com/news/photo/201911/35379_37255_3949.png'
          }}
        />
      </View>
      <View style={styles.commentTextContainer}>
        <Text>
          <Text>{data.author.name} · </Text>
          <Text>'1시간 전'</Text>
        </Text>
        <Text>
          <Text style={styles.timeText} onPress={handlePressTime}>{data.time} </Text>
          <Text>{data.text}</Text>
        </Text>
        <View style={styles.commentInteractionContainer}>
          <TouchableOpacity style={styles.commentLikeButton}>
            <Icon name='ios-thumbs-up' color="#909090" size={16}></Icon>
          </TouchableOpacity>
          <Text>{data.likeUsers.length}</Text>
          <TouchableOpacity style={styles.commentDislikeButton}>
            <Icon name='ios-thumbs-down' color="#909090" size={16}></Icon>
          </TouchableOpacity>
          <TouchableOpacity onPress={handlePressBrowser} style={styles.commentWebpageButton}>
            <Icon name='ios-browsers' color="#909090" size={16}></Icon>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  profileImage:{
    height: 40,
    width: 40,
    borderRadius: 20,
    marginRight: 15,
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
  },
  commentWebpageButton: {
    marginLeft: 30,
  }
});

export default CommentItem;