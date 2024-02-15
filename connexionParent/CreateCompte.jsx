import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import styles from "./CreateCompte.styles";
import CustomHeader from "./CustomHeader";

const CreateCompte = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <CustomHeader />
            <View style={styles.content}>
                <Text style={styles.H1}>Créons votre compte en quelques clics</Text>

                <View style={styles.contentParent}>
                    <TouchableOpacity onPress={() => navigation.navigate('AbonnementParent')}>
                        <Image
                            source={require('../assets/images/parent-Mobile-inscription3.png')}
                            style={styles.imageParent}
                        />
                    </TouchableOpacity>
                    <Text style={styles.H2}>Parent</Text>
                    <Text style={styles.text}>
                        Vous pourrez suivre l’évolution de vos enfants en temps réel
                    </Text>
                </View>

                <View style={styles.contetnEnseignant}>
                    <TouchableOpacity onPress={() => {}}>
                        <Image
                            source={require('../assets/images/teacher-mobile.png')}
                            style={styles.imageEnseignant}
                        />
                    </TouchableOpacity>
                    <Text style={styles.H2}>Enseignant</Text>
                    <Text style={styles.text}>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    </Text>
                </View>

                <TouchableOpacity onPress={() => {}}>
                    <Text style={styles.lien}>Connectez-vous !</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default CreateCompte;
