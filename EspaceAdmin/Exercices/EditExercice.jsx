import React, {useState} from "react";
import * as ImagePicker from "expo-image-picker";
import {Alert, Image, KeyboardAvoidingView, ScrollView, Text, TextInput, TouchableOpacity, View} from "react-native";
import * as ImageManipulator from "expo-image-manipulator";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {axiosProvider} from "../../http/httpService";
import styles from "../../EspaceparentEnfants/updateStyle";
import {AntDesign, Entypo, MaterialIcons} from "@expo/vector-icons";

const EditExercice = ({ route, navigation }) => {
    const { ExerciceId, ExerciceName } = route.params;
    const [selectedImage, setSelectedImage] = useState(null);
    const [category, setCategory] = useState("");
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [week, setWeek] = useState("");
    const [domaine, setDomaine] = useState("");
    const [degree, setDegree] = useState("");
    const [subCategory, setSubCategory] = useState("");
    const [subSubCategory, setSubSubCategory] = useState("");
    const [subSubSubCategory, setSubSubSubCategory] = useState("");
    const [objective, setObjective] = useState("");
    const [code, setCode] = useState("");
    const [trail, setTrail] = useState("");
    const [active, setActive] = useState("");

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
                { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
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
        setName("");
        setCategory('')
        setDescription("");
        setAssignment("");
    };


    const onSubmit = async () => {
        try {
            const token = await AsyncStorage.getItem('TokenAdmin');
            const formData = new FormData();
            formData.append('category', category);
            formData.append('name', name);
            formData.append('description', description);
            formData.append('week', week);
            formData.append('domaine', domaine);
            formData.append('degree', degree);
            formData.append('sub_category', subCategory);
            formData.append('sub_sub_category', subSubCategory);
            formData.append('sub_sub_sub_category', subSubSubCategory);
            formData.append('link', link);
            formData.append('objective', objective);
            formData.append('code', code);
            formData.append('trail', trail);
            formData.append('active', active);
            if (selectedImage) {
                const imageUriParts = selectedImage.split('.');
                const fileExtension = imageUriParts[imageUriParts.length - 1];

                formData.append('image', {
                    uri: selectedImage,
                    name: `image.${fileExtension}`,
                    type: `image/${fileExtension}`,
                });
            }

            const response = await axiosProvider.patch(`exercises/updateExercise/${ExerciceId}`, formData, token);
            console.log(response.data)

            if (response.status === 200) {
                console.log(response.data)
                navigation.goBack();
                resetForm();
            } else {
                // Échec de la mise à jour
                Alert.alert('Erreur', 'Échec de la mise à jour du l\'Exercice. Veuillez réessayer.');
            }
        } catch (error) {
            console.error('Erreur lors de la mise à jour du compte :', error);
            Alert.alert('Erreur', 'Une erreur s\'est produite lors de la mise à jour du l\'Exercice.');
        }
    };
    return (
        <KeyboardAvoidingView behavior="padding" enabled >
            <ScrollView style={styles.container}>
                <View >
                    <View style={{ alignItems: 'center', justifyContent: 'space-between', marginTop: 17 }}>
                        <AntDesign name="check" onPress={onSubmit} style={styles.icon} />
                        <Text style={styles.h1}>Modifier {ExerciceName}</Text>
                        <Entypo name="cross" style={styles.iconLeft} onPress={() => navigation.goBack()} />
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
                        <View>
                            <Text style={styles.label}>category*</Text>
                            <View style={styles.inputwrapper}>
                                <TextInput
                                    placeholder="category"
                                    onChangeText={(text) => setCategory(text)}
                                    value={category}
                                    style={styles.inputcontent}
                                />
                            </View>
                        </View>


                        {/* name */}
                        <View>
                            <Text style={styles.label}>name*</Text>
                            <View style={styles.inputwrapper}>
                                <TextInput
                                    style={styles.inputcontent}
                                    placeholder="name"
                                    onChange={(e) => setName(e.nativeEvent.text)}
                                    value={name}
                                />
                            </View>
                        </View>

                        {/* description */}
                        <View>
                            <Text style={styles.label}>description*</Text>
                            <View style={styles.inputwrapper}>
                                <TextInput
                                    style={styles.inputcontent}
                                    placeholder="description"
                                    onChange={(e) => setDescription(e.nativeEvent.text)}
                                    value={description}
                                />
                            </View>
                        </View>

                        {/* assignment */}
                        <View>
                            <Text style={styles.label}>assignment*</Text>
                            <View style={styles.inputwrapper}>
                                <TextInput
                                    style={styles.inputcontent}
                                    placeholder="assignment"
                                    onChange={(e) => setAssignment(e.nativeEvent.text)}
                                    value={assignment}
                                />
                            </View>
                        </View>

                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );

}

export default EditExercice