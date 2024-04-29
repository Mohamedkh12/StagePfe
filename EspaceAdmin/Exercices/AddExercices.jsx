import {Controller, useForm} from "react-hook-form";
import React, {useState} from "react";
import * as ImagePicker from "expo-image-picker";
import {Alert, Image, KeyboardAvoidingView, ScrollView, Text, TextInput, TouchableOpacity, View} from "react-native";
import * as ImageManipulator from "expo-image-manipulator";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {axiosProvider} from "../../http/httpService";
import styles from "../../EspaceparentEnfants/AddChildStyle";
import {AntDesign, Entypo} from "@expo/vector-icons";
import JWT from 'expo-jwt';
import categoryExercice from "./CategoryExercice";
const AddExercices = ({navigation}) => {
    const { control, handleSubmit,
        formState: { errors }, reset } = useForm(
        {
            defaultValues: {
                category: '',
                name: '',
                image: null,
                description: '',
                assignment: '',
            },
        }
    );
    const [selectedImage, setSelectedImage] = useState(null);
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
                { compress: 0.6, format: ImageManipulator.SaveFormat.JPEG }
            );

            setSelectedImage(resizedImage.uri);
            console.log("Selected Image:", resizedImage.uri);
        } catch (error) {
            console.error('Error picking image: ', error);
            Alert.alert('Error', "Une erreur s'est produite lors du choix de l'image.");
        }
    };
    const onSubmit = async (data) => {
        try {
            const token = await AsyncStorage.getItem('TokenAdmin');
            const formData = new FormData();
            formData.append('category', data.category);
            formData.append('name', data.name);
            formData.append('description', data.description);
            formData.append('assignment', data.assignment);

            if (selectedImage) {
                const imageUriParts = selectedImage.split('.');
                const fileExtension = imageUriParts[imageUriParts.length - 1];

                formData.append('image', {
                    uri: selectedImage,
                    name: `image.${fileExtension}`,
                    type: `image/${fileExtension}`,
                });
            }

            console.log('token',token)

            const response = await axiosProvider.post('exercises/createExercise', formData,{
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}`
            });

            console.log(response.data);

            if (response.status === 201) {
                navigation.navigate('AdminExercices', { selectedCategory: data.category });
                reset();
            } else {
                Alert.alert('Erreur', 'Échec de la création d\'un exercice. Veuillez réessayer.');
            }
        } catch (error) {
            console.error('Erreur lors de la création d\'un exercice :', error);

            if (error.response && error.response.data) {
                console.error('Server response:', error.response.data);
            }

            Alert.alert('Erreur', 'Une erreur s\'est produite lors de la création d\'un exercice.');
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

                        <Text style={styles.title}>Ajouter un Exercice</Text>
                    </View>

                    <View style={styles.content}>

                        <View>
                            <Text style={styles.label}>Choisir la photo de l'exercice</Text>
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

                        {/* category */}
                        <Controller
                            control={control}
                            rules={{ required: 'Ce champ est requis' }}
                            render={({ field }) => (
                                <>
                                    <Text style={styles.label}>category*</Text>
                                    <View style={styles.inputwrapper}>
                                        <TextInput
                                            placeholder="category"
                                            onBlur={field?.onBlur}
                                            onChangeText={(value) => field?.onChange(value)}
                                            value={field?.value}
                                            style={styles.inputcontent}
                                        />
                                    </View>
                                    {errors.category && <Text style={{ color: 'red' }}>{errors.category.message}</Text>}
                                </>
                            )}
                            name="category"
                        />

                        {/* name */}
                        <View>
                            <Controller
                                control={control}
                                render={({ field }) => (
                                    <>
                                        <View>
                                            <Text  style={styles.label}>name*</Text>
                                            <View style={styles.inputwrapper}>
                                                <TextInput
                                                    placeholder="name"
                                                    onBlur={field?.onBlur}
                                                    onChangeText={(value) => field?.onChange(value)}
                                                    value={field?.value}
                                                    style={styles.inputcontent}
                                                />
                                            </View>
                                            {errors.name && <Text style={{ color: 'red' }}>{errors.name.message}</Text>}
                                        </View>
                                    </>
                                )}
                                name="name"
                                rules={{ required: 'Ce champ est requis' }}
                            />
                            {errors.classe && <Text style={{ color: 'red' }}>{errors.name.message}</Text>}
                        </View>

                        {/* description */}
                        <Controller
                            control={control}
                            rules={{ required: 'Ce champ est requis' }}
                            render={({ field }) => (
                                <>
                                    <Text style={styles.label}>description*</Text>
                                    <View style={styles.inputwrapper}>
                                        <TextInput
                                            style={styles.inputcontent}
                                            placeholder="description"
                                            onBlur={field.onBlur}
                                            onChangeText={(value) => field.onChange(value)}
                                            value={field.value}
                                        />
                                    </View>
                                </>
                            )}
                            name="description"
                        />
                        {errors.description && <Text style={{ color: 'red' }}>{errors.description.message}</Text>}

                        {/* assignment */}
                        <Controller
                            control={control}
                            rules={{ required: 'Ce champ est requis' }}
                            render={({ field }) => (
                                <>
                                    <Text style={styles.label}>assignment*</Text>
                                    <View style={styles.inputwrapper}>
                                        <TextInput
                                            style={styles.inputcontent}
                                            placeholder="assignment"
                                            onBlur={field.onBlur}
                                            onChangeText={(value) => field.onChange(value)}
                                            value={field.value}
                                        />
                                    </View>
                                </>
                            )}
                            name="assignment"
                        />
                        {errors.assignment && <Text style={{ color: 'red' }}>{errors.assignment.message}</Text>}
                    </View>
                </View>
                <TouchableOpacity style={styles.buttom}  onPress={handleSubmit(onSubmit)} >
                    <Text style={styles.textbuttom}>ENREGISTRER</Text>
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    )
}

export default AddExercices