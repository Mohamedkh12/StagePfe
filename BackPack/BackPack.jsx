import React, { useCallback, useEffect, useState } from "react";
import {FlatList, SafeAreaView, Text, TouchableOpacity, View, RefreshControl, Image, StyleSheet} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { axiosProvider } from "../http/httpService";
import JWT from "expo-jwt";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import ChildrenList from "../EspaceParentExercices/ChildrenList";
import styles from "./backPack.Style"
import WebViewScreen from "../EspaceAdmin/Exercices/WebViewScreen";
const Stack = createStackNavigator();

const BackPack = ({ navigation }) => {
    const [selectedChildId, setSelectedChildId] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const [backPackData, setBackPackData] = useState({});
    const [categories, setCategories] = useState([]);
    const [initialChildName, setInitialChildName] = useState(null);
    const [selectedChild, setSelectedChild] = useState(null);
    const [error, setError] = useState(false);
    const getToken = async (key) => {
        return await AsyncStorage.getItem(key);
    };

    //Afficher nom enfnat
    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = await getToken('jwtToken');
                const decodedToken = JWT.decode(token, 'SECRET-CODE142&of', { timeSkew: 30 });
                const parentId = decodedToken.sub;
                const response = await axiosProvider.getWithToken(`parents/childrenIdName/${parentId}`, token);
                const children = response.data;

                setSelectedChildId(children[0].id);
            } catch (error) {
                console.error(error.message);
            }
        };

        fetchData();
    }, []);
    useEffect(() => {
        if (selectedChildId!== null) {
            getCategorySubCategory();
        }
    }, [selectedChildId]);

    //api regrouper exercice
    const getCategorySubCategory = async () => {
        try {
            const token = await getToken("jwtToken");
            const response = await axiosProvider.getWithToken(
                `backpack/getExercisesByCategoryAndSubcategory/${selectedChildId}`,
                token
            );
            if (response.data.success===false) {
                setError(false);
                setBackPackData({});
                setCategories([])
            } else  {
                setBackPackData(response.data);
                setCategories(Object.keys(response.data));
                console.log(backPackData)
            }
        } catch (error) {
            console.error(error.message);
        }
    };
    
    if (error) {
        return (
            <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
                <Text style={styles.text}>Aucun élément dans le backpack.</Text>
            </View>
        );
    }

    const handleSelectChildId = (childId) => {
        setSelectedChildId(childId);
        global.childId=selectedChildId
    };


    const onRefresh = useCallback(() => {
        setRefreshing(true);
        if (!selectedChildId) {
            setRefreshing(false);
            return;
        }
        getCategorySubCategory();
        setTimeout(() => {
            setRefreshing(false);
        }, 1000);
    }, [selectedChildId]);

    //afficher category
    const renderItemCategory = ({ item }) => (
        <View style={styles.container}>
            <TouchableOpacity
                onPress={() =>
                    navigation.navigate("SubCategory", {
                        category: item,
                        backPackData: backPackData[item],
                    })
                }
            >
                <View style={styles.box}>
                        <Text style={styles.h3}>{item}</Text>
                </View>
            </TouchableOpacity>
        </View>
    );

    return (
        
        <SafeAreaView style={styles.container}>
            <View>
                <ChildrenList setSelectedChild={setSelectedChildId} onSelectChildId={handleSelectChildId} />
            </View>
            <FlatList
                data={categories}
                renderItem={renderItemCategory}
                keyExtractor={(item) => item}
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

//afficher subCategory
const SubCategoryScreen = ({ route, navigation }) => {
    const { category, backPackData } = route.params;
    const subCategories = Object.keys(backPackData);

    const renderItemSubCategory = ({ item }) => (
        <View style={styles.container}>
            <TouchableOpacity
                onPress={() =>
                    navigation.navigate("Exercise", {
                        category,
                        subCategory: item,
                        exercises: backPackData[item],
                    })
                }
                style={styles.content}
            >
                <View style={styles.box}>
                        <Text style={styles.h3}>{item}</Text>
                </View>
            </TouchableOpacity>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={{flexDirection:'row',marginRight:20,}}>
                <AntDesign name="left" selectable={true} style={styles.iconGauche} />
                <Text style={styles.title}>{category}</Text>
            </TouchableOpacity>
            <FlatList
                data={subCategories}
                renderItem={renderItemSubCategory}
                keyExtractor={(item) => item}
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

// affchier les exercices 
const ExerciseScreen = ({ route, navigation }) => {
    const { category, subCategory, exercises } = route.params;

    const getToken = async (key) => {
        return await AsyncStorage.getItem(key);
    };

    const removeFromBackPack = async (exerciseId) => {
        try {
            const token = await getToken("jwtToken");
            await axiosProvider.delete(
                `backpack/removeFromBackPack?idChild=${selectedChildId}&idExercise=${exerciseId}`,
                token
            );
            // Update the exercises list
            setExercises((prevExercises) =>
                prevExercises.filter((exercise) => exercise.id !== exerciseId)
            );
        } catch (error) {
            console.error(error.message);
        }
    };

    const renderItemExercise = ({ item }) => {
        const ImageUrl = item.link.replace("index.html", "preview.png");
        const token =
            "?Token=eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIzIiwianRpIjoiYTZmYjc1MjYxYzQ5NGEwNzFjMjJlM2Y1YTRhOTg4ODJhNjRjZWQwMThkZGI2OGU3NTgwZWNjMTRkMWRmNDJhMWI2ZjFlZTlkYWQ4ZjdkMjAiLCJpYXQiOjE3MTY4MjY2MTYuMDIwNDY0LCJuYmYiOjE3MTY4MjY2MTYuMDIwNDY3LCJleHAiOjE3NDgzNjI2MTYuMDE1MjE2LCJzdWIiOiI2OTAiLCJzY29wZXMiOltdfQ.DdPe3ZdUD5FKCsYtnkOYR8FuEhRvP699t4Z5vbESe-agNp6pljIbWVRirITOvnRfjBkRgFRQ67vtVGakzTFql7-T4eRZ6J0K0ZeoV-RJEK4H33PplzJniC2eYOS3FEJzsr3iZMjeus3NjS2sWeFGPyJyj1e4TtBClHQtMYq6PAlNts6gGV-gcqo0iet0_HSVdzUrLzLYjR42rj1_tIZmAtqNYBeYt3RbKCj3ovCPurwjGVXoNKbZ3CTZQ2quMXLSPwMMLpr807qOn9sqYzUcZrWtQ9Pke5tFyVPbRHJZeWRFIl6AXl3OGnDl4c8zPH3IpVTfP1KqOE1HCA3iY4V5Fv2JKORNVtIwfoYoWRBGQpGPaiEueT_IBkVVqwwr0K0CB-scc1hQG3iF6ZO0q_uqDSfAp899Ho3GEglL8Ns_EBRppi26XYzSEyULzFpXn5rANlKxh2iDcUXQRZduwFQHZ2KfFKDkcKbBBT2E7biw_do2LkFIIpSUzNF9UXp9_Q8tAQzQW7Efl9iNfavzZHMcIf66cDCePax3Xj5I1gO9nI2PrwRi_o084L4u6r_bFHB63VwpSPEfmkh5S3cnOFhaBSR4OaHalhQOovgBnEPbLecoym7Wfz161DZHd6J6_1-7XcHlKzzjG7xn61zIJRAucO-p7gnXud7S5SCUeVyWFCk";
        const fullUrl = `${item.link}${token}`;
        
        return (
            <View style={styles.container}>
                <View style={styles.boxExercice}>
                    <View style={{ flexDirection: 'column' }}>
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
                            {/* Afficher l'icône appropriée en fonction de l'état de l'exercice */}
                            <TouchableOpacity onPress={() =>deleteFromBackPack(selectedBackPackId, item.id)} style={styles.icon} >
                                <MaterialCommunityIcons name={"heart-off"} size={24} color="black" />
                            </TouchableOpacity>
                        </View>
                    </View>
                    
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={{flexDirection:'row',marginRight:20,}}>
                <AntDesign name="left" selectable={true} style={styles.iconGauche} />
                <Text style={styles.title}>{subCategory}</Text>
            </TouchableOpacity>
            <FlatList
                data={exercises}
                renderItem={renderItemExercise}
                keyExtractor={(item) => item.id.toString()}
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

const BackPackNavigator = () => {
    return (
        <NavigationContainer independent={true}>
            <Stack.Navigator>
                <Stack.Screen
                    name="BackPack"
                    component={BackPack}
                    options={{ headerShown: false, gestureEnabled: false }}
                />
                <Stack.Screen
                    name="SubCategory"
                    component={SubCategoryScreen}
                    options={{ headerShown: false, gestureEnabled: false }}
                />
                <Stack.Screen
                    name="Exercise"
                    component={ExerciseScreen}
                    options={{ headerShown: false, gestureEnabled: false }}
                />
                <Stack.Screen name="WebViewScreen" component={WebViewScreen} options={{headerShown: false, gestureEnabled: false,}}/>
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default BackPackNavigator;
