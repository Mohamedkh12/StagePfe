import React, { useState, useEffect } from "react";
import { SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View, Alert, Image } from "react-native";
import { axiosProvider } from "../http/httpService";
import styles from "./MdpOublie.styles";

const MdpOublie = ({ navigation }) => {
    const [identifiant, setIdentifiant] = useState('');

    const handleForgotPassword = async () => {
        try {

            const response = await axiosProvider.post('mailer/forgotPassword', { email: identifiant });
            if (response.data.success===true) {
                navigation.navigate('CreateCode', { parentEmail: identifiant });
            }if(response.data.success===false){
                Alert.alert('Vous avez atteint le nombre maximal de tentatives d\'envoi. Veuillez attendre 24 heures avant de réessayer.');
            }
            if(response.data.message===false){
                Alert.alert('Erreur', 'L\'e-mail spécifié n\'existe pas');
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Erreur', 'Une erreur est survenue. Veuillez réessayer plus tard.');
        }
    };

    return (
        <ScrollView style={styles.container}>
            <SafeAreaView style={styles.content}>
                <View style={{ alignItems: "center" }}>
                    <View style={styles.imagecontainer}>
                        <Image source={require('../assets/logoedidact.png')} style={styles.image} />
                    </View>
                    <View>
                        <Text style={styles.H1}>Mot de passe oublié</Text>
                    </View>
                    <View style={{ marginTop: 20, marginLeft: 25, marginRight: 25 }}>
                        <View style={{ marginBottom: 10 }}>
                            <Text style={styles.text}>Entrez votre email pour réinitialiser votre mot de passe</Text>
                        </View>
                    </View>
                    <View style={styles.inputwrapper}>
                        <Text style={styles.text}>Email*</Text>
                        <TextInput
                            style={styles.input}
                            inputMode={"email"}
                            keyboardType={"email-address"}
                            autoCompleteType={"username"}
                            placeholder={'Enter your email address'}
                            onChangeText={(text) => setIdentifiant(text)}
                            value={identifiant}
                        />
                    </View>
                    <TouchableOpacity style={styles.buttonwrapper} onPress={handleForgotPassword} >
                        <Text style={styles.buttontext}>ENVOYER</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('Signin')}>
                        <Text style={styles.lientext}>Connexion</Text>
                    </TouchableOpacity>

                </View>
            </SafeAreaView>
        </ScrollView>
    )
}

export default MdpOublie;
