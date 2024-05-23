import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, KeyboardAvoidingView, Alert, Platform } from 'react-native';
import { AntDesign, Octicons } from '@expo/vector-icons';
import EnfantForm from './EnfantForm';
import styles from './mesEnfants.styles';
import CustomHeader from './CustomHeader';
import AsyncStorage from "@react-native-async-storage/async-storage";
import JWT from "expo-jwt";
import axios from "axios";
import mime from 'mime';
import ProgressStepsScreen from "./ProgressStepsScreen";
const MesEnfants = ({ navigation }) => {
    const [count, setCount] = useState(1);
    const [showAddButton, setShowAddButton] = useState(true);
    const [forms, setForms] = useState([{ prenom: '', motDePasse: '', classe: '', identifiant: '' }]);
    const [selectedImage, setSelectedImage] = useState(null);
    const [nextButtonDisabled, setNextButtonDisabled] = useState(true);
    global.selectedOption =selectedOption

    useEffect(() => {
        setShowAddButton(count < selectedOption);
    }, [count, selectedOption]);

    useEffect(() => {
        validateForms(forms);
    }, [forms]);

    const handleImageSelect = (index, uri) => {
        const newForms = [...forms];
        newForms[index].image = uri;
        setForms(newForms);
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

                if (childData.image) {
                    const imageUri = childData.image;

                    if (Platform.OS === 'ios') {
                        const imageUriParts = imageUri.split('.');
                        const fileExtension = imageUriParts[imageUriParts.length - 1];

                        formData.append('image', {
                            uri: imageUri,
                            name: `image.${fileExtension}`,
                            type: `image/${fileExtension}`,
                        });
                    }
                    if (Platform.OS === 'android') {
                        const newImageUri = "file:///" + imageUri.split("file:/").join("");
                        formData.append('image', {
                            uri: newImageUri,
                            type: mime.getType(newImageUri),
                            name: newImageUri.split("/").pop()
                        });
                    }
                } else {
                    formData.append('image', null);
                }

                console.log('formData:', formData);
                const response = await axios.create({
                    baseURL: 'http://192.168.1.121:3000/',
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
                console.log("response :", response);
                Alert.alert('Enfant enregistré avec succès');
                requests.push(response);
                navigation.navigate('InfosPersonnelles');
                console.log("requests :", requests);
            }
            const responses = await Promise.all(requests);
            return responses;
        } catch (error) {
            console.error("Error creating children:", error);
            console.error('Error response:', error.response);
            throw error;
        }
    };


    const handleChildDataChange = async (index, name, value) => {
        const newForms = [...forms];
        newForms[index][name] = value;
        if (name === 'prenom') {
            const token = await AsyncStorage.getItem('jwtToken');
            if (!token) {
                throw new Error('JWT token is missing');
            }
            const decodedToken = JWT.decode(token, 'SECRET-CODE142&of', { timeSkew: 30 });
            const parentId = decodedToken.sub;
            const childIdentifier = value.trim() ? `${value.trim()}${parentId}` : '';
            newForms[index]['identifiant'] = childIdentifier;
        }
        setForms(newForms);
        validateForms(newForms);
    };


    const handleAddForm = () => {
        if (count < selectedOption) {
            const newForms = [...forms, { prenom: '', motDePasse: '', classe: '' ,identifiant : ""}];
            console.log("newForms",newForms)
            setForms(newForms);
            console.log(forms)
            setCount(count + 1);
            validateForms(newForms);
        }
    };

    const validateForms = (forms) => {
        const allFormsFilled = forms.every(form => Object.values(form).every(val => val.trim().length > 0));
        const uniqueUsernames = new Set(forms.map(form => form.prenom.trim())).size === forms.length;
        setNextButtonDisabled(!(allFormsFilled && uniqueUsernames));
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
                            onImageSelect={(uri) => handleImageSelect(index, uri)}
                            onClasseChange={(value) => handleChildDataChange(index, 'classe', value)}
                            handleIdentifierChange={(value) => handleChildDataChange(index, 'identifiant', value)}
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
                        <View style={{ justifyContent:"flex-end", marginTop: 30,alignSelf:"flex-end" }}>
                            {!showAddButton && (
                                <TouchableOpacity
                                    style={[styles.buttom, { opacity: !nextButtonDisabled ? 1 : 0.5 }]}
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
