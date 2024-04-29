import React, {useState, useMemo} from 'react';
import { ScrollView, View, Text, Image, TouchableOpacity } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import CustomRadioButton from "./CustomRadioButton";
import CustomHeader from "./CustomHeader";
import CustomRadioButtonPaiement from "./CustomRadioButtonPaiement";
import styles from "./abonnementParent.styles";
import { AntDesign } from '@expo/vector-icons';
import ProgressStepsScreen from "./ProgressStepsScreen";


const AbonnementParent = ({navigation}) => {

    const [selectedOption, setSelectedOption] = useState('1');
    const [selectedlabel, setSelectedlabel] = useState('1 compte enfant');
    const [title, setTitle] = useState('Solo découverte');
    const [title2, setTitle2] = useState('Solo annuel');
    const steps = ['Abonnement', 'Compte parent', 'Paiement', 'Mes enfants', 'Mes infos personnelles'];
    const currentStep = 0;

    global.selectedOption = selectedOption;

    const images = useMemo(() => ({
        1: require('../assets/images/child-Mobile-inscription3.png'),
        2: require('../assets/images/2children-Mobile-inscription3.png'),
        3: require('../assets/images/3children-Mobile-inscription3.png'),
    }), []);

    const handleChange = (value) => {
        setSelectedOption(value);
        if (value === '1') {
            setTitle('Solo découverte');
            setTitle2('Solo annuel');
        } else {
            setTitle('Multi découverte');
            setTitle2('Multi annuel');
        }
    };

    const handelSelectedLabel = (label) => {
        setSelectedlabel(label);
    };


    return (
        <ScrollView>
            <CustomHeader />
            <ProgressStepsScreen steps={steps} currentStep={currentStep} />
            <View style={styles.contentContainer}>
                <View style={styles.content1}>
                    <Text style={styles.H1}>Choisissez l’abonnement qui vous correspond</Text>
                    <View>
                        <CustomRadioButton onSelect={handleChange} onLabelSelect={handelSelectedLabel}/>
                    </View>
                    <View style={styles.innerContent}>
                        <Text style={styles.H2}>{title}</Text>
                        <Text style={styles.text(17, 17)}>Paiement unitaire</Text>
                        <Text style={styles.H3}>XX CHF/mois*</Text>

                        <View style={styles.containerImage}>
                            <Image
                                source={require('../assets/images/parent-Mobile-inscription3.png')}
                                style={styles.image}
                            />
                            <FontAwesome6 name="plus" size={24} color="black" />
                            <Image source={images[selectedOption]} style={styles.image} />
                        </View>

                        <View style={styles.textContainer}>

                                <Text style={styles.text(0, 13)}>1 compte parent</Text>
                                <Text style={styles.text(0, 13)}>{selectedlabel}</Text>

                        </View>

                        <View>
                            <Image source={require('../assets/images/book-Mobile-inscription3.png')} style={styles.image} />
                            <Text style={styles.text(13, 13)}>toutes les matières</Text>
                        </View>

                        <TouchableOpacity style={styles.buttonWrapper} onPress={() =>navigation.navigate('CompteParent', { roleId: 2 })}>
                            <Text style={styles.buttonText}>JE M’ABONNE</Text>
                        </TouchableOpacity>

                        <View style={{ marginTop: 15 }}>
                            <Text style={styles.italicText}>* abonnement de 3 mois</Text>
                        </View>
                    </View>
                </View>
            </View>
            {/* Second Part */}
            <View style={styles.contentContainer2}>
                <View style={styles.content2}>
                    <View style={{justifyContent:'center',alignItems:'center'}}>
                        <Text style={styles.H2}>{title2}</Text>
                    </View>
                    <View >
                        <CustomRadioButtonPaiement />
                    </View>
                    <View style={styles.innerContent}>
                        <Text style={styles.H3}>XX CHF/mois*</Text>
                        <View style={styles.containerImage}>
                            <Image
                                source={require('../assets/images/parent-Mobile-inscription3.png')}
                                style={styles.image}
                            />
                            <FontAwesome6 name="plus" size={24} color="black" />
                            <Image source={images[selectedOption]} style={styles.image} />
                        </View>
                        <View style={styles.textContainer}>
                                <Text style={styles.text(0, 13)}>1 compte parent</Text>
                                <Text style={styles.text(0, 13)}>{selectedlabel}</Text>
                        </View>

                        <View>
                            <Image source={require('../assets/images/book-Mobile-inscription3.png')} style={styles.image} />
                            <Text style={styles.text(13, 13)}>toutes les matières</Text>
                        </View>

                        <TouchableOpacity style={styles.buttonWrapper} onPress={() => {}}>
                            <Text style={styles.buttonText}>JE M’ABONNE</Text>
                        </TouchableOpacity>

                        <View style={{ marginTop: 15 }}>
                            <Text style={styles.italicText}>* abonnement de 3 mois</Text>
                        </View>
                    </View>
                </View>
            </View>
            <TouchableOpacity onPress={() => navigation.goBack()} style={{paddingBottom: 20,}}>
                <AntDesign name="left" selectable={true} style={styles.icon} />
                <Text style={styles.lienRetour}>Retour</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

export default AbonnementParent;
