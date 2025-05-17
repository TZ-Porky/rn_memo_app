import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './src/pages/HomeScreen';
import NoteScreen from './src/pages/NoteScreen';
import DrawingScreen from './src/pages/DrawingScreen';

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false, animation:'fade' }} />
        <Stack.Screen name="NotePage" component={NoteScreen} options={{ headerShown: false, animation:'slide_from_right' }} />
        <Stack.Screen name="DrawPage" component={DrawingScreen} options={{ headerShown: false, animation: 'slide_from_right'}} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
