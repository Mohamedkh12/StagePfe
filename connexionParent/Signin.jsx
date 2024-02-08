import {Button, Image, SafeAreaView, Text, TextInput, TouchableOpacity, View} from "react-native";
import React,{useState} from "react";
import styles from "./signin.styles";
import {MaterialIcons} from "@expo/vector-icons";
const Signin = ({navigation}) => {
  const [identifiant, setIdentifiant] = useState('');
  const [password, setPassword] = useState('');
  const [showpassword, setShowPassword] = useState(false);

  return(
      <SafeAreaView style={styles.container}>
        <View style={{alignItems:"center"}} >
          <View style={styles.imagecontainer}>
            <Image source={require('../assets/logoedidact.png')} style={styles.image}/>
          </View>
          <View style={styles.inputwrapper}>
            <Text style={styles.text}>Identifiant*</Text>
            <TextInput
                style={styles.input}
                inputMode={"email"}
                keyboardType={"email-address"}
                autoCompleteType={"username"}
                placeholder={'Enter your email address'}
                onChange={(e) => setIdentifiant(e.nativeEvent.text)}
                value={identifiant}
            />
          </View>
          <View>
            <Text style={styles.text}>Password*</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter your Password"
                maxLength={8}
                textContentType={"password"}
                autoComplete={"password"}
                keyboardType={"visible-password"}
                secureTextEntry={showpassword}
                onChange={(e) => setPassword(e.nativeEvent.text)}
                value={password}
            />
            <MaterialIcons
                style={styles.icon}
                name={showpassword ? "visibility-off" : "visibility"}
                onPress={() => setShowPassword(!showpassword)}
            />
          </View>
          <TouchableOpacity style={styles.buttonwrapper} onPress={() => {}}>
            <Text style={styles.buttontext}>JE ME CONNECTE</Text>
          </TouchableOpacity>
          <View>
            <TouchableOpacity onPress={()=>navigation.navigate('CreateCompte')}>
              <Text style={styles.lientext}>Pas encore de compte ?</Text>
            </TouchableOpacity>
          </View>
          <View>
            <TouchableOpacity onPress={()=>navigation.navigate('MdpOublie')}>
              <Text style={styles.lientext}>Mot de passe oublié ?</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
  )
}

export default Signin