import { FlatList, Image, RefreshControl, SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import ChildrenList from "../EspaceParentExercices/ChildrenList";
import React, { useCallback, useEffect, useState } from "react";
import styles from "./backPack.Style";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { axiosProvider } from "../http/httpService";
import * as FileSystem from "expo-file-system";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import JWT from "expo-jwt";

const BackPack = ({ navigation }) => {
    const [selectedChildId, setSelectedChildId] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const [backPackData, setBackPackData] = useState([]);
    const [initialChildName, setInitialChildName] = useState(null);
    const [selectedChild, setSelectedChild] = useState(null);

    const getToken = async (key) => {
        return await AsyncStorage.getItem(key);
    };

    const handleSelectChildId = (childId) => {
        setSelectedChildId(childId);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = await getToken('jwtToken');
                const decodedToken = JWT.decode(token, 'SECRET-CODE142&of', { timeSkew: 30 });
                const parentId = decodedToken.sub;
                const response = await axiosProvider.getWithToken(`parents/childrenIdName/${parentId}`, token);
                const children = response.data;

                setSelectedChild(children[0].name);
                setInitialChildName(children[0].name);
                setSelectedChildId(children[0].id);
            } catch (error) {
                console.error(error.message);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (selectedChildId !== null) {
            getBackPack();
        }
    }, [selectedChildId]);

    const getBackPack = async () => {
        try {
            const token = await getToken('jwtToken');
            console.log("selectedChildId:", selectedChildId);
            const response = await axiosProvider.getWithToken(`backpack/getBackPackByChild/${selectedChildId}`, token);
            console.log("Response from server:", response.data);

            if (response.data && Array.isArray(response.data[0]?.exercises)) {
                const exercisesWithLocalImages = await Promise.all(response.data[0].exercises.map(async (exercise) => {
                    if (exercise.image) {
                        const localImageUri = await saveImageToLocal(exercise.image, `exercises_${exercise.id}_${Date.now()}.jpg`);
                        return { ...exercise, image: localImageUri };
                    }
                    return exercise;
                }));
                setBackPackData(exercisesWithLocalImages);
            } else {
                console.error("getBackPack: Erreur dans la réponse du serveur");
            }
        } catch (error) {
            console.error(error.message);
        }
    };

    const removeFromBackPack = async (exerciseId) => {
        try {
            const token = await AsyncStorage.getItem('jwtToken');
            await axiosProvider.delete(`backpack/removeFromBackPack?idExercise=${exerciseId}`, token);
            setBackPackData((prevData) =>
            {
                return prevData.filter((item )=> item.id !== exerciseId)
            });
        } catch (error) {
            console.error(error.message);
        }
    };

    const saveImageToLocal = async (base64Image, fileName) => {
        const path = `${FileSystem.documentDirectory}${fileName}`;
        await FileSystem.writeAsStringAsync(path, base64Image, { encoding: FileSystem.EncodingType.Base64 });
        return path;
    };

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        if (!selectedChildId) {
            setRefreshing(false);
            return;
        }
        getBackPack();
        setTimeout(() => {
            setRefreshing(false);
        }, 1000);
    }, [selectedChildId]);

    const renderItem = ({ item }) => {
        const isInBackPack = backPackData.some(exercise => exercise.id === item.id);

        return (
            <View style={styles.container}>
                <View style={styles.box}>
                    <View style={{ flexDirection: 'column' }}>
                        <Image source={{ uri: item.image }} style={{ width: '85%', height: 'auto', aspectRatio: 1, marginLeft: 20 }} />
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ flexDirection: 'column' }}>
                                <Text style={styles.text}>{item.category}</Text>
                                <Text style={styles.text}>{item.name}</Text>
                            </View>
                            <View style={{ flexDirection: 'column' }}>
                                <Text style={styles.text}>{item.description}</Text>
                                <Text style={styles.text}>{item.assignment}</Text>
                            </View>
                            <TouchableOpacity style={styles.icon} onPress={() => {
                                if (isInBackPack) {
                                    removeFromBackPack(item.id);
                                }
                            }}>
                                <MaterialCommunityIcons name={ "heart-off" } size={24} color="black" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.content}>
            <ChildrenList setSelectedChild={setSelectedChild} onSelectChildId={handleSelectChildId} />
            <FlatList
                data={backPackData}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            />
        </SafeAreaView>
    );

};

export default BackPack;