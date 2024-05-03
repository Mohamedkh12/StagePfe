import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import BackPackEnfant from "./EspaceEnfantBackPack/BackPackEnfant";
import { MaterialIcons } from '@expo/vector-icons';
import React from "react";


const Tab = createBottomTabNavigator();

const ChildStack = () => {
    return(
        <Tab.Navigator
            screenOptions={{
                tabBarShowLabel: true,
                tabBarHideOnKeyboard: true,
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: '#00000029',
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    elevation: 0,
                    height: 70,
                },
                tabBarLabelStyle: {
                    fontFamily: 'regular',
                    fontSize: 12,
                    color: '#707070',
                    lineHeight: 15,
                    textAlign: 'center',
                    marginBottom: 10,
                },
            }}>
            <Tab.Screen name={'BackPackEnfant'} component={BackPackEnfant}
                          options={{headerShown: false,
                              title: 'BackPack',
                              tabBarIcon: () => (
                                  <MaterialIcons name="backpack" size={24} color="black" />
                              ),
                          }} />
        </Tab.Navigator>
    )
}


export default ChildStack