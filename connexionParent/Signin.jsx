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

  const login = () => {
    let identifiantErrorState = false;
    let passwordErrorState = false;
    let messageidentifiantlState = '';
    let messagePasswordState = '';

    if (identifiant === "") {
      identifiantErrorState = true;
      messageidentifiantlState = "Email is required";
    }

    if (password === "") {
      passwordErrorState = true;
      messagePasswordState = "Password is required";
    } else if (password.length < 8) {
      passwordErrorState = true;
      messagePasswordState = "Password must be at least 8 characters";
    }

    setidentifiantError(identifiantErrorState);
    setMessageidentifiant(messageidentifiantlState);
    setPasswordError(passwordErrorState);
    setMessagePassword(messagePasswordState);

    if (identifiantErrorState || passwordErrorState) {
      return;
    }

    setIdentifiant('');
    setPassword('');
    setidentifiantError(false);
    setPasswordError(false);
    setMessageidentifiant('');
    setMessagePassword('');
  };

  const handleLogin = async () => {
    try {
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
        username: identifiant,
        password: password
      });
      await AsyncStorage.setItem('jwtToken', response.data.access_token);
      if (response && response.data.access_token) {
        const userRole=response.data.user.roleId
        console.log("userRole : ",userRole)
        if (userRole === 3) {
          navigation.navigate('ChildStack');
        } else if (userRole === 2) {
          navigation.navigate('ButtomTabNavigation');
        } else {
          console.error('Unknown user role');
        }
      }
    } catch (error) {
      console.error('Error during login:', error);
      if (error.response) {
        console.log('Server responded with:', error.response.data);
        setServerError('Invalid credentials');
      } else if (error.request) {
        console.log('No response received:', error.request);
      } else {
        console.log('Error setting up request:', error.message);
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
                  inputMode={"text"}
                  keyboardType={"email-address"}
                  autoCompleteType={"email"}
                  placeholder={'Enter your email address'}
                  onChange={(e) => setIdentifiant(e.nativeEvent.text)}
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
                  onChange={(e) => setPassword(e.nativeEvent.text)}
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
