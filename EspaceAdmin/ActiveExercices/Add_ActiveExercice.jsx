import { Controller, useForm } from "react-hook-form";
import React, { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { Alert, Image, KeyboardAvoidingView, ScrollView, Text, TextInput, TouchableOpacity, View, Switch } from "react-native";
import * as ImageManipulator from "expo-image-manipulator";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { axiosProvider } from "../../http/httpService";
import styles from "../Exercices/AddExecices.Styles";
import { AntDesign, Entypo } from "@expo/vector-icons";
import { Picker } from '@react-native-picker/picker';
import RNPickerSelect from "react-native-picker-select";
const AddActiveExercices = ({ navigation }) => {
    const { control, handleSubmit, formState: { errors }, reset } = useForm({
        defaultValues: {
            category: '',
            name: '',
            classe: '',
            sub_category: '',
            link: '',
            objective: '',
            active: '0',
        },
    });

    const onSubmit = async (data) => {
        try {
            const token = await AsyncStorage.getItem('TokenAdmin');
            const formData = new FormData();
            Object.keys(data).forEach(key => {
                formData.append(key, data[key]);
            });

            formData.append('created_at', new Date().toISOString());

            const response = await axiosProvider.post('exercises/createExercise', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            });

            console.log(response.data);

            if (response.status === 201) {
                navigation.navigate("ShowExercice")
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
            <ScrollView >
                <View>
                    <View style={{ flexDirection: 'row' }}>
                        <TouchableOpacity onPress={() => navigation.goBack()} >
                            <AntDesign name="left" selectable={true} style={styles.iconLeft} />
                        </TouchableOpacity>
                        <Text style={styles.title}>Ajouter un Exercice</Text>
                    </View>

                    <View style={styles.content}>

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

                        {/* class */}
                        <Controller
                            control={control}
                            render={({ field }) => (
                                <>
                                    <Text style={styles.label}>classe*</Text>
                                    <View style={styles.inputwrapper}>
                                        <RNPickerSelect
                                            onValueChange={(value) => field?.onChange(value)}
                                            items={[
                                                { label: '1/2', value: '1/2' },
                                                { label: '3/4', value: '3/4' },
                                                { label: '5/6', value: '5/6' },
                                                { label: '7/8', value: '7/8' },
                                                { label: '9/10', value: '9/10' },
                                            ]}
                                            value={field?.value}

                                            placeholder={{ label: 'Select a class', value: null }}
                                        />
                                    </View>
                                    {errors.classe && <Text style={{ color: 'red' }}>{errors.classe.message}</Text>}
                                </>
                            )}
                            name="classe"
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
                        {/* active */}
                        <Controller
                            control={control}
                            render={({ field }) => (
                                <>
                                    <Text style={styles.label}>active*</Text>
                                    <View style={styles.switchWrapper}>
                                        <Switch
                                            value={field?.value === '1'}
                                            onValueChange={(value) => field?.onChange(value ? '1' : '0')}
                                            style={styles.switch}
                                        />
                                    </View>
                                    {errors.active && <Text style={{ color: 'red' }}>{errors.active.message}</Text>}
                                </>
                            )}
                            name="active"
                            rules={{ required: 'Ce champ est requis' }}
                        />
                    </View>
                </View>
                <TouchableOpacity style={styles.buttom} onPress={handleSubmit(onSubmit)} >
                    <Text style={styles.textbuttom}>ENREGISTRER</Text>
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    )
}

export default AddActiveExercices;
