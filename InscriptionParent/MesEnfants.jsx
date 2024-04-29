import React, {useState, useEffect, useContext} from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, KeyboardAvoidingView, Alert } from 'react-native';
import { AntDesign, Octicons } from '@expo/vector-icons';
import EnfantForm from './EnfantForm';
import styles from './mesEnfants.styles';
import CustomHeader from './CustomHeader';
import { axiosProvider } from '../http/httpService';
import AsyncStorage from "@react-native-async-storage/async-storage";
import JWT from "expo-jwt";


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
        console.log("Selected Image URI:", uri);
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

            const responses = await Promise.all(children.map(async (childData, index) => {
                try {
                    const formData = new FormData();

                    formData.append('username', childData.prenom);
                    formData.append('classe', childData.classe);
                    formData.append('email', childData.identifiant);
                    formData.append('password', childData.motDePasse);
                    formData.append('id_parent', parentId);
                    formData.append('roleId', 3);
                    if (selectedImage) {
                        const imageUriParts = selectedImage.split('.');
                        const fileExtension = imageUriParts[imageUriParts.length - 1];

                        formData.append('image', {
                            uri: selectedImage,
                            name: `image.${fileExtension}`,
                            type: `image/${fileExtension}`,
                        });
                    }
                    const jsonData = formDataToJson(formData);
                    console.log("Sending request for child:", index + 1, jsonData);

                    const response = await axiosProvider.post('parents/createChildren', formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                            'Authorization': `Bearer ${token}`
                        }
                    });

                    console.log("Response received for child:", index + 1, response.data);

                    handleChildDataChange(index + 1, response.data, childData.image);

                    return response;
                } catch (error) {
                    console.error(`Error creating child ${index + 1}:`, error);
                    return null;
                }
            }));

            // Vérifiez si toutes les réponses sont reçues et qu'aucune d'entre elles n'est null
            if (responses.every(response => response !== null)) {
                global.childId = responses.map(response => response.data.id);
                console.log("Responses:", responses);
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
            console.log("Updated children list:", updatedChildren);
            return updatedChildren;
        });
    };


    const handleNextButton = async () => {
        try {
            const responses = await handleCreateChildren();
            console.log('Responses from server:', responses);

            // Vérifiez si toutes les réponses sont reçues et qu'aucune d'entre elles n'est undefined
            if (responses.every(response => response && response.data)) {
                navigation.navigate('InfosPersonnelles');
                setIsDataSubmitted(true)
            } else {
                Alert.alert('Error', 'Failed to create child. Please try again later.');
            }
        } catch (error) {
            console.error("Error creating child:", error);
            Alert.alert('Error', 'Failed to create child. Please try again later.');
        }
    };



    return (
        <KeyboardAvoidingView>
            <SafeAreaView style={styles.container}>
                <ScrollView>
                    <CustomHeader />
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
