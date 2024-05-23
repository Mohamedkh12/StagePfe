import React, {useEffect, useState} from "react";
import {
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import styles from "./updateStyle"
import { AntDesign, Entypo, MaterialIcons } from "@expo/vector-icons";
import RNPickerSelect from "react-native-picker-select";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import AsyncStorage from "@react-native-async-storage/async-storage";
import JWT from "expo-jwt";
import { axiosProvider } from "../http/httpService";
import mime from 'mime';

const UpdateCompteChild = ({ route, navigation }) => {
    const { childId, childName } = route.params;
    const [selectedImage, setSelectedImage] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [prenom, setPrenom] = useState("");
    const [classe, setClasse] = useState(null);
    const [identifiant, setIdentifiant] = useState("");
    const [password, setPassword] = useState("");
    const getToken = async (key) => {
        return await AsyncStorage.getItem(key);
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
                { compress: 0.5, format: ImageManipulator.SaveFormat.JPEG }
            );

            setSelectedImage(resizedImage.uri);
            console.log("Selected Image:", resizedImage.uri);
        } catch (error) {
            console.error('Error picking image: ', error);
            Alert.alert('Error', "Une erreur s'est produite lors du choix de l'image.");
        }
    };
    const resetForm = () => {
        setSelectedImage(null);
        setShowPassword(false);
        setPrenom("");
        setClasse(null);
        setIdentifiant("");
        setPassword("");
    };


    const onSubmit = async () => {
        try {
            const token = await AsyncStorage.getItem('jwtToken');
            const decodedToken = JWT.decode(token, 'SECRET-CODE142&of');
            const parentId = decodedToken.sub;
            const formData = new FormData();
            formData.append('username', prenom);
            formData.append('classe', classe);
            formData.append('email', identifiant);
            formData.append('password', password);
            formData.append('id_parent', parentId);

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
            const response = await axiosProvider.patch(`parents/updateChild/${childId}`, formData, token);
            console.log(response.data)

            if (response.status === 200) {
                console.log(response.data)
                navigation.navigate('Enfants')
                resetForm();
            } else {

                Alert.alert('Erreur', 'Échec de la mise à jour du compte. Veuillez réessayer.');
            }
        } catch (error) {
            console.error('Erreur lors de la mise à jour du compte :', error);
            Alert.alert('Erreur', 'Une erreur s\'est produite lors de la mise à jour du compte.');
        }
    };
    const checkChildExists = async (prenom) => {
        if (prenom) {
            const token = await getToken('jwtToken');
            const decodedToken = JWT.decode(token, 'SECRET-CODE142&of', { timeSkew: 30 });
            const parentId = decodedToken.sub;
            setIdentifiant(`${prenom}${parentId}`);
        }else{
            setIdentifiant('');
        }
    };
    useEffect(() => {
        checkChildExists(prenom);
    }, [prenom]);
    return (
        <KeyboardAvoidingView behavior="padding" enabled >
            <ScrollView style={styles.container}>
                <View >
                    <View style={{ alignItems: 'center', justifyContent: 'space-between', marginTop: 17 }}>
                        <AntDesign name="check" onPress={onSubmit} style={styles.icon} />
                        <Text style={styles.h1}>Modifier le compte de {childName}</Text>
                        <Entypo name="cross" style={styles.iconLeft} onPress={() => navigation.goBack()} />
                    </View>
                    <View style={styles.content}>
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
                        <View>
                            <Text style={styles.label}>Prénom*</Text>
                            <View style={styles.inputwrapper}>
                                <TextInput
                                    placeholder="Prénom"
                                    onChangeText={(text) => setPrenom(text)}
                                    value={prenom}
                                    style={styles.inputcontent}
                                />
                            </View>
                        </View>

                        {/* classe */}
                        <View>
                            <Text style={styles.label}>Classe*</Text>
                            <View style={styles.inputwrapper}>
                                <View style={styles.inputcontent}>
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
                                <AntDesign name="down" size={24} color="black" />
                            </View>
                        </View>

                        {/* identifiant */}
                        <View>
                            <Text style={styles.label}>Identifiant*</Text>
                            <View style={styles.inputwrapper}>
                                <TextInput
                                    style={styles.inputcontent}
                                    placeholder="Identifiant"
                                    value={identifiant}
                                    editable={false}
                                />
                            </View>
                        </View>

                        {/* Mot de passe */}
                        <Text style={styles.label}>Mot de passe*</Text>
                        <View style={styles.passwordInputWrapper}>
                            <View style={styles.passwordInputContainer}>
                                <TextInput
                                    placeholder="Password"
                                    onChangeText={(text) => setPassword(text)}
                                    value={password}
                                    secureTextEntry={!showPassword}
                                    inputMode="text"
                                    autoCompleteType="password"
                                    style={styles.passwordInput}
                                    minLength={8}
                                />
                                <MaterialIcons
                                    style={styles.passwordIcon}
                                    name={showPassword ? 'visibility' : 'visibility-off'}
                                    onPress={() => setShowPassword(!showPassword)}
                                />
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

export default UpdateCompteChild;
