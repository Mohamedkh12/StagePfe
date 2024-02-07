import {Image, SafeAreaView, Text, View} from "react-native";
import styles from "./CreateCompte.styles";

const CreateCompte = () => {
  return(
      <SafeAreaView>
          <View>
              <View >
                  <Image source={require('../assets/logoedidact.png')} />
              </View>
          </View>
          <View>
              <Text>Créons votre compte en quelques clics</Text>
          </View>
      </SafeAreaView>
  )
}

export default CreateCompte