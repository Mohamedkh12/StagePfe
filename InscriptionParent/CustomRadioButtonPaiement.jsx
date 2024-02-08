import React, { useMemo, useState } from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import RadioGroup from 'react-native-radio-buttons-group';

const CustomRadioButtonPaiement = () => {
    const radioButtonsData = useMemo(() => ([
        {
            id: 'option1',
            label: 'Paiement unitaire',
            selected: false,
        },
        {
            id: 'option2',
            label: 'Paiement mensuel',
            selected: false,
        },
    ]), []);

    const [radioButtons, setRadioButtons] = useState(radioButtonsData);

    const onPressRadioButton = (button) => {
        const updatedRadioButtons = radioButtons.map((item) => ({
            ...item,
            selected: item.id === button.id,
        }));
        setRadioButtons(updatedRadioButtons);

    };

    return (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollViewContent}>
            {radioButtons.map((button) => (
                <View key={button.id} style={styles.radioButtonContainer}>
                    <RadioGroup
                        radioButtons={[button]}
                        onPress={() => onPressRadioButton(button)}
                        selectedId={button.selected ? button.id : ''}
                        labelStyle={styles.labelStyle}
                    />
                </View>
            ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    scrollViewContent: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingTop: 17,
    },
    radioButtonContainer: {
        marginRight: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    labelStyle: {
        fontSize: 15,
        fontFamily: 'regular',
        color: '#2C2C2C',
        lineHeight: 19,
        marginLeft: 10,
    },
});

export default CustomRadioButtonPaiement;
