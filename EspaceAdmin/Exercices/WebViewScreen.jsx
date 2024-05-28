import React, { useEffect, useState } from 'react';
import { WebView } from 'react-native-webview';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import * as ScreenOrientation from 'expo-screen-orientation';
import { Ionicons } from '@expo/vector-icons';

const WebViewScreen = ({ route, navigation }) => {
    const { url } = route.params;
    const [isPageLoaded, setIsPageLoaded] = useState(false);

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
            <WebView
                source={{ uri: url }}
                style={styles.webview}
                onLoad={() => setIsPageLoaded(true)}
            />
            {isPageLoaded && (
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="exit-outline" size={32} color="white" style={styles.iconShadow} />
                </TouchableOpacity>
            )}
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
    iconShadow: {
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 5,
    },
    backButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default WebViewScreen;
