import React from 'react'
import { View, Text, Slider, StyleSheet } from 'react-native'
import {gray} from '../utils/colors'

export default function Sliders ({ max, unit, step, value, onChange }) {
  return (
    <View style={styles.container}>
      <Slider
        style={{flex: 1}}
        step={step}
        value={value}
        maximumValue={max}
        minimumValue={0}
        onValueChange={onChange}
      />
      <View style={styles.metricCounter}>
        <Text style={{fontSize: 24, textAlign: 'center'}}>{value}</Text>
        <Text style={{fontSize: 18, color: gray}}>{unit}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create ({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  metricCounter: {
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
  }
})
