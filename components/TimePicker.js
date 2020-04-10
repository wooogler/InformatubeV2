import React, {useState} from 'react';
import {StyleSheet, View, Picker, TouchableOpacity, Dimensions, Text, Button} from 'react-native';
import Modal from 'react-native-modal';

const appWidth = Dimensions.get('window').width;

const TimePicker = ({time, playerRef}) => {
  const minsec = time.split(':');
  const [min, setMin] = useState(parseInt(minsec[0]));
  const [sec, setSec] = useState(parseInt(minsec[1]));
  const [isVisible, setIsVisible] = useState(false);
  const mins = [...Array(60).keys()];
  const secs = [...Array(60).keys()];
  
  const handlePressTime = () => {
    setIsVisible(true);
  }

  const handleSubmitTime = () => {
    playerRef.current?.seekTo(min*60+sec);
    setIsVisible(false);
  }
  const handlePressBackdrop =() => {
    setIsVisible(false);
  }

  return (
    <>
      <TouchableOpacity onPress={handlePressTime}>
        <Text style={styles.timeText}>{time}</Text>
      </TouchableOpacity>
      <Modal
        isVisible={isVisible}
        onBackdropPress={handlePressBackdrop}
      >
        <View style={styles.timePickerView}>
          <Picker
            selectedValue={min}
            style={{height: 50, width: 150}}
            onValueChange={(itemValue, itemIndex) => setMin(itemValue)}
            style={styles.picker}
          >
            {
              mins.map(item => <Picker.item value={item} label={String(item)}/>)
            }
          </Picker>
          <Text>분</Text>
          <Picker
            selectedValue={sec}
            style={{height: 50, width: 150}}
            onValueChange={(itemValue, itemIndex) => setSec(itemValue)}
            style={styles.picker}
          >
            {
              secs.map(item => <Picker.item value={item} label={String(item)}/>)
            }
          </Picker>
          <Text>초</Text>
          <Button title='선택' onPress={handleSubmitTime}/>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  timePickerView : {
    backgroundColor: 'white',
    height: 200,
    flexDirection: "row",
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  timeText: {
    fontSize: 15,
    color: '#1366D4',
    marginRight: 5
  },
  picker: {
    flex: 1,
    margin: 20,
  }
})


export default TimePicker;