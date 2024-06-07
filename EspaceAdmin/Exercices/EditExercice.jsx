import React, { useEffect, useState } from "react";
import { Alert, KeyboardAvoidingView, ScrollView, Text, TextInput, TouchableOpacity, View, Platform, Switch } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { axiosProvider } from "../../http/httpService";
import styles from "../../EspaceparentEnfants/updateStyle";
import { AntDesign, Entypo } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import RNPickerSelect from 'react-native-picker-select';

const EditExercice = ({ route, navigation }) => {
    const { ExerciceId, ExerciceName } = route.params;
    const [category, setCategory] = useState("");
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [classe, setClass] = useState("");
    const [subCategory, setSubCategory] = useState("");
    const [objective, setObjective] = useState("");
    const [active, setActive] = useState("");
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

    const onSubmit = async () => {
        try {
            const token = await AsyncStorage.getItem('TokenAdmin');
            const response = await axiosProvider.patch(`exercises/updateExercise/${ExerciceId}`, {
                category: category,
                name: name,
                description: description,
                classe: classe,
                sub_category: subCategory,
                objective: objective,
                active: active,
                updated_at: new Date().toISOString()
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.status === 200) {
                navigation.goBack();
            } else {
                Alert.alert('Erreur', 'Échec de la mise à jour de l\'exercice. Veuillez réessayer.');
            }
        } catch (error) {
            console.error('Erreur lors de la mise à jour de l\'exercice :', error);
            Alert.alert('Erreur', 'Une erreur s\'est produite lors de la mise à jour de l\'exercice.');
        }
    };

    return (
        <KeyboardAvoidingView behavior="padding" enabled >
            <ScrollView style={styles.container}>
                <View>
                    <View style={{ alignItems: 'center', justifyContent: 'space-between', marginTop: 17 }}>
                        <Entypo name="cross" style={styles.iconLeft} onPress={() => navigation.goBack()} />
                        <Text style={styles.h1}>Modifier {ExerciceName}</Text>
                        <TouchableOpacity onPress={onSubmit} style={styles.icon}>
                            <AntDesign name="check" size={24} color={'#242F65'} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.content}>

                        {/* Classe */}
                        <View>
                            <Text style={styles.label}>Classe*</Text>
                            <View style={styles.inputcontent}>
                                <View style={styles.inputwrapper}>
                                    {Platform.OS === 'ios' ? (
                                        <>
                                            <RNPickerSelect
                                                onValueChange={(value) => {
                                                    setClass(value);
                                                    setSelectedClass(value);
                                                }}
                                                items={classes.map((classe) => ({ label: classe, value: classe }))}
                                                value={classe}
                                                placeholder={{ label: 'Sélectionner une classe', value: null }}
                                            />
                                            <AntDesign name="down" size={24} color="black" />
                                        </>
                                    ) : (
                                        <Picker
                                            selectedValue={classe}
                                            style={{ height: 50, width: '100%' }}
                                            onValueChange={(value) => {
                                                setClass(value);
                                                setSelectedClass(value);
                                            }}
                                        >
                                            <Picker.Item label="Choisir une classe" value={null} />
                                            {classes.map((item, index) => (
                                                <Picker.Item key={index} label={item} value={item} />
                                            ))}
                                        </Picker>
                                    )}
                                </View>
                            </View>
                        </View>

                        {/* Catégorie */}
                        <View>
                            <Text style={styles.label}>Catégorie*</Text>
                            <View style={styles.inputwrapper}>
                                <RNPickerSelect
                                    onValueChange={(value) => {
                                        setCategory(value);
                                        setSelectedCategory(value);
                                    }}
                                    items={classCategories}
                                    value={category}
                                    placeholder={{ label: 'Sélectionner une catégorie', value: null }}
                                />
                                <AntDesign name="down" size={24} color="black" />
                            </View>
                        </View>

                        {/* Sous-catégorie */}
                        <View>
                            <Text style={styles.label}>Sous-catégorie*</Text>
                            <View style={styles.inputwrapper}>
                                <RNPickerSelect
                                    onValueChange={(value) => setSubCategory(value)}
                                    items={subCategories}
                                    value={subCategory}
                                    placeholder={{ label: 'Sélectionner une sous-catégorie', value: null }}
                                />
                                <AntDesign name="down" size={24} color="black" />
                            </View>
                        </View>

                        {/* Nom */}
                        <View>
                            <Text style={styles.label}>Nom*</Text>
                            <View style={styles.inputwrapper}>
                                <TextInput
                                    style={styles.inputcontent}
                                    placeholder="Nom"
                                    onChangeText={(text) => setName(text)}
                                    value={name}
                                />
                            </View>
                        </View>

                        {/* Objectif */}
                        <View>
                            <Text style={styles.label}>Objectif*</Text>
                            <View style={styles.inputwrapper}>
                                <TextInput
                                    style={styles.inputcontent}
                                    placeholder="Objectif"
                                    onChangeText={(text) => setObjective(text)}
                                    value={objective}
                                />
                            </View>
                        </View>

                        {/* Actif */}
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ ...styles.label, flex: 1 }}>Actif*</Text>
                            <Switch
                                value={active === '1'}
                                onValueChange={(value) => setActive(value ? '1' : '0')}
                            />
                        </View>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

export default EditExercice;
