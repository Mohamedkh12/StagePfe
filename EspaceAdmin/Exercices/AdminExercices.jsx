import {Alert, FlatList, Image, RefreshControl, SafeAreaView, Text, TouchableOpacity, View} from "react-native";
import React, {useCallback, useEffect, useState} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {axiosProvider} from "../../http/httpService";
import styles from "../../EspaceparentEnfants/styles";
import {AntDesign, Ionicons, MaterialCommunityIcons, MaterialIcons} from "@expo/vector-icons";
import * as FileSystem from "expo-file-system";

const AdminExercices = ({route,navigation}) => {
    const { selectedCategory } = route.params;
    const [refreshing, setRefreshing] = useState(false);
    const [showOptions, setShowOptions] = useState(null);
    const [exercises, setExercises] = useState([]);

    const fetchExercisesByCategory = async () => {
        try {
            const token = await AsyncStorage.getItem('TokenAdmin');
            const response = await axiosProvider.getWithToken(`exercises/byCategory?category=${selectedCategory}`, token);
            if (response.data && Array.isArray(response.data)) {
                const exercisesWithLocalImages = await Promise.all(response.data.map(async (exercise) => {
                    if (exercise.image) {
                        const localImageUri = await saveImageToLocal(exercise.image, `exercises_${exercise.id}_${Date.now()}.jpg`);
                        return { ...exercise, image: localImageUri };
                    }
                    return exercise;
                }));
                setExercises(exercisesWithLocalImages);
            } else {
                console.error("fetchExercisesByCategory: Erreur dans la réponse du serveur");
            }
        } catch (error) {
            console.error(error.message);
        }
    };

    const saveImageToLocal = async (base64Image, fileName) => {
        const path = `${FileSystem.documentDirectory}${fileName}`;
        await FileSystem.writeAsStringAsync(path, base64Image, { encoding: FileSystem.EncodingType.Base64 });
        return path;
    };
    useEffect(() => {
        fetchExercisesByCategory();
    }, [selectedCategory]);
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchExercisesByCategory();
        setTimeout(() => {
            setRefreshing(false);
        }, 1000);
    }, []);

    const handleDeleteExercices = async (exercicesId, exercicesName) => {
        try {
            const token = await AsyncStorage.getItem('TokenAdmin');
            if (!token) {
                throw new Error('JWT token not found');
            }
            Alert.alert(
                `Supprimer le compte de ${exercicesName}`,
                "Etes-vous sûr de supprimer l'exercice ? Cette opération sera définitive.",
                [
                    {
                        text: "Annuler",
                        onPress: () => console.log("Suppression annulée"),
                        style: "cancel"
                    },
                    {
                        text: "Supprimer",
                        onPress: async () => {
                            const response = await axiosProvider.delete(`exercises/deleteExercise/${exercicesId}`, token);
                            console.log(response);
                            // Mettre à jour la liste après la suppression
                            setExercises(prevData => prevData.filter(exercices => exercices.id !== exercicesId));
                        }
                    }
                ]
            );
        } catch (error) {
            console.error(error);
        }
    };
    const handleOptionsToggle = (exerciseId) => {
        setShowOptions(showOptions === exerciseId ? null : exerciseId);
    };
    const renderExerciceItem = ({ item }) => {
        return (
            <View style={styles.container}>
                <View style={styles.box}>
                    <View style={{ flexDirection: 'column' }}>
                        <Image source={{ uri: item.image }} style={{ width: '85%', height: 'auto', aspectRatio: 1,marginLeft:20 }} />
                        <View style={{ flexDirection: 'column' }}>
                            <Text style={styles.text}>{item.name}</Text>
                            <Text style={styles.text}>{item.description}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', marginTop: 20 }}>
                            {/* Icône pour afficher les options */}
                            <TouchableOpacity onPress={() => handleOptionsToggle(item.id)} style={{marginRight: 10,marginTop: -80}}>
                                <Ionicons name="ellipsis-vertical" size={24} color="black" />
                            </TouchableOpacity>
                            {/* Afficher les options si l'élément est sélectionné */}
                            {showOptions === item.id && (
                                <View style={{ flexDirection: 'column', marginTop: -80 }}>
                                    <TouchableOpacity onPress={() => handleDeleteExercices(item.id, item.name)} style={{ marginRight: 10 }}>
                                        <MaterialIcons name="delete" size={24} color="black" />
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => navigation.navigate('EditExercice', {
                                        ExerciceId: item.id, ExerciceName: item.name})}>
                                        <MaterialCommunityIcons name="account-edit" size={24} color="black" />
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>
                    </View>
                </View>
            </View>
        );
    };
    return(
        <SafeAreaView style={{flex: 1, flexGrow: 1, backgroundColor: '#FFFFFF', marginBottom: 70}}>
                <View >
                    <TouchableOpacity onPress={() => navigation.goBack()} style={{flexDirection:'row',marginRight:20,}}>
                        <AntDesign name="left" selectable={true} style={{ color:'#242F65', fontSize:26,marginTop:15, marginLeft:15, fontFamily:'bold'}} />
                        <Text style={{fontFamily:'bold', fontSize:24, color:'#293772', lineHeight:29, marginTop:15, marginLeft:3}}>{selectedCategory}</Text>
                    </TouchableOpacity>
                </View>
                <FlatList
                    data={exercises}
                    renderItem={renderExerciceItem}
                    keyExtractor={(item, index) => index.toString()}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                />
            <TouchableOpacity
                style={{ flexDirection: "row", justifyContent: 'flex-end', marginRight: 20 ,paddingBottom:5}}
                onPress={() => navigation.navigate('AddExercices')}
            >
                    <AntDesign name="pluscircle" color={"#242F65"} size={50}  />
            </TouchableOpacity>
        </SafeAreaView>
  )
}

export default AdminExercices