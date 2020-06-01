import React, { useEffect, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Button,
} from 'react-native';
import TimePicker from './TimePicker';
import {gql, useQuery, useMutation} from '@apollo/client';
const stc = require('string-to-color');

const ME = gql`
  {
    me {
      id
      name
    }
  }
`

const SORT_WITH_CF = gql`
  mutation ($likeId: [Int!], $dislikeId: [Int!]) {
    sortWithCF(likeId: $likeId, dislikeId: $dislikeId)
  }
`

const SystemListHeader = ({
  handlePressOpen, time, playerRef, commentNumber, meta, 
  evalStage, setEvalStage, dislikeId, likeId, sortedNum, getComments}) => {
  const me = useQuery(ME).data?.me;
  const [sortWithCF] = useMutation(SORT_WITH_CF);

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

  const handlePressFinish = () => {
    setEvalStage(false);
    sortWithCF({variables: {likeId, dislikeId}});
    getComments({variables: {sortedNum}});
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
        <View style={styles.commentNumberContainer}>
          <Text style={styles.commentsText}>댓글 {commentNumber}개</Text>
          {evalStage && 
            <>
              <Text>평가 단계</Text>
              <TouchableOpacity 
                onPress={handlePressFinish}
                disabled={!likeId && !dislikeId}
              >
                <Text 
                  style={[styles.finishButton, (!likeId && !dislikeId) && {color: '#606060'}]}
                >완료</Text>
              </TouchableOpacity>
            </>
          }
        </View>
        {
          !evalStage && 
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
        }
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
  commentNumberContainer: {
    flexDirection: "row",
    justifyContent: "space-between"
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
  finishButton: {
    color: '#1366D4',
  }
});

export default SystemListHeader;