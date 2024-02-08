import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import styles from './CreateCompte.styles';

const CustomHeader = () => {
    return (
        <View>
                    <View style={styles.logoContainer}>
                        <Image source={require('../assets/logoedidact.png')} style={styles.logo} />
                    </View>
        </View>
    );
};

export default CustomHeader;
