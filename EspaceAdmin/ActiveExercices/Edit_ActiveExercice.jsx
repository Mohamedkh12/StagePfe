import React, { useState } from "react";
import { Alert, KeyboardAvoidingView, ScrollView, Text, TextInput, TouchableOpacity, View, Platform, Switch } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { axiosProvider } from "../../http/httpService";
import styles from "../../EspaceparentEnfants/updateStyle";
import { AntDesign, Entypo } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import RNPickerSelect from 'react-native-picker-select';

const EditActiveExercice = ({ route, navigation }) => {
    const { ExerciceId, ExerciceName } = route.params;
    const [category, setCategory] = useState("");
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [classe, setClass] = useState("");
    const [subCategory, setSubCategory] = useState("");
    const [objective, setObjective] = useState("");
    const [active, setActive] = useState("");

    const onSubmit = async () => {
        try {
            const token = await AsyncStorage.getItem('TokenAdmin');
            const requestBody = {
                category,
                name,
                description,
                classe: classe,
                subCategory,
                objective,
                active,
                updated_at: new Date()
            };

            const response = await axiosProvider.patch(`exercises/updateExercise/${ExerciceId}`, requestBody, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log(response)
            if (response.status === 200) {
                navigation.navigate("ShowExercice")
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

                        <View>
                            <Text style={styles.label}>Classe*</Text>
                            <View style={styles.inputcontent}>
                                <View style={styles.inputwrapper}>
                                    {Platform.OS === 'ios' ? (
                                        <>
                                            <RNPickerSelect
                                                value={classe}
                                                onValueChange={(value) => setClass(value)}
                                                placeholder={{ label: 'Choisir une classe', value: null }}
                                                items={[
                                                    { label: '1/2', value: '1/2' },
                                                    { label: '3/4', value: '3/4' },
                                                    { label: '5/6', value: '5/6' },
                                                    { label: '7/8', value: '7/8' },
                                                    { label: '9/10', value: '9/10' }
                                                ]}
                                            />
                                            <AntDesign name="down" size={24} color="black" />
                                        </>
                                    ) : (
                                        <Picker
                                            selectedValue={classe}
                                            style={{ height: 50, width: '100%' }}
                                            onValueChange={(value) => setClass(value)}
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

                        <View>
                            <Text style={styles.label}>sub category*</Text>
                            <View style={styles.inputwrapper}>
                                <TextInput
                                    placeholder="sub category"
                                    onChangeText={(text) => setSubCategory(text)}
                                    value={subCategory}
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
                                    onChangeText={(text) => setName(text)}
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
                                    onChangeText={(text) => setDescription(text)}
                                    value={description}
                                />
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ ...styles.label, flex: 1 }}>Actif*</Text>
                            <Switch
                                value={active === 1}
                                onValueChange={(value) => setActive(value ? 1 : 0)}
                            />
                        </View>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

export default EditActiveExercice;
