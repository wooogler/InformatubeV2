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
  KeyboardAvoidingView,
  Picker,
} from 'react-native';
import WebView from 'react-native-webview';
import ViewShot from "react-native-view-shot";
import { SketchCanvas } from '@terrylinla/react-native-sketch-canvas';
import Modal from 'react-native-modal';
import TimePicker from './TimePicker';

const appHeight = Dimensions.get('window').height;
const appWidth = Dimensions.get('window').width;

const AddCommentView = ({opened, setOpened, time, playerRef}) => {
  const [viewerY, setViewerY] = useState(new Animated.Value(appHeight-200));
  const [isTimePicker, setIsTimePicker] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [mode, setMode] = useState('hide');
  const [strokeColor, setStrokeColor] = useState('red');
  const [strokeWidth, setStrokeWidth] = useState(2);
  const [tool, setTool] = useState('pen');
  const [imageUri, setImageUri] = useState('');
  const [comment, setComment] = useState('');
  const canvasRef = useRef();
  const inputRef = useRef();
  const commentRef = useRef();
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
      console.log(uri);
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
  
  const handlePressSave =() => {
    setMode('save');
    setTimeout(() => {
      commentRef.current?.focus();
    },10)
  }

  const handleSubmit = () => {
    setMode('webview');
  }

  const handleSubmitComment =() => {
    Animated.timing(viewerY,{
      toValue: appHeight-200,
      duration: 500,
    }).start();
    commentRef.current?.blur();
    setOpened(false);
    setMode('hide');
  }

  const handlePressBackdrop = () => {
    setMode('captured');
  }

  return (
    <Animated.View style={animatedStyle()}>
      <View style={styles.headerContainer}>
        <TimePicker
          time={time}
          playerRef={playerRef}
        />
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
          <ViewShot ref={viewShotRef}>
            <WebView options={{ format: "jpg", quality: 0.9 }}
              style={styles.webView}
              source={{ uri: `https://www.google.com/search?q=${keyword}`}}
            />
          </ViewShot>
        }
      </ScrollView>
      {
        (mode=='captured' || mode=='save') &&
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
            <TouchableOpacity onPress={handlePressSave}>
              <Text>저장</Text>
            </TouchableOpacity>
          </View>
        </View>
      }
      <Modal 
        isVisible={mode=='save'}
        avoidKeyboard={true}
        onBackdropPress={handlePressBackdrop}
        style={{margin: 0}}
      >
        <View style={styles.commentInputView}>
          <TimePicker
            time={time}
            playerRef={playerRef}
          />
          <TextInput
            onChangeText={(text) => {
              setComment(text);
            }}
            value={comment}
            ref={commentRef}
            style={styles.textInput}
            onSubmitEditing={handleSubmitComment}
          />
          <TouchableOpacity onPress={handleSubmitComment}>
            <Text>제출</Text>
          </TouchableOpacity>
        </View>
      </Modal>
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
    backgroundColor: '#F5F6FA',
    display: 'flex',
    flexDirection: "row",
    justifyContent: 'space-around',
    paddingTop: 20
  },
  imageView: {
    position: 'absolute',
    bottom: -50,
    width: appWidth,
    height: 600,
    backgroundColor: 'black',
  },
  commentInputView: {
    width: appWidth,
    backgroundColor: 'white',
    height: 50,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    margin : 0,
    position: 'absolute',
    bottom: 0,
  },
});

export default AddCommentView;