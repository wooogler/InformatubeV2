import React, {useState, useEffect, useRef} from 'react';
import {
  StyleSheet,
  Dimensions,
  View,
  Text,
  Alert,
  TouchableOpacity,
  ScrollView,
  Animated,
  TextInput,
} from 'react-native';
import WebView from 'react-native-webview';
import ViewShot from "react-native-view-shot";

const appHeight = Dimensions.get('window').height;
const appWidth = Dimensions.get('window').width;

const PopupView = ({opened, setOpened}) => {
  const [viewerY, setViewerY] = useState(new Animated.Value(appHeight-200));
  const [keyword, setKeyword] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const inputRef = useRef();
  const viewShotRef = useRef();

  const animatedStyle = () => {
    return {
      width: '100%',
      height: 600,
      position: 'absolute',
      backgroundColor: 'red',
      top: viewerY,
    }
  }

  useEffect(() => {
    if(opened) {
      Animated.timing(viewerY,{
        toValue:0,
        duration: 500,
      }).start();
      inputRef.current.focus();
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
    inputRef.current.blur();
    setOpened(false);
  }
  
  const handlePressCapture = () => {
    viewShotRef.current.capture().then(uri => {
      console.log(uri);
    })
  }

  const handleSubmit = () => {
    setIsSubmitted(true);
  }

  return (
    <Animated.View style={animatedStyle()}>
      <View style={styles.headerContainer}>
        <TouchableOpacity>
          <Text style={styles.timeText}>2:12</Text>
        </TouchableOpacity>
        <TextInput
          style={styles.textInput}
          placeholder='키워드 검색...'
          ref={inputRef}
          onChangeText={(text) => {
            setKeyword(text);
          }}
          value={keyword}
          onSubmitEditing={handleSubmit}
        />
        <TouchableOpacity onPress={handlePressCapture}>
          <Text>캡처</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handlePressClose}>
          <Text>X</Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.mainContainer}>
        {
          isSubmitted &&
          <ViewShot ref={viewShotRef}>
            <WebView options={{ format: "jpg", quality: 0.9 }}
              style={styles.webView}
              source={{ uri: `https://www.google.com/search?q=${keyword}`}}
            />
          </ViewShot>
          
        }
      </ScrollView>
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
  mainContainer: {

  },
  timeText: {
    fontSize: 15,
    color: '#1366D4',
    flex: 1,
    marginRight: 5
  },
  textInput: {
    fontSize: 15,
    color: '#606060',
    flex: 10,
  },
  webView: {
    width: appWidth,
    height: 600,
  }
});

export default PopupView;