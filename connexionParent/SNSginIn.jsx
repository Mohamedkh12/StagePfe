import Signin from "./Signin";
import MdpOublie from "./MdpOublie";
import {NavigationContainer} from "@react-navigation/native";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import CreateCompte from "../InscriptionParent/CreateCompte";


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
              <Stack.Screen name={"CreateCompte"}
                            component={CreateCompte}
                            options={{
                                headerShown: false,
                            }}
              />
          </Stack.Navigator>
      </NavigationContainer>
  )
}

export default SNSginIn