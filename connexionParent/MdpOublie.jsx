import {Alert, Image, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View} from "react-native";
import React, {useState} from "react";
import styles from "./MdpOublie.styles";
import {axiosProvider} from "../http/httpService";

const MdpOublie = ({navigation}) => {
    const [identifiant, setIdentifiant] = useState('');
    const handelForgotPassword = async () => {
        try {
            const response = await axiosProvider.post('mailer/forgotPassword', {
                email: identifiant
            });

            // Si le statut de la réponse est 201, cela signifie que l'e-mail existe et un code a été envoyé
            if (response.data.message===' email sent successfully') {
                navigation.navigate('CreateCode',{parentEmail:identifiant});
            } else {
                // Sinon, il y a une erreur
                Alert.alert('Erreur', 'L\'e-mail spécifié n\'existe pas.');
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Erreur', 'Une erreur est survenue. Veuillez réessayer plus tard.');
        }
    }

    return(
     <ScrollView style={styles.container}>
         <SafeAreaView style={styles.content}>
             <View style={{alignItems:"center"}} >
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
                         onChange={(e) => setIdentifiant(e.nativeEvent.text)}
                         value={identifiant}
                     />
                 </View>
                 <TouchableOpacity style={styles.buttonwrapper} onPress={handelForgotPassword}>
                     <Text style={styles.buttontext}>ENVOYER</Text>
                 </TouchableOpacity>
                 <TouchableOpacity onPress={()=>{}}>
                     <Text style={styles.lientext}>Connexion</Text>
                 </TouchableOpacity>
             </View>
         </SafeAreaView>
     </ScrollView>
  )
}

export default MdpOublie

