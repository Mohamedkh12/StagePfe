import React, {useState, useEffect, useRef} from 'react';
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
import {from} from "form-data";

const MesEnfants = ({ navigation }) => {
    const [children, setChildren] = useState([]);
    const [count, setCount] = useState(1);
    const [prenon, setPrenon] = useState('');
    const [showAddButton, setShowAddButton] = useState(true);
    const [isDataSubmitted, setIsDataSubmitted] = useState(false);
    const [forms, setForms] = useState([
        {image:'', prenom: '', password: '', classe: '', identifiant: '', motDePasse: '' }
    ]);
    const [selectedImage, setSelectedImage] = useState('');
    const [nextButtonDisabled, setNextButtonDisabled] = useState(true);
    global.selectedOption = selectedOption;

    const getToken = async (key) => {
        return await AsyncStorage.getItem(key);
    };
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

                if (!response.data.status) {
                    if (response.data.error.includes('Child exist')) {
                        Alert.alert('Erreur', response.data.error);
                    }
                } else {
                    Alert.alert('Enfant enregistré avec succès');
                    requests.push(response);
                    navigation.navigate('InfosPersonnelles');
                }
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
        setForms(newForms);

        const token = await getToken('jwtToken');
        const decodedToken = JWT.decode(token, 'SECRET-CODE142&of', { timeSkew: 30 });
        const parentId = decodedToken.sub;

        // Construire l'identifiant en incluant le dernier caractère du prénom et le numéro du parent
        console.log("prenon : ",newForms[index]['prenom']);
        console.log("identifiant : ",newForms[index]['identifiant']);
        const currentIdentifiant = newForms[index]['identifiant'];
        if (name === 'prenom' && value.length > 0) {
            setPrenon(value); // Mettre à jour le state prenon
            const identifiant = `${value}${parentId}`;
            newForms[index]['identifiant'] = identifiant;
        }
        // Vérifier si toutes les valeurs sont remplies
        const allFieldsFilled = newForms.filter(form => form.prenom.trim() !== '');
        // Vérifier si les prénoms sont uniques
        const uniqueUsernames = new Set(newForms.map(form => form.prenom.trim()));

        // Mettre à jour l'état du bouton suivant en fonction de ces conditions
        setNextButtonDisabled(allFieldsFilled.length !== forms.length || uniqueUsernames.size !== allFieldsFilled.length);
    };

    const handleAddForm = () => {
        if (count < selectedOption) {
            setForms([...forms, {image:'',prenom: '', password: '', classe: '', identifiant: '', motDePasse: ''}]);
            setCount(count + 1);
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
            setIsDataSubmitted(true);
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
                            isDataSubmitted={isDataSubmitted}
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
