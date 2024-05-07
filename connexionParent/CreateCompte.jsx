import React, {useState} from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import styles from "./CreateCompte.styles";
import CustomHeader from "../InscriptionParent/CustomHeader";
import ProgressStepsScreen from "../InscriptionParent/ProgressStepsScreen";

const CreateCompte = ({navigation}) => {
    const steps = ['Abonnement', 'Compte parent', 'Paiement', 'Mes enfants', 'Mes infos personnelles'];
    const currentStep =2;
    const [roleId, setRoleId] = useState(null);
    const handleParentPress = () => {
        setRoleId(2); // RoleId for Parent
        navigation.navigate('AbonnementParent', { roleId: 2 })
    };

    /*const handleEnseignantPress = () => {
        setRoleId(2);
    };*/

    return (
        <View style={styles.container}>
            <CustomHeader />
            <ProgressStepsScreen currentStep={currentStep} />
            <View style={styles.content}>
                <Text style={styles.H1}>Créons votre compte en quelques clics</Text>

                <View style={styles.contentParent}>
                    <TouchableOpacity onPress={handleParentPress}>
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

                <TouchableOpacity onPress={() => navigation.navigate('Signin')}>
                    <Text style={styles.lien}>Connectez-vous !</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default CreateCompte;
