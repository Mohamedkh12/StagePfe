import React, { useState, useEffect, useRef } from "react";
import { SafeAreaView, Text, TextInput, View, Image, TouchableOpacity, Alert, ScrollView } from "react-native";
import { axiosProvider } from "../http/httpService";
import styles from "./MdpOublie.styles";

const CreateCode = ({ route, navigation }) => {
    const [code, setCode] = useState('');
    const [isResendButtonDisabled, setIsResendButtonDisabled] = useState(true);
    const [remainingTime, setRemainingTime] = useState(60);
    const isMounted = useRef(false);
    const intervalRef = useRef(null); // Référence à l'intervalle

    const { parentEmail } = route.params;

    useEffect(() => {
        isMounted.current = true;
        intervalRef.current = setInterval(() => {
            setRemainingTime(prevTime => {
                if (prevTime > 0) {
                    return prevTime - 1;
                } else {
                    setIsResendButtonDisabled(false);
                    clearInterval(intervalRef.current); // Supprimer l'intervalle
                    return prevTime;
                }
            });
        }, 1000);

        return () => {
            clearInterval(intervalRef.current); // Supprimer l'intervalle lors du démontage
            isMounted.current = false;
        };
    }, []);

    const handleTimerFinish = () => {
        setIsResendButtonDisabled(false);
    };

    const handleForgotPassword = async () => {
        try {
            const response = await axiosProvider.post('mailer/check-code', {
                code: code
            });
            setCode(String(response.data.code));
            if (response.data.success === true) {
                navigation.navigate('ResetPassword');
                setCode('');
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
            if (response.data.success === true) {
                setCode(String(response.data.result.code));
                console.log(response.data);
                setIsResendButtonDisabled(true);
                setRemainingTime(60);
            } if (response.data.success === false) {
                Alert.alert('Vous avez atteint le nombre maximal de tentatives d\'envoi. Veuillez attendre 24 heures avant de réessayer.');
            }
            else {
                Alert.alert('Erreur', response.data.error || 'L\'e-mail spécifié n\'existe pas.');
            }
        } catch (error) {
            console.log(error);
        }
    };

    // Supprimer l'intervalle lors de la navigation vers ResetPassword
    useEffect(() => {
        return () => {
            clearInterval(intervalRef.current);
        };
    }, []);

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
                    <View style={{ marginTop: 20 }}>
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
                    <TouchableOpacity style={styles.buttonwrapper} onPress={handleForgotPassword}>
                        <Text style={styles.buttontext}>ENVOYER</Text>
                    </TouchableOpacity>
                    <View style={{ flexDirection: 'row', marginTop: 20, justifyContent: 'space-between' }}>
                        <TouchableOpacity onPress={resetCode} disabled={isResendButtonDisabled}>
                            <Text style={[styles.buttontext, isResendButtonDisabled && { color: 'grey' }]}>Code non recu ?</Text>
                        </TouchableOpacity>
                        <View>
                            {isMounted.current && (
                                <Text style={{ color: '#2C2C2C', fontWeight: 'bold',fontSize: 20 ,marginHorizontal: 27 }}>
                                    {remainingTime > 0 ? `00:${remainingTime < 10 ? '0' + remainingTime : remainingTime}` : '00:00'}
                                </Text>
                            )}
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default CreateCode;
