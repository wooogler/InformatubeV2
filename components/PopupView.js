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
  Image,
} from 'react-native';
import WebView from 'react-native-webview';
import ViewShot from "react-native-view-shot";
import { SketchCanvas } from '@terrylinla/react-native-sketch-canvas';

const appHeight = Dimensions.get('window').height;
const appWidth = Dimensions.get('window').width;

const PopupView = ({opened, setOpened}) => {
  const [viewerY, setViewerY] = useState(new Animated.Value(appHeight-200));
  const [keyword, setKeyword] = useState('');
  const [mode, setMode] = useState('hide');
  const [strokeColor, setStrokeColor] = useState('red');
  const [strokeWidth, setStrokeWidth] = useState(2);
  const [tool, setTool] = useState('pen');
  const [imageUri, setImageUri] = useState('');
  const canvasRef = useRef();
  const inputRef = useRef();
  const viewShotRef = useRef();

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
    setMode('hide');
  }
  
  const handlePressCapture = () => {
    viewShotRef.current.capture().then(uri => {
      console.log(uri);
      setMode('captured');
      setImageUri(uri);
    })
  }

  const handlePressPen =() => {
    setStrokeColor('red');
    setStrokeWidth(2)
    setTool('pen');
  }

  const handlePressHighlighter =() => {
    setStrokeColor('#FFFF3399');
    setStrokeWidth(10)
    setTool('highlighter');
  }

  const handlePressEraser =() => {
    setStrokeColor('#00000000');
    setStrokeWidth(10);
    setTool('eraser');
  }

  const handlePressUndo = () => {
    canvasRef.current.undo();
  }

  const handleSubmit = () => {
    setMode('webview');
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
        {
          mode=='hide' ? 
          <TouchableOpacity onPress={handleSubmit}>
            <Text>검색</Text>
          </TouchableOpacity>
          : mode =='webview' ?
          <TouchableOpacity onPress={handlePressCapture}>
            <Text>캡처</Text>
          </TouchableOpacity>
          : mode == 'captured' ?
          <TouchableOpacity onPress={handleSubmit}>
            <Text>취소</Text>
          </TouchableOpacity> 
          : 
          <Text></Text>
        }
        <TouchableOpacity onPress={handlePressClose}>
          <Text>X</Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.mainContainer}>
        {
          mode == 'hide' ?
          <View>
            <Text>hide</Text>
          </View>
          :
          mode == 'webview' || mode == 'captured' ?
          <ViewShot ref={viewShotRef}>
            <WebView options={{ format: "jpg", quality: 0.9 }}
              style={styles.webView}
              source={{ uri: `https://www.google.com/search?q=${keyword}`}}
            />
          </ViewShot>
          :
          <Text>Error!</Text>
        }
      </ScrollView>
      {
        mode=='captured' &&
        <View>
          <View style={styles.imageView}>
            <View style={{ flex: 1, flexDirection: 'row' }}>
              <SketchCanvas
                style={{ flex: 1 }}
                strokeColor={strokeColor}
                strokeWidth={strokeWidth}
                localSourceImage={{
                  filename: imageUri,
                  mode: 'AspectFill',
                }}
                ref={canvasRef}
              />
            </View>
          </View>
          <View style={styles.highlightToolsView}>
            <TouchableOpacity onPress={handlePressPen}>
              <Text>펜</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handlePressHighlighter}>
              <Text>형광펜</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handlePressEraser}>
              <Text>지우개</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handlePressUndo}>
              <Text>되돌리기</Text>
            </TouchableOpacity>
          </View>
        </View>
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
  },
  capturedImage: {
    width: appWidth,
    height:600,
  },
  highlightToolsView: {
    position: 'absolute',
    bottom: -50,
    width: appWidth,
    height: 100,
    backgroundColor: '#F5F6FA'
  },
  imageView: {
    position: 'absolute',
    bottom: -50,
    width: appWidth,
    height: 600,
    backgroundColor: 'blue',
  },
});

export default PopupView;