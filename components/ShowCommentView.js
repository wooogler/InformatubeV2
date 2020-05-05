import React, {useEffect, useState} from 'react';
import {
  Animated,
  View,
  StyleSheet,
  Dimensions,
  Text,
  TouchableOpacity,
  Linking,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

Icon.loadFont();
const appHeight = Dimensions.get('window').height;
const appWidth = Dimensions.get('window').width;

const ShowCommentView = ({opened, setOpened, data, playerRef}) => {
  const [min, setMin] = useState(0);
  const [sec, setSec] = useState(0);
  const [viewerY, setViewerY] = useState(new Animated.Value(appHeight-200));

  useEffect(()=> {
    if(data) {
      setMin(parseInt(data.time.split(':')[0]));
      setSec(parseInt(data.time.split(':')[1]));
    }
  }, [data])

  const handlePressTime = () => {
    playerRef.current.seekTo(min*60+sec);
  }

  const animatedStyle = () => {
    return {
      width: '100%',
      height: 600,
      position: 'absolute',
      backgroundColor: 'white',
      top: viewerY,
    }
  }

  useEffect(() => {
    if(opened) {
      Animated.timing(viewerY,{
        toValue:0,
        duration: 500,
      }).start();
    }
    else {
      handlePressClose();
    }
  }, [opened])

  const handlePressClose = () => {
    Animated.timing(viewerY,{
      toValue: appHeight-200,
      duration: 500,
    }).start();
    setOpened(false);
  }

  const handlePressSource = () => {
    Linking.openURL(data.url);
  }

  return (
    <Animated.View style={animatedStyle()}>
      {
        data &&
        <>
          <View style={styles.headerContainer}>
            <Text>
              <Text style={styles.timeText} onPress={handlePressTime}>{data.time} </Text>
              <Text>{data.comment}</Text>
            </Text>
            <TouchableOpacity onPress={handlePressSource}>
              <Text>원본</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handlePressClose}>
              <Icon name='ios-close' size={16}></Icon>
            </TouchableOpacity>
          </View>
          <View style={styles.mainContainer}>
          </View>
        </>
      }
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: 'white',
    height: 50,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  timeText: {
    fontSize: 15,
    color: '#1366D4',
    marginRight: 5,
  },
  mainContainer: {
    width: appWidth,
    height: 600,
  }
})

export default ShowCommentView;