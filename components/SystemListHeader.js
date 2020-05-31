import React, { useEffect, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import TimePicker from './TimePicker';
import {gql, useQuery} from '@apollo/client';
const stc = require('string-to-color');

const ME = gql`
  {
    me {
      id
      name
    }
  }
`

const SystemListHeader = ({handlePressOpen, time, playerRef, commentNumber, meta}) => {
  const me = useQuery(ME).data?.me;

  const _refetch = useQuery(ME).refetch;
  const refetch = useCallback(() => { setTimeout(() => {
    console.log("refetch!")
    _refetch();
  }, 0) }, [_refetch]);

  useEffect(() => {
    refetch();
  }, [])
  const nameColor = {
    backgroundColor: me && stc(me.name),
  }
  return (
    <>
      <View style={styles.infoContainer}>
        <Text style={styles.videoTitle}>
          {meta?.title}
        </Text>
        <Text style={styles.videoUploaderName}>
          {meta?.author_name}
        </Text>
      </View>
      <View style={styles.commentsHeaderContainer}>
        <Text style={styles.commentsText}>댓글 {commentNumber}개</Text>
        <View style={styles.commentInputContainer}>
          <View style={[styles.profileIcon, nameColor]}>
            <Text style={styles.profileText}>{me?.name.charAt(0)}</Text>
          </View>
          <TimePicker
            time={time}
            playerRef={playerRef}
          />
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
    aspectRatio: 5,
    padding: 15,
  },
  videoTitle: {
    fontSize: 20,
    marginBottom: 10,
  },
  videoUploaderName: {
    fontSize: 15,
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
  textInput: {
    fontSize: 15,
    color: '#606060',
  },
});

export default SystemListHeader;