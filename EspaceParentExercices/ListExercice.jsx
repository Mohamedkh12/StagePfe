import React, { useCallback, useEffect, useState } from "react";
import {
    FlatList,
    Image,
    RefreshControl,
    SafeAreaView,
    Text,
    TouchableOpacity,
    View,
    StyleSheet,
    Platform
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { axiosProvider } from "../http/httpService";
import styles from "../BackPack/backPack.Style";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system";
import JWT from "expo-jwt";

const ListExercices = ({ route, navigation }) => {
    const {selectedClass, selectedCategory,selectedSubCategory,selectedChildId } = route.params;
    const [refreshing, setRefreshing] = useState(false);
    const [exercises, setExercises] = useState([]);
    const [backPackItems, setBackPackItems] = useState({});
    const [selected, setselected] = useState(false);
    const [selectedBackPackId, setSelectedBackPackId] = useState(null);
    const [loading, setLoading] = useState(false);
    const childId = global.selectedChildId;

    const getToken = async (key) => {
        return await AsyncStorage.getItem(key);
    };

    useEffect(() => {
        showExercice();
    }, [selectedSubCategory]);

    const showExercice = async () => {
        try {
            setLoading(true);
            const token = await getToken('jwtToken');
            const response = await axiosProvider.get(`exercises/showExercice?classParam=${selectedClass}&category=${selectedCategory}&subCategory=${selectedSubCategory}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setExercises(response.data);
        } catch (error) {
            console.log(error);
        }finally {
            setLoading(false);
        }
    };

    const addBackPack = async (exerciseId) => {
        try {
            const token = await AsyncStorage.getItem('jwtToken');
            const decodedToken = JWT.decode(token, 'SECRET-CODE142&of', { timeSkew: 30 });
            const parentId = decodedToken.sub;
            console.log("childId", childId)
            const dto = {
                parentId,
                childId,
                exerciseId: [exerciseId],
            };
            console.log(dto)
            const response = await axiosProvider.postWithToken(`backpack/addToBackPack`, dto, token);
            console.log(response)
            // Mettre à jour l'état de l'exercice spécifique dans backPackItems
            setBackPackItems(prevItems => ({ ...prevItems, [exerciseId]: true }));
            await AsyncStorage.setItem(`backPack_${childId}_${exerciseId}`, "true");

            setSelectedBackPackId(response.data.id);

            return response.data;
        } catch (error) {
            console.error(error.message);
        }
    };

    const deleteFromBackPack = async (backPackId, exerciseId) => {
        try {
            const token = await AsyncStorage.getItem('jwtToken');
            await axiosProvider.delete(`backpack/removeFromBackPack?idBackPack=${backPackId}&idExercise=${exerciseId}`, token);
            setBackPackItems(prevItems => ({ ...prevItems, [exerciseId]: false }));
            await AsyncStorage.setItem(`backPack_${selectedChildId}_${exerciseId}`, "false");
        } catch (error) {
            console.error(error.message);
        }
    };

    useEffect(() => {
        const loadBackPackState = async () => {
            try {
                const keys = await AsyncStorage.getAllKeys();
                const backPackStates = await AsyncStorage.multiGet(keys.filter(key => key.startsWith(`backPack_${childId}_`)));
                const stateObject = backPackStates.reduce((acc, [key, value]) => {
                    const exerciseId = key.split("_")[2];
                    acc[exerciseId] = value === "true";
                    return acc;
                }, {});
                setBackPackItems(stateObject);
            } catch (error) {
                console.error(error.message);
            }
        };

        loadBackPackState();
    }, [childId]);


    const onRefresh = useCallback(() => {
        setRefreshing(true);
        showExercice();
        setTimeout(() => {
            setRefreshing(false);
        }, 1000);
    }, []);

    const renderExerciceItem = ({ item }) => {
        const isInBackPack = backPackItems[item.id] || false;
        const ImageUrl = item.link.replace('index.html', 'preview.png');
        const token = "?Token=eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIzIiwianRpIjoiYTZmYjc1MjYxYzQ5NGEwNzFjMjJlM2Y1YTRhOTg4ODJhNjRjZWQwMThkZGI2OGU3NTgwZWNjMTRkMWRmNDJhMWI2ZjFlZTlkYWQ4ZjdkMjAiLCJpYXQiOjE3MTY4MjY2MTYuMDIwNDY0LCJuYmYiOjE3MTY4MjY2MTYuMDIwNDY3LCJleHAiOjE3NDgzNjI2MTYuMDE1MjE2LCJzdWIiOiI2OTAiLCJzY29wZXMiOltdfQ.DdPe3ZdUD5FKCsYtnkOYR8FuEhRvP699t4Z5vbESe-agNp6pljIbWVRirITOvnRfjBkRgFRQ67vtVGakzTFql7-T4eRZ6J0K0ZeoV-RJEK4H33PplzJniC2eYOS3FEJzsr3iZMjeus3NjS2sWeFGPyJyj1e4TtBClHQtMYq6PAlNts6gGV-gcqo0iet0_HSVdzUrLzLYjR42rj1_tIZmAtqNYBeYt3RbKCj3ovCPurwjGVXoNKbZ3CTZQ2quMXLSPwMMLpr807qOn9sqYzUcZrWtQ9Pke5tFyVPbRHJZeWRFIl6AXl3OGnDl4c8zPH3IpVTfP1KqOE1HCA3iY4V5Fv2JKORNVtIwfoYoWRBGQpGPaiEueT_IBkVVqwwr0K0CB-scc1hQG3iF6ZO0q_uqDSfAp899Ho3GEglL8Ns_EBRppi26XYzSEyULzFpXn5rANlKxh2iDcUXQRZduwFQHZ2KfFKDkcKbBBT2E7biw_do2LkFIIpSUzNF9UXp9_Q8tAQzQW7Efl9iNfavzZHMcIf66cDCePax3Xj5I1gO9nI2PrwRi_o084L4u6r_bFHB63VwpSPEfmkh5S3cnOFhaBSR4OaHalhQOovgBnEPbLecoym7Wfz161DZHd6J6_1-7XcHlKzzjG7xn61zIJRAucO-p7gnXud7S5SCUeVyWFCk";
        const fullUrl = `${item.link}${token}`;
        return (
            <View style={styles.container}>
                <View style={styles.boxExercice}>
                    <View style={{ flexDirection: 'column' }}>
                        {/* Triangle au-dessus de l'image */}
                        <View style={styles.triangle}></View>
                        {/* Image avec un sombre */}
                        <TouchableOpacity onPress={() => {
                            navigation.navigate('WebViewScreen', { url: fullUrl })
                        }}>
                            <Image source={{ uri: ImageUrl }} style={styles.url} />

                            <View style={styles.triangleIcon}>
                                <AntDesign name="caretright" size={60} color="white" style={{ opacity: 0.8, textShadowColor: 'rgba(0, 0, 0, 0.75)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 5 }} />
                            </View>
                        </TouchableOpacity>

                        <View style={{ flexDirection: 'row' }}>
                            <Text style={styles.text}>{item.name}</Text>
                            <TouchableOpacity onPress={() => isInBackPack ? deleteFromBackPack(selectedBackPackId, item.id) : addBackPack(item.id)} style={styles.icon}>
                                <MaterialCommunityIcons name={isInBackPack ? "heart-off" : "heart"} size={24} color="black" />
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
                <TouchableOpacity onPress={() => navigation.goBack()} style={{ flexDirection: 'row', marginRight: 20, }}>
                    <AntDesign name="left" selectable={true} style={style.iconGauche} />
                    <Text
                        style={style.nameCategory}>
                        {selectedSubCategory}
                    </Text>
                </TouchableOpacity>
            </View>
            <FlatList
                data={exercises}
                renderItem={renderExerciceItem}
                keyExtractor={(item, index) => index.toString()}
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
}

const style = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#FFFFFF',
        width: '100%',
        height: '100%',
    },
    nameCategory: {
        color: '#242F65',
        fontSize: 26,
        marginTop: Platform.OS === "ios" ? 7 : 45,
        fontFamily: 'bold'
    },
    iconGauche: {
        fontFamily: 'bold',
        fontSize: 24,
        color: '#293772',
        lineHeight: 29,
        marginTop: Platform.OS === "ios" ? 7 : 55,
        marginLeft: 13
    }
})
export default ListExercices;
