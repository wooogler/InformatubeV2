import React, {useEffect, useState} from 'react';
import {
  Animated,
  View,
  StyleSheet,
  Dimensions,
  Text,
  TouchableOpacity,
  Linking,
  Image,
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
    console.log(data);
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
            <View>
              <Text style={styles.timeText} onPress={handlePressTime}>{data.time} </Text>
            </View>
            <View style={{width:250}}>
              <Text numberOfLines={1} ellipsizeMode='tail'>{data.text}</Text>
            </View>
            <TouchableOpacity style={{marginLeft: 15}} onPress={handlePressSource}>
              <Text style={{color: '#1366D4'}}>원본</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{marginLeft: 20}}onPress={handlePressClose}>
              <Text>닫기</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.mainContainer}>
            <Image
              style={{width: appWidth, height: 600}}
              source={{
                uri: `http://localhost:4000/${data.imageUrl}`
              }}
            />
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