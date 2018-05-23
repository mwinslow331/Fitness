import React, {Component} from 'react'
import { View, TouchableOpacity, Text, Platform, StyleSheet} from 'react-native'
import { getMetricMetaInfo, timeToString, getDailyReminderValue } from '../utils/helpers'
import Sliders from './Sliders'
import Steppers from './Steppers'
import DateHeader from './DateHeader'
import {Ionicons} from '@expo/vector-icons'
import TextButton from './TextButton'
import { submitEntry, removeEntry } from '../utils/api'
import {connect} from 'react-redux'
import {addEntry} from '../actions'
import {white, purple, blue} from '../utils/colors'

function SubmitBtn ({ onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={Platform.OS === 'ios' ? styles.iosSubmitBtn : styles.androidSubmitBtn}>
        <Text style={styles.submitBtnTxt}>SUBMIT</Text>
    </TouchableOpacity>
  )
}

class AddEntry extends Component {
  state = {
    run: 0,
    swim: 0,
    bike: 0,
    sleep: 0,
    eat: 0,
  }
  increment = (metric) => {
    const { max, step } = getMetricMetaInfo(metric)

    this.setState((state) => {
      const count = state[metric] + step

      return {
        ...state,
        [metric]: count > max ? max : count
      }
    })
  }
  decrement = (metric) => {
    this.setState((state) => {
      const count = state[metric] - getMetricMetaInfo(metric).step

      return {
        ...state,
        [metric]: count < 0 ? 0 : count,
      }
    })
  }
  slide = (metric, value) => {
    this.setState(() => ({
      [metric]: value,
    }))
  }

  handleSubmit = () => {
    const key = timeToString()
    const entry = this.state

    this.props.dispatch(addEntry({
      [key]: entry,
    }))

    this.setState(() => ({
      run: 0,
      swim: 0,
      bike: 0,
      sleep: 0,
      eat: 0,
    }))

    // Navigate to Home

    submitEntry({key, entry})

    // Clear local Notifications
  }
  reset = () => {
    const key = timeToString()

    this.props.dispatch(addEntry({
      [key]: getDailyReminderValue()
    }))

    // Return to Home

    removeEntry(key)
  }

  render() {
    const metaInfo = getMetricMetaInfo()

    if (this.props.alreadyLogged) {
      return (
        <View style={styles.logged}>
          <Ionicons
            name={Platform.OS === 'ios' ? 'ios-happy-outline' : 'md-happy'}
            size={100}
          />
          <Text adjustsFontSizeToFit={true} numberOfLines={1}>You already logged your information today!</Text>
          <TextButton onPress={this.reset} style={{padding: 10}}>
            Reset
          </TextButton>
        </View>
      )
    }
    return (
      <View style={styles.container}>
        <DateHeader date={(new Date()).toLocaleDateString()}/>
        {Object.keys(metaInfo).map((key) => {
          const { getIcon, type, ...rest } = metaInfo[key]
          const value = this.state[key]

          return (
            <View key={key} style={styles.row}>
              {getIcon()}
              {type === 'slider'
                ? <Sliders
                    value={value}
                    onChange={(value) => this.slide(key, value)}
                    {...rest}
                  />
                : <Steppers
                    value={value}
                    onIncrement={() => this.increment(key)}
                    onDecrement={() => this.decrement(key)}
                    {...rest}
                  />
                }
            </View>
          )
        })}
        <SubmitBtn onPress={this.handleSubmit}/>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1, //takes up all the space
    padding: 20,
    backgroundColor: white,
  },
  row: {
    flexDirection: 'row',
    flex: 1, //takes up all the space
    alignItems: 'center',
  },
  iosSubmitBtn: {
    backgroundColor: purple,
    padding: 10,
    borderRadius: 7,
    height: 45,
    marginLeft: 40,
    marginRight: 40,
  },
  androidSubmitBtn: {
    backgroundColor: purple,
    alignSelf: 'flex-end',
    borderRadius: 2,
    height: 45,
    paddingLeft: 30,
    paddingRight: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitBtnTxt: {
    color: white,
    fontSize: 22,
    textAlign: 'center',
  },
  logged: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 15,
    marginRight: 40,
  },
})

function mapStateToProps(state){
  const key = timeToString()

  return {
    alreadyLogged: state[key] && typeof state[key].today === 'undefined'
  }
}

export default connect(mapStateToProps)(AddEntry)
