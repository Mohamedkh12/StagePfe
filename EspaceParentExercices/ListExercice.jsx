import React, { useCallback, useEffect, useState } from "react";
import { Alert, FlatList, Image, RefreshControl, SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { axiosProvider } from "../http/httpService";
import styles from "../EspaceparentEnfants/styles";
import { AntDesign, Ionicons, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system";
import JWT from "expo-jwt";

const ListExercices = ({ route, navigation }) => {
    const { selectedCategory } = route.params;
    const [refreshing, setRefreshing] = useState(false);
    const [exercises, setExercises] = useState([]);
    const [backPackItems, setBackPackItems] = useState({});

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

    const addBackPack = async (exerciseId) => {
        try {
            const token = await AsyncStorage.getItem('jwtToken');
            const decodedToken = JWT.decode(token, 'SECRET-CODE142&of', { timeSkew: 30 });
            const parentId = decodedToken.sub;
            const childId = global.selectedChildId;
            const dto = {
                parentId,
                childId,
                exerciseId: [exerciseId],
            };
            const response = await axiosProvider.postWithToken(`backpack/addToBackPack`, dto, token);
            setBackPackItems(prevItems => ({ ...prevItems, [exerciseId]: true }));
            console.log(response.data);
            return response.data;
        } catch (error) {
            console.error(error.message);
        }
    };

    const removeFromBackPack = async (exerciseId) => {
        try {
            const token = await AsyncStorage.getItem('jwtToken');
            await axiosProvider.delete(`backpack/removeFromBackPack/${exerciseId}`, token);

            setBackPackItems(prevItems => ({ ...prevItems, [exerciseId]: false }));
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

    const renderExerciceItem = ({ item }) => {
        const isInBackPack = backPackItems[item.id] || false;

        return (
            <View style={styles.container}>
                <View style={styles.box}>
                    <View style={{ flexDirection: 'column' }}>
                        <Image source={{ uri: item.image }} style={{ width: '85%', height: 'auto', aspectRatio: 1, marginLeft: 20 }} />
                        <View style={{ flexDirection: 'column' }}>
                            <Text style={styles.text}>{item.name}</Text>
                            <Text style={styles.text}>{item.description}</Text>
                        </View>
                    </View>

                    <TouchableOpacity onPress={() => isInBackPack ? removeFromBackPack(item.id) : addBackPack(item.id)}>
                        <MaterialCommunityIcons name={isInBackPack ? "heart-off" : "heart"} size={24} color="black" />
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={{ flex: 1, flexGrow: 1, backgroundColor: '#FFFFFF', marginBottom: 70 }}>
            <View>
                <TouchableOpacity onPress={() => navigation.goBack()} style={{ flexDirection: 'row', marginRight: 20, }}>
                    <AntDesign name="left" selectable={true} style={{ color: '#242F65', fontSize: 26, marginTop: 15, marginLeft: 15, fontFamily: 'bold' }} />
                    <Text style={{ fontFamily: 'bold', fontSize: 24, color: '#293772', lineHeight: 29, marginTop: 15, marginLeft: 3 }}>{selectedCategory}</Text>
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
        </SafeAreaView>
    );
}

export default ListExercices;
