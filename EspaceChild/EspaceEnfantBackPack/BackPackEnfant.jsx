import React, { useCallback, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import JWT from "expo-jwt";
import { axiosProvider } from "../../http/httpService";
import * as FileSystem from "expo-file-system";
import {
    FlatList,
    Image,
    RefreshControl,
    SafeAreaView,
    Text,
    View,
    ActivityIndicator,
    TouchableOpacity
} from "react-native";
import styles from "../../BackPack/backPack.Style";
import {AntDesign} from "@expo/vector-icons";

const BackPackEnfant = ({navigation}) => {
    const [refreshing, setRefreshing] = useState(false);
    const [backPackData, setBackPackData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const getToken = async (key) => {
        return await AsyncStorage.getItem(key);
    };

    useEffect(() => {
        getBackPack();
    }, []);

    const getBackPack = async () => {
        try {
            const token = await getToken('jwtToken');
            const decodedToken = JWT.decode(token, 'SECRET-CODE142&of', { timeSkew: 30 });
            const ChildId = decodedToken.sub;
            const response = await axiosProvider.getWithToken(`backpack/getBackPackByChild/${ChildId}`, token);

            if (response.data && Array.isArray(response.data[0]?.exercises)) {
                const exercisesWithLocalImages = await Promise.all(response.data[0].exercises.map(async (exercise) => {
                    if (exercise.image) {
                        const localImageUri = await saveImageToLocal(exercise.image, `exercises_${exercise.id}_${Date.now()}.jpg`);
                        return {...exercise, image: localImageUri};
                    }
                    return exercise;
                }));
                setBackPackData(exercisesWithLocalImages);
            } else {
                setError("Erreur dans la réponse du serveur");
            }
        } catch (error) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const saveImageToLocal = async (base64Image, fileName) => {
        const path = `${FileSystem.documentDirectory}${fileName}`;
        await FileSystem.writeAsStringAsync(path, base64Image, { encoding: FileSystem.EncodingType.Base64 });
        return path;
    };

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        getBackPack();
        setTimeout(() => {
            setRefreshing(false);
        }, 1000);
    }, []);

    const renderItem = ({ item }) => {
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
                        </View>
                    </View>
                </View>
            </View>
        );
    };

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    if (backPackData.length === 0) {
        return (
            <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
                <Text style={styles.text}>Aucun élément dans le backpack.</Text>
            </View>
        );
    }

    return (
        <SafeAreaView  style={{ flex: 1, flexGrow: 1, backgroundColor: '#FFFFFF', marginBottom: 70 }}>
            <View>
                <TouchableOpacity onPress={() => navigation.goBack()} style={{ flexDirection: 'row', marginRight: 20, }}>
                    <AntDesign name="left" selectable={true} style={{ color: '#242F65', fontSize: 26, marginTop: 15, marginLeft: 15, fontFamily: 'bold' }} />
                    <Text style={{ fontFamily: 'bold', fontSize: 24, color: '#293772', lineHeight: 29, marginTop: 15, marginLeft: 3 }}>BackPack</Text>
                </TouchableOpacity>
            </View>
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

export default BackPackEnfant;
