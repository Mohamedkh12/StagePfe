import React, { useEffect, useState} from 'react';
import {Text, TextInput, TouchableOpacity, View, Image, Platform, Alert, KeyboardAvoidingView} from 'react-native';
import { Entypo, MaterialIcons, AntDesign } from '@expo/vector-icons';
import RNPickerSelect from 'react-native-picker-select';
import styles from './mesEnfants.styles';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import AsyncStorage from "@react-native-async-storage/async-storage";
import JWT from "expo-jwt";
import {Picker} from "@react-native-picker/picker";


const EnfantForm = ({ index,formData, onChildDataChange,isDataSubmitted,onImageSelect,onClasseChange,handleIdentifierChange  }) => {
    const [selectedImage, setSelectedImage] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [parentId, setParentId] = useState('');

    useEffect(() => {
        const getParentId = async () => {
            const token = await AsyncStorage.getItem('jwtToken');
            const decodedToken = JWT.decode(token, 'SECRET-CODE142&of', { timeSkew: 30 });
            setParentId(decodedToken.sub);
        };
        getParentId();
    }, []);


    const openImagePicker = async () => {
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
    };

    const getTitleText = () => {
        if (index === 0) {
            return 'Mon premier enfant';
        } else if (index === 1) {
            return 'Mon second enfant';
        } else {
            return 'Mon troisième enfant';
        }
    };
    const classes = [
        { label: '1/2', value: '1/2' },
        { label: '3/4', value: '3/4' },
        { label: '5/6', value: '5/6' },
        { label: '7/8', value: '7/8' },
        { label: '9/10', value: '9/10' }
    ];
    return (

        <KeyboardAvoidingView >
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
                        onChangeText={text => onChildDataChange(index, 'prenom', text)}
                        value={formData.prenom}
                        inputMode="text"
                        autoComplete="cc-family-name"
                        style={styles.inputcontent}
                    />
                </View>
                <View>
                    <Text style={styles.label}>Classe*</Text>
                    <View style={styles.inputcontent}>
                        <View style={styles.inputwrapper}>
                            {Platform.OS === 'ios' ? (
                                <>
                                    <RNPickerSelect
                                        value={formData.classe}
                                        onValueChange={(value) => onClasseChange(value)}
                                        placeholder={{ label: 'Choisir une classe', value: null }}
                                        items={classes}
                                    />
                                    <AntDesign name="down" size={24} color="black" />
                                </>
                            ) : (
                                <Picker
                                    selectedValue={formData.classe}
                                    style={{ height: 50, width: '100%' }}
                                    onValueChange={(value) => onClasseChange(value)}
                                >
                                    <Picker.Item label="Choisir une classe" value={null} />
                                    {classes.map((item, index) => (
                                        <Picker.Item key={index} label={item.label} value={item.value} />
                                    ))}
                                </Picker>
                            )}
                        </View>
                    </View>
                </View>

                <View>
                    <Text style={styles.label}>Identifiant*</Text>
                    <TextInput
                        style={styles.inputcontent}
                        placeholder="Identifiant"
                        value={formData.prenom.trim() ? `${formData.prenom.toLowerCase()}${parentId}` : ''}
                        onChangeText={(value) => handleIdentifierChange(value)}
                        editable={false}
                    />
                </View>

                <View>
                    <Text style={styles.label}>Mot de passe*</Text>
                    <View style={styles.passwordInputWrapper}>
                        <TextInput
                            placeholder="Password"
                            onChangeText={text => onChildDataChange(index, 'motDePasse', text)}
                            value={formData.motDePasse}
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
                    </View>

                </View>
            </View>
        </KeyboardAvoidingView>
    );
};

export default EnfantForm;
