import { StyleSheet, Text, View } from 'react-native';
import {NavigationContainer} from "@react-navigation/native";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {useFonts} from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import {useCallback} from "react";
import SNSginIn from "./connexionParent/SNSginIn";
const Stack=createNativeStackNavigator();
export default function App() {
    const [fontsLoaded]=useFonts({
        bold:require("./fonts/Montserrat-Bold.ttf"),
        regular:require("./fonts/Montserrat-Regular.ttf"),
        meduim:require("./fonts/Montserrat-Medium.ttf"),
    })

    const onLayoutRootView = useCallback(async () => {
        if (fontsLoaded) {
            await SplashScreen.hideAsync();
        }
    }, [fontsLoaded]);
    if(!fontsLoaded){
        return null
    }
  return (
      <NavigationContainer>
          <Stack.Navigator>
              <Stack.Screen name="SNSginIn" component={SNSginIn} options={{headerShown:false}}/>
          </Stack.Navigator>
      </NavigationContainer>

  );
}

