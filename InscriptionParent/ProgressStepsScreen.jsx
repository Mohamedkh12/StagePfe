// ProgressStepsScreen.js
import React from 'react';
import { ScrollView, Text, View, StyleSheet } from 'react-native';

const ProgressStepsScreen = ({ steps=[], currentStep }) => {
    return (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} >
            {steps.length > 0 && steps.map((step, index) => (
                <View key={index} style={styles.stepContainer}>
                    <Text style={[styles.stepText, getStepStyle(index, currentStep)]}>
                        {step}
                    </Text>
                    {index < steps.length - 1 && <View style={styles.bar} />}
                </View>
            ))}
        </ScrollView>
    );
};

const getStepStyle = (index, currentStep) => {
    return index <= currentStep ? styles.boldText : styles.normalText;
};

const styles = StyleSheet.create({
    stepContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    stepText: {
        fontFamily: 'regular',
        fontSize: 14,
        color: '#272727',
        lineHeight: 19,
    },
    boldText: {
        fontFamily: 'bold',
        fontSize: 14,
        color: '#272727',
        lineHeight: 19,
    },
    normalText: {
        fontFamily: 'regular',
        fontSize: 14,
        color: '#272727',
        lineHeight: 19,
    },
    bar: {
        width: 8,
        height: 0,
        borderStyle: 'solid',
        borderTopWidth: 2,
        borderColor: '#707070',
        opacity: 1,
        marginHorizontal: 5,
        textAlign: 'center',
    },
});

export default ProgressStepsScreen;
