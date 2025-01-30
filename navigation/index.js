import {  StyleSheet} from 'react-native'
import * as React from 'react'
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import TabNavigator from './TabNavigator';
const Stack = createNativeStackNavigator();
const Navigation = () => {
  return (
    <NavigationContainer>
     <Stack.Navigator screenOptions={{headerShown:false}}>
      
 
        <Stack.Screen name="Tab" component={TabNavigator} />
      </Stack.Navigator>

      </NavigationContainer>
  )
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor:'#F8FEFE'    
    },
  });
export default Navigation