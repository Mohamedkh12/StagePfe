import {SafeAreaView, Text, TouchableOpacity, View} from "react-native";
import styles  from "./ChildProfile.Style";
import {axiosProvider} from "../../http/httpService";

const ChildProfile = ({navigation}) => {
    const handleLogout = async () => {
        try {
            const response = await axiosProvider.post('auth/logout', {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (response.data.message==="Logged out successfully") {
                console.log('Déconnexion réussie');
                navigation.navigate('Signin');
            } else {
                // Gestion des erreurs si la déconnexion échoue
                console.error('Échec de la déconnexion');
            }
        } catch (error) {
            console.error('Erreur lors de la déconnexion:', error);
        }
    };
    return(
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <View>
                    <Text style={styles.title}>Mon profil</Text>
                </View>
                <View>
                    <TouchableOpacity onPress={handleLogout}>
                        <Text style={styles.text}>Déconnexion</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    )
}

export default ChildProfile