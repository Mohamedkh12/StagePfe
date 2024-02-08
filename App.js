import { StyleSheet, Text, View } from 'react-native';
import {NavigationContainer} from "@react-navigation/native";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {useFonts} from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import {useCallback} from "react";
import SNSginIn from "./connexionParent/SNSginIn";
import Signup from "./InscriptionParent/Signup";
const Stack=createNativeStackNavigator();
export default function App() {
    const [fontsLoaded]=useFonts({
        bold:require("./fonts/Montserrat-Bold.ttf"),
        regular:require("./fonts/Montserrat-Regular.ttf"),
        medium:require("./fonts/Montserrat-Medium.ttf"),
        italic:require("./fonts/Montserrat-Italic.ttf"),
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
      <NavigationContainer onLayout={onLayoutRootView}>
          <Stack.Navigator>
              <Stack.Screen name="SNSginIn" component={SNSginIn} options={{headerShown:false}}/>
              <Stack.Screen name={"Signup"} component={Signup} options={{headerShown:false}} />
          </Stack.Navigator>
      </NavigationContainer>

  );
}

