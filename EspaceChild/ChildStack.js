import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import ResultatsEnfant from "./EspaceEnfantResultats/ResultatsEnfant";
import DiplomeEnfant from "./EspaceEnfantDiplomes/DiplomeEnfant";
import ExercicesEnfant from "./EspaceEnfantExercices/ExercicesEnfant";
import RecompensesEnfant from "./EspaceEnfantRecompenses/RecompensesEnfant";
import BackPackEnfant from "./EspaceEnfantBackPack/BackPackEnfant";
import EnfantCompte from "./EspaceEnfantCompte/EnfantCompte";
import {Image} from "react-native";
import React from "react";
import {FontAwesome, MaterialIcons} from "@expo/vector-icons";


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
          <Tab.Screen name={'ResultatsEnfant'} component={ResultatsEnfant} options={{
              title: 'Resultats',
              tabBarIcon: () => (
                  <Image
                      source={require('../assets/images/diplomesicon.svg')}
                      style={{ width: 24, height: 24, resizeMode: 'contain' }}
                  />
              ),
          }}/>
          <Tab.Screen name={'DiplomeEnfant'} component={DiplomeEnfant} options={{
              title: 'Diplome',
              tabBarIcon: () => (
                  <Image
                      source={require('../assets/images/diplomesicon.svg')}
                      style={{ width: 24, height: 24, resizeMode: 'contain' }}
                  />
              ),
          }}/>
          <Tab.Screen name={'ExercicesEnfant'} component={ExercicesEnfant} options={{
              title: 'Exercices',
              tabBarIcon: () => (
                  <Image
                      source={require('../assets/images/exercice.svg')}
                      style={{ width: 24, height: 24, resizeMode: 'contain' }}
                  />
              ),
          }}/>
          <Tab.Screen name={'RecompensesEnfant'} component={RecompensesEnfant} options={{
              title: 'Recompenses',
              tabBarIcon: () => (
                  <Image
                      source={require('../assets/images/icons8-récompense-24.png')}
                      style={{ width: 24, height: 24, resizeMode: 'contain' }}
                  />
              ),
          }}/>
          <Tab.Screen name={'EnfantCompte'} component={EnfantCompte} options={{
              title: 'Compte',
              tabBarIcon: () => <FontAwesome name="user" size={24} color="black" />,
          }}/>
      </Tab.Navigator>
  )
}

export default ChildStack