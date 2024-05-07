import React, {useState, useEffect, useContext} from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, KeyboardAvoidingView, Alert } from 'react-native';
import { AntDesign, Octicons } from '@expo/vector-icons';
import EnfantForm from './EnfantForm';
import styles from './mesEnfants.styles';
import CustomHeader from './CustomHeader';
import { axiosProvider } from '../http/httpService';
import AsyncStorage from "@react-native-async-storage/async-storage";
import JWT from "expo-jwt";
import ProgressStepsScreen from "./ProgressStepsScreen";


const MesEnfants = ({ navigation }) => {
    const [children, setChildren] = useState([]);
    const [count, setCount] = useState(1);
    const [showAddButton, setShowAddButton] = useState(true);
    const [isDataSubmitted, setIsDataSubmitted] = useState(false);
    const [errorMessages, setErrorMessages] = useState([]);
    const [selectedImage, setSelectedImage] = useState('');
    useEffect(() => {
        setShowAddButton(count < selectedOption);
    }, [count, selectedOption]);

    useEffect(() => {
        setErrorMessages([]);
    }, [children]);

    const handleImageSelect = ( uri) => {
        setSelectedImage(uri)
    };
    const formDataToJson = (formData) => {
        const jsonObject = {};
        for (const [key, value] of formData._parts) {
            jsonObject[key] = value;
        }
        return jsonObject;
    };

    const handleCreateChildren = async () => {
        try {
            const token = await AsyncStorage.getItem('jwtToken');
            if (!token) {
                throw new Error('JWT token is missing');
            }

            const decodedToken = JWT.decode(token, 'SECRET-CODE142&of', { timeSkew: 30 });
            const parentId = decodedToken.sub;

            const requests = [];

            for (let i = 0; i < children.length; i++) {
                const childData = children[i];
                if (!childData || !childData.prenom || !childData.classe || !childData.identifiant || !childData.motDePasse) {
                    continue;
                }

                const formData = new FormData();

                formData.append('username', childData.prenom);
                formData.append('classe', childData.classe);
                formData.append('email', childData.identifiant);
                formData.append('password', childData.motDePasse);
                formData.append('id_parent', parentId);
                formData.append('roleId', 3);

                if (childData.image) {
                    const imageUriParts = childData.image.split('.');
                    const fileExtension = imageUriParts[imageUriParts.length - 1];

                    formData.append('image', {
                        uri: childData.image,
                        name: `image.${fileExtension}`,
                        type: `image/${fileExtension}`,
                    });
                } else {
                    formData.append('image', null);
                }
                requests.push(
                    axiosProvider.post('parents/createChildren', formData, {
                        headers: {
                            'content-Type': 'multipart/form-data',
                        },
                        timeout: 10000,
                    }).then(response => response.data)
                );
                console.log(requests)
            }

            const responses = await Promise.all(requests);
            console.log("responses :",responses)
            if (responses.every(response => response !== null)) {
                return responses;
            } else {
                throw new Error('Failed to create one or more children');
            }
        } catch (error) {
            console.error("Error creating children:", error);
            throw error;
        }
    };

    const handleChildDataChange = (index, childData, imageUri) => {
        setChildren((prevChildren) => {
            const updatedChildren = [...prevChildren];
            updatedChildren[index - 1] = { ...childData, image: imageUri };
            return updatedChildren;
        });
    };
    useEffect(() => {
        if (children.length > 0) {
            handleNextButton();
        }
    }, [children]);

    const handleNextButton = async () => {
        try {
            const responses = await handleCreateChildren();
            const updatedChildren = responses.map(response => response.data);
            setChildren(updatedChildren);

            navigation.navigate('InfosPersonnelles');
            setIsDataSubmitted(true);
        } catch (error) {
            console.error("Error creating children:", error);
            Alert.alert('Error', 'Failed to create child. Please try again later.');
        }
    };


    const steps = ['Abonnement', 'Compte parent', 'Paiement', 'Mes enfants', 'Mes infos personnelles'];
    const currentStep =3;

    return (
        <KeyboardAvoidingView>
            <SafeAreaView style={styles.container}>
                <ScrollView>
                <View>
                    <CustomHeader />
                    <ProgressStepsScreen steps={steps} currentStep={currentStep} />
                </View>
                    <Text style={styles.h1}>Mes enfants</Text>
                    <Text style={styles.text}>
                        Pour se connecter à la plateforme, votre enfant aura besoin de son identifiant et mot de passe.
                    </Text>

                    { [...Array(count)].map((_, index) => (
                        <EnfantForm
                            key={index + 1}
                            index={index + 1}
                            onChildDataChange={handleChildDataChange}
                            showAddButton={showAddButton && count < selectedOption}
                            count={count}
                            isDataSubmitted={isDataSubmitted}
                            errorMessages={errorMessages[index]}
                            onImageSelect={handleImageSelect}
                        />
                    ))}

                    <View>
                        <View>
                            {showAddButton && (
                                <TouchableOpacity style={styles.ajouterwrapper} onPress={() => setCount(count + 1)}>
                                    <Octicons name="plus" style={styles.iconplus} />
                                    <Text style={styles.textbuttom}>AJOUTER UN COMPTE ENFANT</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
                            <TouchableOpacity onPress={() => navigation.goBack()} style={{ flexDirection: 'row' }}>
                                <AntDesign name="left" selectable={true} style={styles.icon(15, 5)} />
                                <Text style={styles.lienRetour}>Retour</Text>
                            </TouchableOpacity>
                            {!showAddButton && (
                                <TouchableOpacity style={styles.buttom} onPress={handleNextButton}>
                                    <Text style={styles.textbuttom}>SUIVANT</Text>
                                    <AntDesign name="right" selectable={true} style={styles.iconRight} />
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </KeyboardAvoidingView>
    );
};

export default MesEnfants;
