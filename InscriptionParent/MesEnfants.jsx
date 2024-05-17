import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, KeyboardAvoidingView, Alert, Platform } from 'react-native';
import { AntDesign, Octicons } from '@expo/vector-icons';
import EnfantForm from './EnfantForm';
import styles from './mesEnfants.styles';
import CustomHeader from './CustomHeader';
import AsyncStorage from "@react-native-async-storage/async-storage";
import JWT from "expo-jwt";
import ProgressStepsScreen from "./ProgressStepsScreen";
import mime from 'mime';
import axios from "axios";

const MesEnfants = ({ navigation }) => {
    const [count, setCount] = useState(1);
    const [showAddButton, setShowAddButton] = useState(true);
    const [forms, setForms] = useState([
        { prenom: '', motDePasse: '', classe: '' }
    ]);
    const [selectedImage, setSelectedImage] = useState('');
    const [nextButtonDisabled, setNextButtonDisabled] = useState(true);

    useEffect(() => {
        setShowAddButton(count < selectedOption);
    }, [count, selectedOption]);

    const handleImageSelect = (uri) => {
        setSelectedImage(uri);
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
            for (let i = 0; i < forms.length; i++) {
                const childData = forms[i];

                const formData = new FormData();
                formData.append('username', childData.prenom);
                formData.append('classe', childData.classe);
                formData.append('email', childData.identifiant);
                formData.append('password', childData.motDePasse);
                formData.append('id_parent', parentId);
                formData.append('roleId', 3);

                if (selectedImage) {
                    if (Platform.OS === 'ios') {
                        const imageUriParts = selectedImage.split('.');
                        const fileExtension = imageUriParts[imageUriParts.length - 1];

                        formData.append('image', {
                            uri: selectedImage,
                            name: `image.${fileExtension}`,
                            type: `image/${fileExtension}`,
                        });

                    }
                    if (Platform.OS === 'android') {
                        const newImageUri = "file:///" + selectedImage.split("file:/").join("");
                        formData.append('image', {
                            uri: newImageUri,
                            type: mime.getType(newImageUri),
                            name: newImageUri.split("/").pop()
                        });
                    }

                }
                console.log('formData:', formData);
                const response = await axios.create({
                    baseURL: 'http://192.168.1.2:3000/',
                    timeout: 10000,
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${token}`,
                        'cache-control': 'no-cache',
                    },
                    transformRequest: (data) => {
                        return data;
                    },
                }).post('parents/createChildren', formData);
                console.log("response :",response)
                Alert.alert('Enfant enregistré avec succès');
                requests.push(response);
                navigation.navigate('InfosPersonnelles')
                console.log("requests :",requests)
            }
            const responses = await Promise.all(requests);
            return responses;
        } catch (error) {
            console.error("Error creating children:", error);
            console.error('Error response:', error.response);
            throw error;
        }
    };

    const handleChildDataChange = (index, name, value) => {
        const newForms = [...forms];
        newForms[index][name] = value;
        setForms(newForms);
        console.log('Forms:', newForms);

// Vérifier si tous les champs sont remplis pour le formulaire en cours
         const currentFormFilled = Object.values(newForms[index]).every(val => val.trim().length > 0);
          console.log('Current form filled:', currentFormFilled);

          const uniqueUsernames = new Set(newForms.map(form => form.prenom.trim()));
          console.log('Unique usernames:', uniqueUsernames);

          // Mettre à jour l'état du bouton en fonction des vérifications
          setNextButtonDisabled(uniqueUsernames.size !== newForms.length || !currentFormFilled);
    };

    const handleAddForm = () => {
        if (count < selectedOption) {
            // Ajoutez le nouveau formulaire
            const newForms = [...forms, { prenom: '', motDePasse: '', classe: ''}];
            setForms(newForms);
            setCount(count + 1);
            // Vérifiez si tous les formulaires ont au moins un champ rempli
            const allFormsFilled = newForms.every(form => Object.values(form).some(val => val.trim().length > 0));
            console.log('All forms filled:', allFormsFilled);

            const uniqueUsernames = new Set(newForms.map(form => form.prenom.trim()));
            console.log('Unique usernames:', uniqueUsernames);

            // Mettre à jour l'état du bouton en fonction des vérifications
            setNextButtonDisabled(!allFormsFilled || uniqueUsernames.size !== newForms.length);
        }
    }

    const handleClasseChange = (index, value) => {
        const newForms = [...forms];
        newForms[index]['classe'] = value;
        setForms(newForms);
    };

    const handleNextButton = async () => {
        try {
            const responses = await handleCreateChildren();
        } catch (error) {
            console.error("Error creating children:", error);
            Alert.alert('Error', 'Failed to create child. Please try again later.');
        }
    };

    const steps = ['Abonnement', 'Compte parent', 'Paiement', 'Mes enfants', 'Mes infos personnelles'];
    const currentStep = 3;

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
                    {forms.map((form, index) => (
                        <EnfantForm
                            key={index + 1}
                            index={index}
                            onChildDataChange={handleChildDataChange}
                            formData={form}
                            onImageSelect={handleImageSelect}
                            onClasseChange={(value) => handleClasseChange(index, value)}
                            showAddButton={showAddButton && count < selectedOption}
                            count={count}
                        />
                    ))}
                    <View>
                        <View>
                            {showAddButton && (
                                <TouchableOpacity style={styles.ajouterwrapper} onPress={handleAddForm}>
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
                                <TouchableOpacity
                                    style={[styles.buttom, { opacity: nextButtonDisabled ? 0.5 : 1 }]}
                                    onPress={handleNextButton}
                                    disabled={nextButtonDisabled}
                                >
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
