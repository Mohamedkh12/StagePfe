import { Controller, useForm } from "react-hook-form";
import React, { useState, useEffect } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View, Switch,ScrollView,KeyboardAvoidingView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { axiosProvider } from "../../http/httpService";
import styles from "../Exercices/AddExecices.Styles";
import { AntDesign } from "@expo/vector-icons";
import RNPickerSelect from "react-native-picker-select";

const AddExercices = ({ navigation }) => {
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

    const [classes, setClasses] = useState([]);
    const [classCategories, setClassCategories] = useState([]);
    const [selectedClass, setSelectedClass] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [subCategories, setSubCategories] = useState([]);

    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const token = await AsyncStorage.getItem('TokenAdmin');
                const response = await axiosProvider.getWithToken('exercises/getAllClass', token);
                setClasses(response.data);
            } catch (error) {
                console.error('Erreur lors de la récupération des classes :', error);
            }
        };

        fetchClasses();
    }, []);

    useEffect(() => {
        if (selectedClass) {
            fetchCategories(selectedClass);
        }
    }, [selectedClass]);

    useEffect(() => {
        if (selectedCategory) {
            fetchSubCategories(selectedCategory);
        }
    }, [selectedCategory]);

    const fetchCategories = async (selectedClass) => {
        try {
            const token = await AsyncStorage.getItem('TokenAdmin');
            const response = await axiosProvider.get('exercises/categories-by-class', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: {
                    classParam: selectedClass,
                },
            });
            // Format the data to ensure each item has a 'label' property
            const formattedData = response.data[selectedClass].map(category => ({ label: category, value: category }));
            setClassCategories(formattedData);
        } catch (error) {
            console.error(error.message);
        }
    };

    const fetchSubCategories = async (selectedCategory) => {
        try {
            const token = await AsyncStorage.getItem('TokenAdmin');
            const response = await axiosProvider.get('exercises/SubCategories-by-categories', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: {
                    category: selectedCategory,
                },
            });
            setSubCategories(response.data[selectedCategory].map(subCategory => ({ label: subCategory, value: subCategory })));
        } catch (error) {
            console.error(error.message);
        }
    };
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
                navigation.navigate('ClassScreens');
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
            <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity onPress={() => navigation.goBack()} >
                    <AntDesign name="left" selectable={true} style={styles.iconLeft} />
                </TouchableOpacity>
                <Text style={styles.title}>Ajouter un Exercice</Text>
            </View>

            <View style={styles.content}>
              
                {/* class */}
                <Controller
                    control={control}
                    render={({ field }) => (
                        <>
                            <Text style={styles.label}>Classe*</Text>
                            <RNPickerSelect
                                onValueChange={(value) => {
                                    field?.onChange(value);
                                    setSelectedClass(value);
                                }}
                                items={classes.map((classe) => ({ label: classe, value: classe }))}
                                value={field?.value}
                                placeholder={{ label: 'Sélectionner une classe', value: null }}
                            />
                            <AntDesign name="down" size={24} color="black" />
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
                            <Text style={styles.label}>Catégorie*</Text>
                            <RNPickerSelect
                                onValueChange={(value) => {
                                    field?.onChange(value);
                                    setSelectedCategory(value);
                                }}
                                items={classCategories}
                                value={field?.value}
                                placeholder={{ label: 'Sélectionner une catégorie', value: null }}
                            />
                            <AntDesign name="down" size={24} color="black" />
                            {errors.category && <Text style={{ color: 'red' }}>{errors.category.message}</Text>}
                        </>
                    )}
                    name="category"
                />

                {/* sub_category */}
                <Controller
                    control={control}
                    rules={{ required: 'Ce champ est requis' }}
                    render={({ field }) => (
                        <>
                            <Text style={styles.label}>Sous-catégorie*</Text>
                            <RNPickerSelect
                                onValueChange={(value) => field?.onChange(value)}
                                items={subCategories}
                                value={field?.value}
                                placeholder={{ label: 'Sélectionner une sous-catégorie', value: null }}
                            />
                            <AntDesign name="down" size={24} color="black" />
                            {errors.sub_category && <Text style={{ color: 'red' }}>{errors.sub_category.message}</Text>}
                        </>
                    )}
                    name="sub_category"
                />
                {/* name */}
                <Controller
                    control={control}
                    render={({ field }) => (
                        <>
                            <Text style={styles.label}>Nom*</Text>
                            <View style={styles.inputwrapper}>
                                <TextInput
                                    placeholder="Nom"
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

                {/* Link */}
                <Controller
                    control={control}
                    render={({ field }) => (
                        <>
                            <Text style={styles.label}>Lien*</Text>
                            <View style={styles.inputwrapper}>
                                <TextInput
                                    placeholder="Lien"
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
                />

                {/* Objectif */}
                <Controller
                    control={control}
                    render={({ field }) => (
                        <>
                            <Text style={styles.label}>Objectif*</Text>
                            <View style={styles.inputwrapper}>
                                <TextInput
                                    multiline
                                    numberOfLines={4}
                                    placeholder="Objectif"
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

                {/* Activé */}
                <Controller
                    control={control}
                    render={({ field }) => (
                        <>
                            <Text style={styles.label}>Actif*</Text>
                            <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
                                <Switch
                                    value={field?.value === '1'}
                                    onValueChange={(value) => field?.onChange(value ? '1' : '0')}
                                    style={{ transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }] }}
                                />
                            </View>
                        </>
                    )}
                    name="active"
                />

                <TouchableOpacity style={styles.button} onPress={handleSubmit(onSubmit)}>
                    <Text style={styles.textButton}>Ajouter</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
</KeyboardAvoidingView>
    );
};

export default AddExercices;
