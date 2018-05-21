import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { FontAwesome, Entypo} from '@expo/vector-icons'

export default function Steppers({value, onIncrement, onDecrement, max, step, unit}) {
  return (
    <View style={{flexDirection: 'row'}}>
      <TouchableOpacity
        onPress={onDecrement}>
        <FontAwesome name='minus' size={30} color={'black'}/>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={onIncrement}>
        <FontAwesome name='plus' size={30} color={'black'}/>
      </TouchableOpacity>
      <View style={{right: 0}}>
        <Text>{value}</Text>
        <Text>{unit}</Text>
      </View>
    </View>
  )
}
