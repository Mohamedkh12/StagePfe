import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import AdminExercices from "./Exercices/AdminExercices" ;
import ListChildParent from "./ListUsers/ListChildParent";
import {FontAwesome} from "@expo/vector-icons";
import {Image, Platform} from "react-native";
import CategoryExercices from "./Exercices/CategoryExercice";
import ParentProfil from "../EspaceParentProfil/ParentProfil";
import AdminProfile from "./Profile/AdminProfile";
import {createStackNavigator} from "@react-navigation/stack";
import AddExercices from "./Exercices/AddExercices";
import EditExercice from "./Exercices/EditExercice";
import React from "react";
import ShowExercice from "./Exercices/ShowExercice";

import SubCategory from "./Exercices/SubCategory";
import ClassScreen from "./Exercices/ClassScreen";
import CategoryScreen from "./Exercices/CategoryScreen";
import WebViewScreen from "./Exercices/WebViewScreen";


const screenOptions = {
    tabBarShowLabel: true,
    tabBarHideOnKeyboard:true,
    headerShown: false,
    tabBarStyle:{
        backgroundColor:'#00000029',
        position:"absolute",
        bottom:0,
        left:0,
        right:0,
        elevation:0,
        height:Platform.OS === "ios" ? 90 : 60
    },
    tabBarLabelStyle: {
        fontFamily:'regular',
        fontSize:12,
        color:'#707070',
        lineHeight:15,
        textAlign:'center',
        marginBottom:Platform.OS === "ios" ? 15: 10,

    }
}
const Tab=createBottomTabNavigator()
const Stack = createStackNavigator();

const ExercicesStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="ClassScreens" component={ClassScreen} options={{headerShown: false, gestureEnabled: false,}}/>
            <Stack.Screen name="CategoryScreen" component={CategoryScreen} options={{headerShown: false, gestureEnabled: false,}}/>
            <Stack.Screen name="SubCategory" component={SubCategory} options={{headerShown: false, gestureEnabled: false,}}/>
            <Stack.Screen name="AdminExercices" component={AdminExercices} options={{headerShown: false, gestureEnabled: false,}}/>
        </Stack.Navigator>
    )
}
const AdminStack = () => {
  return(
      <Tab.Navigator screenOptions={screenOptions}>
          <Tab.Screen name={'ExercicesStack'} component={ExercicesStack} options={{title:'Exercices',
              tabBarIcon: () => (
                  <Image
                      source={require('../assets/images/apprentissage-en-ligne.png')}
                      style={{ width: 24, height: 24, resizeMode: 'contain' }}
                  />
              )}}
         />
          <Tab.Screen name={'ShowExercice'} component={ShowExercice} options={{title:'ShowExercice',
              tabBarIcon:()=>{
                  return <Image
                      // source={require('../assets/images/multiple-users-silhouette.png')}
                      style={{ width: 24, height: 24, resizeMode: 'contain' }}
                  />
              }}}/>
          <Tab.Screen name={'Profile'} component={ListChildParent} options={{title:'Users',
              tabBarIcon:()=>{
                  return <Image
                      source={require('../assets/images/multiple-users-silhouette.png')}
                      style={{ width: 24, height: 24, resizeMode: 'contain' }}
                  />
              }}}/>
          <Tab.Screen
              name="AdminProfile"
              component={AdminProfile}
              options={{
                  title: 'Compte Admin',
                  tabBarIcon: () => <FontAwesome name="user" size={24} color="black" />,
              }}
          />
      </Tab.Navigator>
  )
}

export default AdminStack

