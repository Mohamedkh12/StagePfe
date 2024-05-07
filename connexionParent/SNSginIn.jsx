import Signin from "./Signin";
import MdpOublie from "./MdpOublie";
import CreateCompte from "./CreateCompte";
import AbonnementParent from "../InscriptionParent/AbonnementParent";
import CompteParent from "../InscriptionParent/CompteParent";
import MesEnfants from "../InscriptionParent/MesEnfants";
import InfosPersonnelles from "../InscriptionParent/InfosPersonnelles";
import {NavigationContainer} from "@react-navigation/native";
import Paiement from "../InscriptionParent/Paiement";
import ButtomTabNavigation from "../navigation/ButtomTabNavigation";
import UpdateCompteChild from "../EspaceparentEnfants/UpdateCompteChild";
import AddChild from "../EspaceparentEnfants/AddChild";
import AdminStack from "../EspaceAdmin/AdminStack";
import AdminExercices from "../EspaceAdmin/Exercices/AdminExercices";
import AddExercices from "../EspaceAdmin/Exercices/AddExercices";
import EditExercice from "../EspaceAdmin/Exercices/EditExercice";
import CategoryExercices from "../EspaceAdmin/Exercices/CategoryExercice";
import {createStackNavigator} from "@react-navigation/stack";
import ChildStack from "../EspaceChild/ChildStack";
import React, {useState} from "react";
import BackPackEnfant from "../EspaceChild/EspaceEnfantBackPack/BackPackEnfant";
import ResetPassword from "./ResetPassword";
import CreateCode from "./CreateCode";
const Stack = createStackNavigator();

const SNSginIn = () => {
    const [bloquerRetour, setBloquerRetour] = useState(false);
    return(
          <NavigationContainer independent={true} initialRouteName={'Signin'} screenOptions={{ headerShown: false }}>
              <Stack.Navigator>
                  <Stack.Screen name="Signin" component={Signin} options={{ headerShown: false }}/>
                  <Stack.Screen name={"ChildStack"} component={ChildStack} options={{ headerShown: false }} />
                  <Stack.Screen name={'BackPackEnfant'} component={BackPackEnfant} options={{headerShown: false}}/>
                  <Stack.Screen name="AdminStack" component={AdminStack} options={{ headerShown: false }}/>
                  <Stack.Screen name={'CategoryExercices'} component={CategoryExercices} screenOptions={{ headerShown: false }}/>
                  <Stack.Screen name={'AdminExercices'} component={AdminExercices} options={{ headerShown: false }}/>
                  <Stack.Screen name={'AddExercices'} component={AddExercices} options={{ headerShown: false }}/>
                  <Stack.Screen name={'EditExercice'} component={EditExercice} options={{ headerShown: false }}/>
                  <Stack.Screen name="MdpOublie" component={MdpOublie}  options={{ headerShown: false }}/>
                  <Stack.Screen name="CreateCode" component={CreateCode}  options={{ headerShown: false }}/>
                  <Stack.Screen name="ResetPassword" component={ResetPassword}  options={{ headerShown: false }}/>
                  <Stack.Screen name="CreateCompte" component={CreateCompte}  options={{ headerShown: false }}/>
                  <Stack.Screen name="AbonnementParent" component={AbonnementParent} options={{
                      headerShown: false,
                      gestureEnabled: false, // Bloquer le retour par geste
                       }}/>
                  <Stack.Screen name="CompteParent" component={CompteParent} options={{
                      headerShown: false,
                      gestureEnabled: false,
                  }}/>
                  <Stack.Screen name="Paiement" component={Paiement}  options={{
                      headerShown: false,
                      // Bloquer le retour par geste
                  }}/>
                  <Stack.Screen name="MesEnfants" component={MesEnfants}  options={{
                      headerShown: false,

                  }}/>
                  <Stack.Screen name="InfosPersonnelles" component={InfosPersonnelles}  options={{
                      headerShown: false,
                  }}/>
                  <Stack.Screen name="ButtomTabNavigation" component={ButtomTabNavigation}  options={{
                      headerShown: false,
                  }}/>
                  <Stack.Screen name="UpdateCompteChild" component={UpdateCompteChild} options={{ headerShown: false }}/>
                  <Stack.Screen name="AddChild" component={AddChild} options={{ headerShown: false }}/>
              </Stack.Navigator>
          </NavigationContainer>
  )
}

export default SNSginIn