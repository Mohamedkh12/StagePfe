import {Image, SafeAreaView, Text, TextInput, TouchableOpacity, View,StyleSheet} from "react-native";
import React, {useState} from "react";
import styles from "./MdpOublie.styles";

const MdpOublie = ({navigation}) => {
    const [identifiant, setIdentifiant] = useState('');
  return(
      <SafeAreaView style={styles.container}>
              <View style={{alignItems:"center"}} >
                  <View style={styles.imagecontainer}>
                      <Image source={require('../assets/logoedidact.png')} style={styles.image} />
                  </View>
                  <View style={{marginTop:20}}>
                      <Text style={styles.H1}>Mot de passe oublié</Text>
                  </View>
                  <View style={{ marginTop: 20, marginLeft: 25, marginRight: 25 }}>
                      <View style={{ marginBottom: 10 }}>
                          <Text style={styles.text}>Entrez votre email pour réinitialiser votre mot de passe</Text>
                      </View>
                  </View>
                  <View style={styles.inputwrapper}>
                      <Text style={styles.text}>Email</Text>
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
                  <TouchableOpacity style={styles.buttonwrapper} onPress={() => {}}>
                      <Text style={styles.buttontext}>ENVOYER</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={()=>{}}>
                      <Text style={styles.lientext}>Connexion</Text>
                  </TouchableOpacity>
              </View>
      </SafeAreaView>
  )
}

export default MdpOublie

