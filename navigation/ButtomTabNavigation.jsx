import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { Image, Platform, StyleSheet } from 'react-native';
import Enfants from '../EspaceparentEnfants/Enfants';
import ParentProfil from '../EspaceParentProfil/ParentProfil';
import BackPackNavigator from '../BackPack/BackPack';
import CategoryList from '../EspaceParentExercices/CategoryList';
import {createStackNavigator} from "@react-navigation/stack";
import ListExercices from "../EspaceParentExercices/ListExercice";
import React from "react";
import IndexBackPack from "../BackPack/IndexBackPack";
import SubCategoryParents from "../EspaceParentExercices/SubCategoryParents"

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const ParentExercicesStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="CategoryList" component={CategoryList} options={{headerShown: false}}/>
            <Stack.Screen name="SubCategoryParents" component={SubCategoryParents} options={{headerShown: false}}/>
        </Stack.Navigator>
    );
};
const AppNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={{
                tabBarShowLabel: true,
                tabBarHideOnKeyboard: true,
                headerShown: false,
                tabBarStyle: styles.tabBarStyle,
                tabBarLabelStyle: styles.tabBarLabelStyle,
            }}
        >
            <Tab.Screen
                name="ParentExercicesStack"
                component={ParentExercicesStack}
                options={{
                    title: 'Exercices',
                    tabBarIcon: () => (
                        <Image
                            source={require('../assets/images/apprentissage-en-ligne.png')}
                            style={{ width: 24, height: 24, resizeMode: 'contain' }}
                        />
                    ),
                }}
            />
            <Tab.Screen
                name="BackPackNavigator"
                component={BackPackNavigator}
                options={{
                    title: 'BackPack',
                    tabBarIcon: () => (
                        <MaterialIcons name="backpack" size={24} color="black" style={styles.icon} />
                    ),
                }}
            />
            <Tab.Screen
                name="Enfants"
                component={Enfants}
                options={{
                    title: 'Enfants',
                    tabBarIcon: () => (
                        <MaterialIcons name="child-care" size={24} color="black" style={styles.icon} />
                    ),
                }}
            />
            <Tab.Screen
                name="ParentProfil"
                component={ParentProfil}
                options={{
                    title: 'Profile',
                    tabBarIcon: () => (
                        <FontAwesome name="user" size={24} color="black" style={styles.icon} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
};

const styles = StyleSheet.create({
    tabBarStyle: {
        backgroundColor: '#00000029',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        elevation: 0,
        height: Platform.OS === "ios" ? 70 : 50,
        paddingBottom: Platform.OS === "ios" ? 12 : 0,
    },
    tabBarLabelStyle: {
        fontFamily: 'regular',
        fontSize:  Platform.OS === "ios" ? 12 : 10,
        color: '#707070',
        lineHeight: 15,
        textAlign: 'center',
        marginBottom: Platform.OS === "ios" ? 7 : 5,
        marginLeft: Platform.OS === "android" ? -10: -12,
    },
    icon: {
        width: 24,
        height: 24,
        resizeMode: 'contain',
        marginVertical: Platform.OS === "android" ? -10 : -14,
        marginHorizontal: Platform.OS === "android" ? -10 : 12,
    },
});

export default AppNavigator;
