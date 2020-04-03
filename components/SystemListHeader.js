import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  Alert,
  TouchableOpacity,
} from 'react-native';

const SystemListHeader = ({handlePressOpen, time}) => {
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
          <TouchableOpacity>
            <Text style={styles.timeText}>{time}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handlePressOpen}
          >
            <Text
              style={styles.textInput}
            >키워드 검색...</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  infoContainer: {
    backgroundColor: 'white',
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
    borderTopColor: '#DBDBDB',
    borderTopWidth: 1,
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
  timeText: {
    fontSize: 15,
    color: '#1366D4',
    marginRight: 5,
  },
  textInput: {
    fontSize: 15,
    color: '#606060',
  },
});

export default SystemListHeader;