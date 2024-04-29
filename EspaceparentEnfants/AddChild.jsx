import {
    Alert,
    Image,
    KeyboardAvoidingView,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import styles from "./AddChildStyle"
import {AntDesign, Entypo, MaterialIcons} from "@expo/vector-icons";
import RNPickerSelect from "react-native-picker-select";
import React, {useEffect, useState} from "react";
import * as ImagePicker from "expo-image-picker";
import {Controller, useForm} from "react-hook-form";
import { axiosProvider } from "../http/httpService";
import * as ImageManipulator from "expo-image-manipulator";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AddChild = ({navigation}) => {
    const { control, handleSubmit,
        formState: { errors }, reset } = useForm(
        {
            defaultValues: {
                prenom: '',
                classe: '',
                image: null,
                identifiant: '',
                password: '',
            },
        }
    );
    const [showPassword, setShowPassword] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [parentId, setParentId] = useState(null);


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
    const fetchParentId = async () => {
        try {
            // Récupération du token depuis AsyncStorage
            const token = await AsyncStorage.getItem('jwtToken');

            // Requête à l'API pour récupérer les données du parent
            const response = await axiosProvider.getWithToken('parents/parent', token);
            console.log('Response from server:', response.data);
            // Vérification de la réponse et extraction de l'ID du parent
            if (response && response.status === 200 && response.data.id) {
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

    const formDataToJson = (formData) => {
        const jsonObject = {};
        for (const [key, value] of formData._parts) {
            jsonObject[key] = value;
        }
        return jsonObject;
    };
    const onSubmit = async (data) => {
        try {
            const formData = new FormData();
            formData.append('username', data.prenom);
            formData.append('classe', data.classe);
            formData.append('email', data.identifiant);
            formData.append('password', data.password);
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

            const token = await AsyncStorage.getItem('jwtToken');

            const response = await axiosProvider.post('parents/createChildren', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            });

            console.log(response.data);

            if (response.status === 201) {
                navigation.navigate('Enfants');
                reset();
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
    };


    return(
        <KeyboardAvoidingView behavior="padding"  style={styles.container}>
            <ScrollView >
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
                            Pour ajouter un compte enfant vous devez passé à l’abonnement supérieur et rajouter XX CHF.
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
                        <Controller
                            control={control}
                            rules={{ required: 'Ce champ est requis' }}
                            render={({ field }) => (
                                <>
                                    <Text style={styles.label}>Prénom*</Text>
                                    <View style={styles.inputwrapper}>
                                        <TextInput
                                            placeholder="Prénom"
                                            onBlur={field?.onBlur}
                                            onChangeText={(value) => field?.onChange(value)}
                                            value={field?.value}
                                            style={styles.inputcontent}
                                        />
                                    </View>
                                    {errors.prenom && <Text style={{ color: 'red' }}>{errors.prenom.message}</Text>}
                                </>
                            )}
                            name="prenom"
                        />

                        {/* classe */}
                        <View>
                            <Controller
                                control={control}
                                render={({ field }) => (
                                    <>
                                        <View>
                                            <Text  style={styles.label}>Classe*</Text>
                                            <View style={styles.inputwrapper}>
                                                <View style={styles.inputcontent}>
                                                    <RNPickerSelect
                                                        value={field.value}
                                                        onValueChange={(value) => field.onChange(value)}
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
                                    </>
                                )}
                                name="classe"
                                rules={{ required: 'Ce champ est requis' }}
                            />
                            {errors.classe && <Text style={{ color: 'red' }}>{errors.classe.message}</Text>}
                        </View>

                        {/* identifiant */}
                        <Controller
                            control={control}
                            rules={{ required: 'Ce champ est requis' }}
                            render={({ field }) => (
                                <>
                                    <Text style={styles.label}>Identifiant*</Text>
                                    <View style={styles.inputwrapper}>
                                        <TextInput
                                            style={styles.inputcontent}
                                            placeholder="Identifiant"
                                            onBlur={field.onBlur}
                                            onChangeText={(value) => field.onChange(value)}
                                            value={field.value}
                                        />
                                    </View>
                                </>
                            )}
                            name="identifiant"
                        />
                        {errors.identifiant && <Text style={{ color: 'red' }}>{errors.identifiant.message}</Text>}

                        {/* Mot de passe */}
                        <Text style={styles.label}>Mot de passe*</Text>
                        <View style={styles.passwordInputWrapper}>
                            <Controller
                                control={control}
                                rules={{
                                    required: 'Ce champ est requis.',
                                    minLength: { value: 8, message: 'Le mot de passe doit avoir 8 caractères.' },
                                }}
                                render={({ field }) => (
                                    <View style={styles.passwordInputContainer}>
                                        <TextInput
                                            placeholder="Password"
                                            onBlur={field.onBlur}
                                            onChangeText={(value) => field.onChange(value)}
                                            value={field.value}
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
                                )}
                                name="password"
                            />
                        </View>
                        {errors.password && (
                            <Text style={{ color: 'red' }}>{errors.password.message}</Text>
                        )}
                    </View>
                </View>
                <TouchableOpacity style={styles.buttom}  onPress={handleSubmit(onSubmit)} >
                    <Text style={styles.textbuttom}>ENREGISTRER</Text>
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

export default AddChild