import {SafeAreaView, Text, TextInput, View, Image, TouchableOpacity, Alert, ScrollView} from "react-native";
import React, {useState} from "react";
import {axiosProvider} from "../http/httpService";
import styles from "./MdpOublie.styles";

const CreateCode = ({route,navigation}) => {
    const [code, setCode] = useState('');
    const {parentEmail} = route.params;
    const handelForgotPassword = async () => {
        try {
            const response = await axiosProvider.post('mailer/check-code', {
                code:code
            });
            setCode(String(response.data.code));
            if (response.data.success===true) {
                navigation.navigate('ResetPassword');
                setCode('')
            } else {
                Alert.alert("Code invalide ou expiré");
            }
            console.log(response.data);
        } catch (error) {
            console.log(error);
        }
    }

    const resetCode = async () => {
        try {
            const response = await axiosProvider.post('mailer/resend-code', {
                email: parentEmail
            });
            setCode(String(response.data.code));
            console.log(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <View style={{ alignItems: "center" }}>
                    <View style={styles.imagecontainer}>
                        <Image source={require('../assets/logoedidact.png')} style={styles.image} />
                    </View>
                    <View style={{ marginTop: 20 }}>
                        <Text style={styles.H1}>Confirmer votre Compte</Text>
                    </View>
                    <View style={{marginTop: 20}}>
                        <View>
                            <Text style={styles.text}>Entrer votre code*</Text>
                            <TextInput
                                style={styles.input}
                                onChangeText={(text) => setCode(text)}
                                value={code}
                                keyboardType="numeric"
                                autoCompleteType="cc-number"
                            />
                        </View>
                    </View>
                    <TouchableOpacity style={styles.buttonwrapper} onPress={handelForgotPassword}>
                        <Text style={styles.buttontext}>ENVOYER</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.buttonwrapper} onPress={resetCode}>
                        <Text style={styles.buttontext}>Code non recu ?</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default CreateCode