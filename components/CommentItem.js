import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
} from 'react-native';

const CommentItem = ({data}) => {
    return (
      <View style={styles.commentItemContainer}>
        <View style={styles.commentImageContainer}>
          <Image
            style={styles.profileImage}
            source={{
              uri: data.userImage
            }}
          />
        </View>
        <View style={styles.commentTextContainer}>
          <Text>
            <Text>{data.userName} · </Text>
            <Text>{data.uploadTime}</Text>
          </Text>
          <Text>
            <Text style={styles.timeText}>{data.time} </Text>
            <Text>{data.comment}</Text>
          </Text>
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
    }
  });

  export default CommentItem;