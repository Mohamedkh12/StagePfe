import {
    FlatList,
    Image,
    Platform,
    RefreshControl,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
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
    const [selectedBackPackId, setSelectedBackPackId] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const [backPackData, setBackPackData] = useState([]);
    const [initialChildName, setInitialChildName] = useState(null);
    const [selectedChild, setSelectedChild] = useState(null);

    const getToken = async (key) => {
        return await AsyncStorage.getItem(key);
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

    const handleSelectChildId = (childId) => {
        setSelectedChildId(childId);
    };

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
    
            if (response.data && response.data.length > 0) {
                const backpack = response.data[0];
                if (Array.isArray(backpack.exercises)) {
                    const exercisesWithLocalImages = await Promise.all(backpack.exercises.map(async (exercise) => {
                        if (exercise.image) {
                            const localImageUri = await saveImageToLocal(exercise.image, `exercises_${exercise.id}_${Date.now()}.jpg`);
                            return { ...exercise, image: localImageUri };
                        }
                        return exercise;
                    }));
                    setBackPackData(exercisesWithLocalImages);
                    setSelectedBackPackId(backpack.id);
                } else {
                    setBackPackData([]);
                    setSelectedBackPackId(backpack.id);
                }
            } else {
                setBackPackData([]);
                setSelectedBackPackId(null);
            }
        } catch (error) {
            console.error(error.message);
        }
    };
    

    const removeFromBackPack = async (exerciseId) => {
        try {
            const token = await AsyncStorage.getItem('jwtToken');
            await axiosProvider.delete(`backpack/removeFromBackPack?idBackPack=${selectedBackPackId}&idExercise=${exerciseId}`, token);
            setBackPackData((prevData) =>
            {
                return prevData.filter((item) => item.id !== exerciseId)
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
        <SafeAreaView style={style.container}>
            <View>
                <ChildrenList setSelectedChild={setSelectedChild} onSelectChildId={handleSelectChildId} />
            </View>
            <FlatList
                data={backPackData}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                ListEmptyComponent={() => (
                    <View style={styles.errorContainer}>
                        <Image source={require('../assets/images/folder-type.png')} style={styles.imageError} />
                        <Text style={styles.errorText}>Aucun exercice dans le backpack.</Text>
                    </View>
                )}
            />
        </SafeAreaView>
    );
    

};
const style = StyleSheet.create({
    container: {
        flex: 1,
        flexGrow: 1,
        backgroundColor: '#FFFFFF',
        marginBottom: 70
    },
    h1:{
        fontFamily: 'bold',
        fontSize: 24, color: '#293772',
        lineHeight: 29,
        marginTop: Platform.OS === "ios" ? 15 : 47,
        marginLeft: 40
    }
})
export default BackPack;
