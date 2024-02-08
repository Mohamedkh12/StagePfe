import Signin from "./Signin";
import MdpOublie from "./MdpOublie";
import {NavigationContainer} from "@react-navigation/native";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import CreateCompte from "../InscriptionParent/CreateCompte";
import AbonnementParent from "../InscriptionParent/AbonnementParent";


const Stack=createNativeStackNavigator();
const SNSginIn = () => {
  return(
      <NavigationContainer independent={true} >
          <Stack.Navigator>
              <Stack.Screen name="Signin"
                            component={Signin}
                            options={{
                                headerShown: false,
                            }}
              />
              <Stack.Screen name="MdpOublie"
                            component={MdpOublie}
                            options={{
                                headerShown: false,
                            }}
              />
              <Stack.Group>
                  <Stack.Screen name={"CreateCompte"}
                                component={CreateCompte}
                                options={{
                                    headerShown: false,
                                }}
                  />
                  <Stack.Screen name={'AbonnementParent'}
                                component={AbonnementParent}
                                options={{headerShown:false}}
                  />
              </Stack.Group>
          </Stack.Navigator>
      </NavigationContainer>
  )
}

export default SNSginIn