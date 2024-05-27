import React, {useEffect} from 'react';
import { WebView } from 'react-native-webview';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import * as ScreenOrientation from 'expo-screen-orientation';
const WebViewScreen = ({ route, navigation }) => {
    const { url } = route.params;
    useEffect(() => {
        const lockOrientation = async () => {
            await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
        };
        lockOrientation();

        // Retour à l'orientation par défaut lors du démontage du composant
        return () => {
            ScreenOrientation.unlockAsync();
        };
    }, []);
    return (
        <View style={styles.container}>
            <WebView source={{ uri: url }} style={styles.webview} />
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <Ionicons name="exit-outline" size={24} color="black" />
            </TouchableOpacity>
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    webview: {
        flex: 1,
    },
    backButton: {
        position: 'absolute',
        top: 20,
        left: 20,
        padding: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderRadius: 5,
    },
    backButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default WebViewScreen;
