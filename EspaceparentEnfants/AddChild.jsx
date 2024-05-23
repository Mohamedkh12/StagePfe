import React, { useEffect, useState } from "react";
import {
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import { AntDesign, Entypo, MaterialIcons } from "@expo/vector-icons";
import RNPickerSelect from "react-native-picker-select";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { axiosProvider } from "../http/httpService";
import styles from "./AddChildStyle";
import mime from "mime";
import axios from "axios";

const AddChild = ({ navigation }) => {
    const [identifiant, setIdentifiant] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [password, setPassword] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);
    const [parentId, setParentId] = useState(null);
    const [prenom, setPrenom] = useState('');
    const [classe, setClasse] = useState('');
    const [prenomError, setPrenomError] = useState('');
    const [IdentifiantError, setIdentifiantError] = useState('');
    const [classeError, setClasseError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    // Fonction pour ouvrir la bibliothèque d'images
    const openImagePicker = async () => {
        // Gestion des permissions
        try {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission Denied', 'Sorry, we need camera roll permission to upload images.');
                return;
            }
            // Lancer la bibliothèque d'images
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 1,
                base64: true
            });

            if (result.cancelled) {
                console.log("Image selection cancelled");
                return;
            }

            if (!result.assets[0].uri) {
                console.log("Selected Image URI is undefined");
                return;
            }
            // Manipuler l'image sélectionnée
            const resizedImage = await ImageManipulator.manipulateAsync(
                result.assets[0].uri,
                [{ resize: { width: 80, height: 80 } }],
                { compress: 0.5, format: ImageManipulator.SaveFormat.JPEG }
            );

            setSelectedImage(resizedImage.uri);
            console.log("Selected Image:", resizedImage.uri);
        } catch (error) {
            console.error('Error picking image: ', error);
            Alert.alert('Error', "Une erreur s'est produite lors du choix de l'image.");
        }
    };

    // Fonction pour récupérer l'ID du parent depuis AsyncStorage
    const fetchParentId = async () => {
        try {
            const token = await AsyncStorage.getItem('jwtToken');
            const response = await axiosProvider.getWithToken('parents/parent', token);

            if (response  && response.data.id) {
                setParentId(response.data.id);
                console.log('Parent ID:', response.data.id);
            } else {
                throw new Error('Parent ID not found in response data');
            }
        } catch (error) {
            console.error('Error fetching parent ID:', error);
            Alert.alert('Error', 'Une erreur s\'est produite lors de la récupération des informations du parent.');
        }
    };

    useEffect(() => {
        fetchParentId();
    }, []);

    // Fonction pour générer l'identifiant
    const generateIdentifiant = (prenom, parentId) => {
        if (parentId && prenom) {
            return `${prenom}${parentId}`;
        }
        return '';
    };

    useEffect(() => {
        setIdentifiant(generateIdentifiant(prenom, parentId));
    }, [prenom, parentId]);
    const resetForm = () => {
        setSelectedImage(null);
        setShowPassword(false);
        setPrenom("");
        setClasse(null);
        setIdentifiant("");
        setPassword("");
    };

    // Fonction pour soumettre le formulaire
    const onSubmit = async () => {
        // Réinitialiser les messages d'erreur
        setPrenomError('');
        setClasseError('');
        setPasswordError('');
        setIdentifiantError('')
        let formIsValid = true;

        // Vérifier les champs obligatoires
        if (!prenom) {
            setPrenomError('Le prénom est requis');
            formIsValid = false;
        }
        if (!identifiant) {
            setIdentifiantError('L\'identifiant est requis');
            formIsValid = false;
        }
        if (!classe) {
            setClasseError('La classe est requise');
            formIsValid = false;
        }

        if (!password) {
            setPasswordError('Le mot de passe est requis');
            formIsValid = false;
        }

        if (formIsValid) {
            try {
                const formData = new FormData();
                formData.append('username', prenom);
                formData.append('classe', classe);
                formData.append('email', identifiant);
                formData.append('password', password);
                formData.append('id_parent', parentId);
                formData.append('roleId', 3);

                if(selectedImage) {
                    if(Platform.OS==='ios'){
                        const imageUriParts = selectedImage.split('.');
                        const fileExtension = imageUriParts[imageUriParts.length - 1];

                        formData.append('image', {
                            uri: selectedImage,
                            name: `image.${fileExtension}`,
                            type: `image/${fileExtension}`,
                        });
                    }if (Platform.OS === 'android') {
                        if(selectedImage) {
                            const newImageUri = "file:///" + selectedImage.split("file:/").join("");

                            formData.append('image', {
                                uri: newImageUri,
                                type: mime.getType(newImageUri),
                                name: newImageUri.split("/").pop()
                            });
                        }
                    }
                }

                console.log(formData)

                const token = await AsyncStorage.getItem('jwtToken');
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
                if (response && response.status === 201) {
                    navigation.navigate('Enfants');
                    resetForm();
                } else {
                    Alert.alert('Erreur', 'Échec de la création d\'un compte. Veuillez réessayer.');
                }
            } catch (error) {
                console.error('Erreur lors de la création du compte :', error);

                if (error.response && error.response.data) {
                    console.error('Server response:', error.response.data);
                }

                Alert.alert('Erreur', 'Une erreur s\'est produite lors de la création du compte.');
            }
        }
    };

    return (
        <KeyboardAvoidingView behavior="padding" style={styles.container}>
            <ScrollView>
                <View>
                    <View style={{ flexDirection: 'row' }}>
                        <TouchableOpacity onPress={() => navigation.goBack()} >
                            <AntDesign name="left" selectable={true} style={styles.iconLeft} />
                        </TouchableOpacity>
                        <Text style={styles.title}>Ajouter un compte enfant</Text>
                    </View>
                    <View>
                        <Text style={styles.text}>
                            Votre abonnement actuel vous permet d’avoir un seul compte enfant.
                            Pour ajouter un compte enfant vous devez passer à l’abonnement supérieur et rajouter XX CHF.
                        </Text>
                    </View>
                    <View style={styles.content}>
                        <View>
                            <Text style={styles.h2}>Mon enfant</Text>
                        </View>
                        <View>
                            <Text style={styles.label}>Choisir la photo de votre enfant</Text>
                            {selectedImage ? (
                                <TouchableOpacity onPress={openImagePicker} style={styles.inputimagewrapper}>
                                    <Image source={{ uri: selectedImage }} style={styles.uploadedImage} />
                                </TouchableOpacity>
                            ) : (
                                <TouchableOpacity onPress={openImagePicker} style={styles.inputimagewrapper}>
                                    <Entypo name="plus" style={styles.iconplus} />
                                    <Text style={styles.textimage}>AJOUTER UNE IMAGE</Text>
                                </TouchableOpacity>
                            )}
                        </View>

                        {/* Prénom */}
                        <Text style={styles.label}>Prénom*</Text>
                        <View style={styles.inputwrapper}>
                            <TextInput
                                placeholder="Prénom"
                                onChangeText={(value) => setPrenom(value)}
                                value={prenom}
                                style={styles.inputcontent}
                            />
                        </View>
                        {prenomError ? <Text style={{ color: 'red' }}>{prenomError}</Text> : null}

                        {/* Classe */}
                        <View>
                            <Text style={styles.label}>Classe*</Text>
                            <View style={styles.classInputWrapper}>
                                <View style={styles.classInputContent}>
                                    <RNPickerSelect
                                        value={classe}
                                        onValueChange={(value) => setClasse(value)}
                                        placeholder={{ label: 'Choisir une classe', value: null }}
                                        items={[
                                            { label: '1/2', value: '1/2' },
                                            { label: '3/4', value: '3/4' },
                                            { label: '5/6', value: '5/6' },
                                            { label: '7/8', value: '7/8' },
                                            { label: '9/10', value: '9/10' },
                                        ]}
                                    />
                                </View>
                                {Platform.OS === 'ios' && <AntDesign name="down" size={24} color="black" style={styles.icon} />}
                            </View>
                            {classeError ? <Text style={{ color: 'red' }}>{classeError}</Text> : null}
                        </View>

                        {/* Identifiant */}
                        <Text style={styles.label}>Identifiant*</Text>
                        <View style={styles.inputwrapper}>
                            <TextInput
                                style={styles.inputcontent}
                                placeholder="Identifiant"
                                onChangeText={(value) => setIdentifiant(value)}
                                value={identifiant}
                                editable={false}
                            />
                        </View>
                        {IdentifiantError ? <Text style={{ color: 'red' }}>{IdentifiantError}</Text> : null}
                        {/* Mot de passe */}
                        <Text style={styles.label}>Mot de passe*</Text>
                        <View style={styles.passwordInputWrapper}>
                            <TextInput
                                placeholder="Password"
                                onChangeText={(value) => setPassword(value)}
                                secureTextEntry={!showPassword}
                                inputMode="text"
                                autoCompleteType="password"
                                style={styles.passwordInput}
                            />
                            <MaterialIcons
                                style={styles.passwordIcon}
                                name={showPassword ? 'visibility' : 'visibility-off'}
                                onPress={() => setShowPassword(!showPassword)}
                            />
                        </View>
                        {passwordError ? <Text style={{ color: 'red' }}>{passwordError}</Text> : null}
                    </View>
                </View>
                {/* Bouton pour soumettre le formulaire */}
                <TouchableOpacity style={styles.buttom} onPress={onSubmit} >
                    <Text style={styles.textbuttom}>ENREGISTRER</Text>
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default AddChild;