import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import React from "react";
import { Platform } from "react-native";
import ChildProfile from "./profile/ChildProfile";
import BackPackEnfantNavigator from "./EspaceEnfantBackPack/BackPackEnfant";
import { useIsFocused } from '@react-navigation/native';

const Tab = createBottomTabNavigator();

const ChildStack = ({ route }) => {
    return (
        <Tab.Navigator
            screenOptions={{
                tabBarShowLabel: true,
                tabBarHideOnKeyboard: true,
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: '#00000029',
                    position: 'absolute',
                    bottom:0,
                    left: 0,
                    right: 0,
                    elevation: 0,
                    height: Platform.OS === "ios" ? 70 : 60,
                },
                tabBarLabelStyle: {
                    fontFamily: 'regular',
                    fontSize: 12,
                    color: '#707070',
                    lineHeight: 15,
                    textAlign: 'center',
                    marginBottom: Platform.OS === "ios" ? 0 : 10,
                    bottom: 0
                },
            }}
        >
            <Tab.Screen
                name={'BackPackEnfantNavigator'}
                component={BackPackEnfantNavigator}
                options={({ route }) => ({
                    headerShown: false,
                    title: 'BackPack',
                    tabBarIcon: () => (
                        <MaterialIcons name="backpack" size={24} color="black" />
                    ),
                 
                })}
            />
            <Tab.Screen
                name={'ChildProfile'}
                component={ChildProfile}
                options={{
                    title: 'Compte Admin',
                    tabBarIcon: () => <FontAwesome name="user" size={24} color="black" />,
                }}
            />
        </Tab.Navigator>
    );
};

export default ChildStack;
