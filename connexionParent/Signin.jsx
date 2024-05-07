import React, { useState } from "react";
import { Image, KeyboardAvoidingView, SafeAreaView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { axiosProvider } from "../http/httpService";
import styles from "./signin.styles";

const Signin = ({ navigation }) => {
  const [identifiant, setIdentifiant] = useState('');
  const [password, setPassword] = useState('');
  const [showpassword, setShowPassword] = useState(true);
  const [passwordError, setPasswordError] = useState(false);
  const [identifiantError, setidentifiantError] = useState(false);
  const [messagePassword, setMessagePassword] = useState('');
  const [messageidentifiant, setMessageidentifiant] = useState('');
  const [serverError, setServerError] = useState('');

  const handleLogin = async () => {
    try {
      setPasswordError(false);
      setidentifiantError(false);
      setMessagePassword('');
      setMessageidentifiant('');
      setServerError('');

      if (identifiant === 'admin' && password === 'admin') {
        const authAdmin = await axiosProvider.post('admin/loginAdmin',{
          username:'admin',
          password:'admin'
        });
        await AsyncStorage.setItem('TokenAdmin', authAdmin.data.tokenAdmin);
        console.log(authAdmin.data)
        navigation.navigate('AdminStack');
        return;
      }
      const response = await axiosProvider.post('auth/login', {
        email: identifiant,
        password: password
      });
      await AsyncStorage.setItem('jwtToken', response.data.access_token);
      if (response && response.data.access_token) {
        const userRole=response.data.user.roleId
        console.log("userRole : ",userRole)
        if (userRole === 3) {
          navigation.navigate('ChildStack');
        } if (userRole === 2) {
          navigation.navigate('ButtomTabNavigation');
        } if(userRole ===1){
          await AsyncStorage.setItem('TokenAdmin', response.data.tokenAdmin);
          console.log(response.data)
          navigation.navigate('AdminStack');
        }
        setIdentifiant('');
        setPassword('');
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setidentifiantError(true);
        setMessageidentifiant("Email incorrect");
        setPasswordError(true);
        setMessagePassword("Mot de passe incorrect");
        return;
      } else {
        setServerError('Email ou Mot de passe est incorrect.');
      }
    }
  };

  return (
      <KeyboardAvoidingView style={styles.container} enabled behavior={'padding'}>
        <SafeAreaView>
          <View style={{ alignItems: "center" }}>
            <View style={styles.imagecontainer}>
              <Image source={require('../assets/logoedidact.png')} style={styles.image} />
            </View>
            <View style={styles.inputwrapper}>
              <Text style={styles.text}>Identifiant*</Text>
              <TextInput
                  style={styles.input}
                  keyboardType="email-address"
                  inputMode="email"
                  autoCompleteType="email"
                  placeholder={'Enter your email address'}
                  onChange={(e) => {
                    setIdentifiant(e.nativeEvent.text);
                    setidentifiantError(false);
                    setMessageidentifiant('');
                    setServerError('');
                  }}
                  value={identifiant}
              />
              {identifiantError && <Text style={{ color: 'red' }}>{messageidentifiant}</Text>}
            </View>
            <View>
              <Text style={styles.text}>Password*</Text>
              <TextInput
                  style={styles.input}
                  placeholder="Enter your Password"
                  minLength={8}
                  textContentType={"password"}
                  autoComplete={"password"}
                  keyboardType={"visible-password"}
                  secureTextEntry={showpassword}
                  onChange={(e) => {
                    setPassword(e.nativeEvent.text);
                    setPasswordError(false);
                    setMessagePassword('');
                    setServerError('');
                  }}
                  value={password}
              />
              <MaterialIcons
                  style={styles.icon}
                  name={showpassword ? "visibility-off" : "visibility"}
                  onPress={() => setShowPassword(!showpassword)}
              />
              {passwordError && <Text style={{ color: 'red' }}>{messagePassword}</Text>}
            </View>
            {serverError ? <Text style={{ color: 'red' }}>{serverError}</Text> : null}
            <TouchableOpacity style={styles.buttonwrapper} onPress={handleLogin}>
              <Text style={styles.buttontext}>JE ME CONNECTE</Text>
            </TouchableOpacity>
            <View>
              <TouchableOpacity onPress={() => navigation.navigate('CreateCompte')}>
                <Text style={styles.lientext}>Pas encore de compte ?</Text>
              </TouchableOpacity>
            </View>
            <View>
              <TouchableOpacity onPress={() => navigation.navigate('MdpOublie')}>
                <Text style={styles.lientext}>Mot de passe oublié ?</Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
  )
}

export default Signin;
