import { Controller, useForm } from "react-hook-form";
import React, { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { Alert, Image, KeyboardAvoidingView, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import * as ImageManipulator from "expo-image-manipulator";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { axiosProvider } from "../../http/httpService";
import styles from "../../EspaceparentEnfants/AddChildStyle";
import { AntDesign, Entypo } from "@expo/vector-icons";

const AddExercices = ({ navigation }) => {
    const { control, handleSubmit, formState: { errors }, reset } = useForm({
        defaultValues: {
            category: '',
            name: '',
            week: '',
            domaine: '',
            degree: '',
            sub_category: '',
            sub_sub_category: '',
            sub_sub_sub_category: '',
            link: '',
            objective: '',
            code: '',
            trail: '',
            active: '',
            image: null,
            description: '',
            assignment: '',
        },
    });
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

            if (!result.uri) {
                console.log("Selected Image URI is undefined");
                return;
            }
            const resizedImage = await ImageManipulator.manipulateAsync(
                result.uri,
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
            Object.keys(data).forEach(key => {
                formData.append(key, data[key]);
            });

            if (selectedImage) {
                const imageUriParts = selectedImage.split('.');
                const fileExtension = imageUriParts[imageUriParts.length - 1];

                formData.append('image', {
                    uri: selectedImage,
                    name: `image.${fileExtension}`,
                    type: `image/${fileExtension}`,
                });
            }

            console.log('token', token);

            const response = await axiosProvider.post('exercises/createExercise', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
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

    return (
        <KeyboardAvoidingView behavior="padding" style={styles.container}>
            <ScrollView>
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

                        {/* name */}
                        <Controller
                            control={control}
                            render={({ field }) => (
                                <>
                                    <Text style={styles.label}>name*</Text>
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
                                </>
                            )}
                            name="name"
                            rules={{ required: 'Ce champ est requis' }}
                        />

                        {/* week */}
                        <Controller
                            control={control}
                            render={({ field }) => (
                                <>
                                    <Text style={styles.label}>week*</Text>
                                    <View style={styles.inputwrapper}>
                                        <TextInput
                                            placeholder="week"
                                            onBlur={field?.onBlur}
                                            onChangeText={(value) => field?.onChange(value)}
                                            value={field?.value}
                                            style={styles.inputcontent}
                                        />
                                    </View>
                                    {errors.week && <Text style={{ color: 'red' }}>{errors.week.message}</Text>}
                                </>
                            )}
                            name="week"
                            rules={{ required: 'Ce champ est requis' }}
                        />

                        {/* domaine */}
                        <Controller
                            control={control}
                            render={({ field }) => (
                                <>
                                    <Text style={styles.label}>domaine*</Text>
                                    <View style={styles.inputwrapper}>
                                        <TextInput
                                            placeholder="domaine"
                                            onBlur={field?.onBlur}
                                            onChangeText={(value) => field?.onChange(value)}
                                            value={field?.value}
                                            style={styles.inputcontent}
                                        />
                                    </View>
                                    {errors.domaine && <Text style={{ color: 'red' }}>{errors.domaine.message}</Text>}
                                </>
                            )}
                            name="domaine"
                            rules={{ required: 'Ce champ est requis' }}
                        />

                        {/* degree */}
                        <Controller
                            control={control}
                            render={({ field }) => (
                                <>
                                    <Text style={styles.label}>degree*</Text>
                                    <View style={styles.inputwrapper}>
                                        <TextInput
                                            placeholder="degree"
                                            onBlur={field?.onBlur}
                                            onChangeText={(value) => field?.onChange(value)}
                                            value={field?.value}
                                            style={styles.inputcontent}
                                        />
                                    </View>
                                    {errors.degree && <Text style={{ color: 'red' }}>{errors.degree.message}</Text>}
                                </>
                            )}
                            name="degree"
                            rules={{ required: 'Ce champ est requis' }}
                        />
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

                        {/* sub_category */}
                        <Controller
                            control={control}
                            render={({ field }) => (
                                <>
                                    <Text style={styles.label}>sub_category*</Text>
                                    <View style={styles.inputwrapper}>
                                        <TextInput
                                            placeholder="sub_category"
                                            onBlur={field?.onBlur}
                                            onChangeText={(value) => field?.onChange(value)}
                                            value={field?.value}
                                            style={styles.inputcontent}
                                        />
                                    </View>
                                    {errors.sub_category && <Text style={{ color: 'red' }}>{errors.sub_category.message}</Text>}
                                </>
                            )}
                            name="sub_category"
                            rules={{ required: 'Ce champ est requis' }}
                        />

                        {/* sub_sub_category */}
                        <Controller
                            control={control}
                            render={({ field }) => (
                                <>
                                    <Text style={styles.label}>sub_sub_category*</Text>
                                    <View style={styles.inputwrapper}>
                                        <TextInput
                                            placeholder="sub_sub_category"
                                            onBlur={field?.onBlur}
                                            onChangeText={(value) => field?.onChange(value)}
                                            value={field?.value}
                                            style={styles.inputcontent}
                                        />
                                    </View>
                                    {errors.sub_sub_category && <Text style={{ color: 'red' }}>{errors.sub_sub_category.message}</Text>}
                                </>
                            )}
                            name="sub_sub_category"
                            rules={{ required: 'Ce champ est requis' }}
                        />

                        {/* sub_sub_sub_category */}
                        <Controller
                            control={control}
                            render={({ field }) => (
                                <>
                                    <Text style={styles.label}>sub_sub_sub_category*</Text>
                                    <View style={styles.inputwrapper}>
                                        <TextInput
                                            placeholder="sub_sub_sub_category"
                                            onBlur={field?.onBlur}
                                            onChangeText={(value) => field?.onChange(value)}
                                            value={field?.value}
                                            style={styles.inputcontent}
                                        />
                                    </View>
                                    {errors.sub_sub_sub_category && <Text style={{ color: 'red' }}>{errors.sub_sub_sub_category.message}</Text>}
                                </>
                            )}
                            name="sub_sub_sub_category"
                            rules={{ required: 'Ce champ est requis' }}
                        />

                        {/* link */}
                        <Controller
                            control={control}
                            render={({ field }) => (
                                <>
                                    <Text style={styles.label}>link*</Text>
                                    <View style={styles.inputwrapper}>
                                        <TextInput
                                            placeholder="link"
                                            onBlur={field?.onBlur}
                                            onChangeText={(value) => field?.onChange(value)}
                                            value={field?.value}
                                            style={styles.inputcontent}
                                        />
                                    </View>
                                    {errors.link && <Text style={{ color: 'red' }}>{errors.link.message}</Text>}
                                </>
                            )}
                            name="link"
                            rules={{ required: 'Ce champ est requis' }}
                        />

                        {/* objective */}
                        <Controller
                            control={control}
                            render={({ field }) => (
                                <>
                                    <Text style={styles.label}>objective*</Text>
                                    <View style={styles.inputwrapper}>
                                        <TextInput
                                            placeholder="objective"
                                            onBlur={field?.onBlur}
                                            onChangeText={(value) => field?.onChange(value)}
                                            value={field?.value}
                                            style={styles.inputcontent}
                                        />
                                    </View>
                                    {errors.objective && <Text style={{ color: 'red' }}>{errors.objective.message}</Text>}
                                </>
                            )}
                            name="objective"
                            rules={{ required: 'Ce champ est requis' }}
                        />

                        {/* code */}
                        <Controller
                            control={control}
                            render={({ field }) => (
                                <>
                                    <Text style={styles.label}>code*</Text>
                                    <View style={styles.inputwrapper}>
                                        <TextInput
                                            placeholder="code"
                                            onBlur={field?.onBlur}
                                            onChangeText={(value) => field?.onChange(value)}
                                            value={field?.value}
                                            style={styles.inputcontent}
                                        />
                                    </View>
                                    {errors.code && <Text style={{ color: 'red' }}>{errors.code.message}</Text>}
                                </>
                            )}
                            name="code"
                            rules={{ required: 'Ce champ est requis' }}
                        />

                        {/* trail */}
                        <Controller
                            control={control}
                            render={({ field }) => (
                                <>
                                    <Text style={styles.label}>trail*</Text>
                                    <View style={styles.inputwrapper}>
                                        <TextInput
                                            placeholder="trail"
                                            onBlur={field?.onBlur}
                                            onChangeText={(value) => field?.onChange(value)}
                                            value={field?.value}
                                            style={styles.inputcontent}
                                        />
                                    </View>
                                    {errors.trail && <Text style={{ color: 'red' }}>{errors.trail.message}</Text>}
                                </>
                            )}
                            name="trail"
                            rules={{ required: 'Ce champ est requis' }}
                        />

                        {/* active */}
                        {/*<Controller
                            control={control}
                            render={({ field }) => (
                                <>
                                    <Text style={styles.label}>active*</Text>
                                    <View style={styles.inputwrapper}>
                                        <TextInput
                                            placeholder="active"
                                            onBlur={field?.onBlur}
                                            onChangeText={(value) => field?.onChange(value)}
                                            value={field?.value}
                                            style={styles.inputcontent}
                                        />
                                    </View>
                                    {errors.active && <Text style={{ color: 'red' }}>{errors.active.message}</Text>}
                                </>
                            )}
                            name="active"
                            rules={{ required: 'Ce champ est requis' }}
                        />*/}
                    </View>
                </View>
                <TouchableOpacity style={styles.buttom} onPress={handleSubmit(onSubmit)} >
                    <Text style={styles.textbuttom}>ENREGISTRER</Text>
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    )
}

export default AddExercices;
