import React, { useEffect, useState, useCallback } from 'react';
import { NavigationContainer } from "@react-navigation/native";
import {createStackNavigator} from "@react-navigation/stack";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import SNSginIn from "./connexionParent/SNSginIn";
import ButtomTabNavigation from "./navigation/ButtomTabNavigation";
import AdminStack from "./EspaceAdmin/AdminStack";
import ChildStack from "./EspaceChild/ChildStack";
import {axiosProvider} from "./http/httpService";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Stack = createStackNavigator();

const App = ({navigation}) => {
    const [fontsLoaded] = useFonts({
        'regular': require("./fonts/Montserrat-Regular.ttf"),
        'bold': require("./fonts/Montserrat-Bold.ttf"),
        'medium': require("./fonts/Montserrat-Medium.ttf"),
        'italic': require("./fonts/Montserrat-Italic.ttf"),
    });

    const onLayoutRootView = useCallback(async () => {
        if (fontsLoaded) {
            console.log("fonts loaded");
            await SplashScreen.hideAsync();
        }
    }, [fontsLoaded]);

    useEffect(() => {
        const loadFontsAndHideSplash = async () => {
            if (fontsLoaded) {
                console.log("fonts loaded");
                await SplashScreen.hideAsync();
            }
        };

        loadFontsAndHideSplash();
    }, [fontsLoaded]);

    if (!fontsLoaded) {
        console.log("no fonts loaded");
        return null;
    }

    return (
        <NavigationContainer onLayout={onLayoutRootView}>
            <Stack.Navigator initialRouteName={'SNSginIn'}>
                <Stack.Screen name="SNSginIn" component={SNSginIn} options={{ headerShown: false }} />
                <Stack.Screen name="ButtomTabNavigation" component={ButtomTabNavigation} options={{ headerShown: false,gestureEnabled: false, }} />
                <Stack.Screen name="AdminStack" component={AdminStack} options={{ headerShown: false,gestureEnabled: false, }} />
                <Stack.Screen name={"ChildStack"} component={ChildStack} options={{ headerShown: false,gestureEnabled: false, }} />
            </Stack.Navigator>

        </NavigationContainer>
    );
}

export default App;
