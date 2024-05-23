import {SafeAreaView, Text, TextInput, View, Image, Alert, TouchableOpacity, ScrollView} from "react-native";
import React, {useState} from "react";
import {axiosProvider} from "../http/httpService";
import styles from "./signin.styles";
import {MaterialIcons} from "@expo/vector-icons";

const ResetPassword = ({route,navigation}) => {
    const [password, setPassword] = useState('');
    const [showpassword, setShowPassword] = useState(true);
    const {code} = route.params;
    const handelForgotPassword = async () => {
        try {
            const response = await axiosProvider.post('mailer/resetPassword', {
                newPassword: password,
                code:code,
            });
            navigation.navigate('Signin');
            console.log(response.data);
        } catch (error) {
            Alert.alert(error);
        }
    }
    return (
        <ScrollView style={styles.container}>
            <SafeAreaView style={styles.content}>
                <View style={{ alignItems: "center" }}>
                    <View style={styles.imagecontainer}>
                        <Image source={require('../assets/logoedidact.png')} style={styles.image} />
                    </View>
                    <View style={{ marginTop: 30 }}>
                        <Text style={styles.H1}>changer mot de passe</Text>
                    </View>
                    <View>
                        <View style={{ marginTop: 40 }}>
                            <Text style={styles.text}>Mot de passe*</Text>
                            <TextInput
                                style={styles.input}
                                onChangeText={(text) => setPassword(text)}
                                value={password}
                                secureTextEntry={showpassword}
                                placeholder="Enter your Password"
                                minLength={8}
                                textContentType={"password"}
                                autoComplete={"password"}
                                keyboardType={"visible-password"}
                            />
                            <MaterialIcons
                                style={styles.icon}
                                name={showpassword ? "visibility-off" : "visibility"}
                                onPress={() => setShowPassword(!showpassword)}
                            />
                        </View>
                        <TouchableOpacity style={styles.buttonwrapper} onPress={handelForgotPassword}>
                            <Text style={styles.buttontext}>ENVOYER</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>
        </ScrollView>

    )
}

export default ResetPassword