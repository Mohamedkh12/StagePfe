import React, { useEffect, useState} from 'react';
import {  Text, TextInput, TouchableOpacity, View, Image, SafeAreaView, Alert } from 'react-native';
import { Entypo, MaterialIcons, AntDesign } from '@expo/vector-icons';
import RNPickerSelect from 'react-native-picker-select';
import styles from './mesEnfants.styles';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';


const EnfantForm = ({ index, onChildDataChange,isDataSubmitted ,errorMessages, onImageSelect }) => {
    const [selectedImage, setSelectedImage] = useState('');
    const [prenom, setPrenom] = useState('');
    const [classe, setClasse] = useState(null);
    const [identifiant, setIdentifiant] = useState('');
    const [motDePasse, setMotDePasse] = useState('');
    const [showPassword, setShowPassword] = useState(false);


    useEffect(() => {
        if (isDataSubmitted) {
            handleAddEnfant();
        }
    }, [isDataSubmitted]);
    const handleAddEnfant = async () => {
        const childData = {
            image: selectedImage,
            prenom,
            classe,
            identifiant,
            motDePasse,
        };
        try {
            onChildDataChange(index, childData, selectedImage);
        } catch (error) {
            console.error('Error saving child data:', error);
            Alert.alert('Error', 'An error occurred while saving child data.');
        }
    };


    const openImagePicker = async () => {
        try {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission Denied', 'Sorry, we need camera roll permission to upload images.');
                return;
            }
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
            const resizedImage = await ImageManipulator.manipulateAsync(
                result.assets[0].uri,
                [{ resize: { width: 80, height: 80 } }],
                { compress: 0.3, format: ImageManipulator.SaveFormat.JPEG }
            );

            setSelectedImage(resizedImage.uri);
            onImageSelect(resizedImage.uri);
            console.log("Selected Image:", resizedImage.uri);
        } catch (error) {
            console.error('Error picking image: ', error);
            Alert.alert('Error', "Une erreur s'est produite lors du choix de l'image.");
        }
    };

    const getTitleText = () => {
        if (index === 1) {
            return 'Mon premier enfant';
        } else if (index === 2) {
            return 'Mon second enfant';
        } else {
            return 'Mon troisième enfant';
        }
    };

    return (

            <SafeAreaView>
                <View style={styles.content}>
                    <View>
                        <Text style={styles.h2}>{getTitleText()}</Text>
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

                    <View>
                        <Text style={styles.label}>Prénom*</Text>
                        <TextInput
                            placeholder="Prénom"
                            onChangeText={(value) => {
                                setPrenom(value);
                            }}
                            value={prenom}
                            inputMode="text"
                            autoComplete="cc-family-name"
                            style={styles.inputcontent}
                        />
                        {errorMessages && errorMessages[index] && errorMessages[index].prenom && (
                            <Text style={{ color: 'red' }}>{errorMessages[index].prenom}</Text>
                        )}
                    </View>
                    <View>
                        <Text style={styles.label}>Classe*</Text>
                        <View style={styles.inputcontent}>
                            <View style={styles.inputwrapper}>
                                <RNPickerSelect
                                    value={classe}
                                    onValueChange={(value) => {
                                        setClasse(value);
                                    }}
                                    placeholder={{ label: 'Choisir une classe', value: null }}
                                    items={[
                                        { label: '1/2', value: '1/2' },
                                        { label: '3/4', value: '3/4' },
                                        { label: '5/6', value: '5/6' },
                                        { label: '7/8', value: '7/8' },
                                        { label: '9/10', value: '9/10' },
                                    ]}
                                />
                                <AntDesign name="down" size={24} color="black" />
                            </View>
                        </View>
                        {errorMessages && errorMessages.classe && <Text style={{ color: 'red' }}>{errorMessages.classe}</Text>}
                    </View>

                    <Text style={styles.h2}>Connexion</Text>

                    <View>
                        <Text style={styles.label}>Identifiant*</Text>
                        <TextInput
                            style={styles.inputcontent}
                            placeholder="Identifiant"
                            onChangeText={(value) => {
                                setIdentifiant(value);
                            }}
                            value={identifiant}
                        />
                        {errorMessages && errorMessages.identifiant && <Text style={{ color: 'red' }}>{errorMessages.identifiant}</Text>}
                    </View>

                    <View>
                        <Text style={styles.label}>Mot de passe*</Text>
                        <View style={styles.passwordInputWrapper}>
                            <TextInput
                                placeholder="Password"
                                onChangeText={(value) => {
                                    setMotDePasse(value);
                                }}
                                value={motDePasse}
                                secureTextEntry={showPassword}
                                inputMode="text"
                                autoCompleteType="password"
                                minLength={8}
                                style={styles.passwordInput}
                            />
                            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                <MaterialIcons
                                    name={showPassword ? 'visibility' : 'visibility-off'}
                                    style={styles.passwordIcon}
                                />
                            </TouchableOpacity>
                            {errorMessages && errorMessages.motDePasse && <Text style={{ color: 'red' }}>{errorMessages.motDePasse}</Text>}
                        </View>

                    </View>
                </View>
            </SafeAreaView>
    );
};

export default EnfantForm;
