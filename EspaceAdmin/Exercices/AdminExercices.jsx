import {
    Alert,
    FlatList,
    Image,
    RefreshControl,
    SafeAreaView,
    Text,
    TouchableOpacity,
    View,
    StyleSheet,
    Platform, ActivityIndicator
} from "react-native";
import React, {useCallback, useEffect, useState} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {axiosProvider} from "../../http/httpService";
import styles from "../../EspaceparentEnfants/styles";
import {AntDesign, Ionicons, MaterialCommunityIcons, MaterialIcons} from "@expo/vector-icons";

const AdminExercices = ({route,navigation}) => {
    const { selectedCategory } = route.params;
    const { selectedSubCategory } = route.params;
    const { selectedClass } = route.params;
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showOptions, setShowOptions] = useState(null);
    const [exercises, setExercises] = useState([]);
    const [countExercice,setCountExercice]=useState(0);

    const fetchExercisesByCategory = async () => {
        try {
            setLoading(true);
            const token = await AsyncStorage.getItem('TokenAdmin');
            const response = await axiosProvider.getWithToken(`exercises/SubCategories-by-exercice?classParam=${selectedClass}&category=${selectedCategory}&subCategory=${selectedSubCategory}`, token);
            setExercises(response.data);
        } catch (error) {
            console.error(error.message);
        }finally {
            setLoading(false);
        }
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

    const fetchCountExercice = async () => {
        try {
            const token = await AsyncStorage.getItem('TokenAdmin');
            const counts = {};

            for (const category of exercises) {
                const response = await axiosProvider.getWithToken(`exercises/CountExercice?category=${category}`, token);
                counts[category] = response.data;
            }

            setCountExercice(counts);
        } catch (error) {
            console.error(error.message);
        }
    };

    useEffect(() => {
        if (exercises.length > 0) {
            fetchCountExercice();
        }
    }, [exercises]);

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
        const ImageUrl = item.link.replace('index.html', 'preview.png');
        const token = "?Token=eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIzIiwianRpIjoiYTZmYjc1MjYxYzQ5NGEwNzFjMjJlM2Y1YTRhOTg4ODJhNjRjZWQwMThkZGI2OGU3NTgwZWNjMTRkMWRmNDJhMWI2ZjFlZTlkYWQ4ZjdkMjAiLCJpYXQiOjE3MTY4MjY2MTYuMDIwNDY0LCJuYmYiOjE3MTY4MjY2MTYuMDIwNDY3LCJleHAiOjE3NDgzNjI2MTYuMDE1MjE2LCJzdWIiOiI2OTAiLCJzY29wZXMiOltdfQ.DdPe3ZdUD5FKCsYtnkOYR8FuEhRvP699t4Z5vbESe-agNp6pljIbWVRirITOvnRfjBkRgFRQ67vtVGakzTFql7-T4eRZ6J0K0ZeoV-RJEK4H33PplzJniC2eYOS3FEJzsr3iZMjeus3NjS2sWeFGPyJyj1e4TtBClHQtMYq6PAlNts6gGV-gcqo0iet0_HSVdzUrLzLYjR42rj1_tIZmAtqNYBeYt3RbKCj3ovCPurwjGVXoNKbZ3CTZQ2quMXLSPwMMLpr807qOn9sqYzUcZrWtQ9Pke5tFyVPbRHJZeWRFIl6AXl3OGnDl4c8zPH3IpVTfP1KqOE1HCA3iY4V5Fv2JKORNVtIwfoYoWRBGQpGPaiEueT_IBkVVqwwr0K0CB-scc1hQG3iF6ZO0q_uqDSfAp899Ho3GEglL8Ns_EBRppi26XYzSEyULzFpXn5rANlKxh2iDcUXQRZduwFQHZ2KfFKDkcKbBBT2E7biw_do2LkFIIpSUzNF9UXp9_Q8tAQzQW7Efl9iNfavzZHMcIf66cDCePax3Xj5I1gO9nI2PrwRi_o084L4u6r_bFHB63VwpSPEfmkh5S3cnOFhaBSR4OaHalhQOovgBnEPbLecoym7Wfz161DZHd6J6_1-7XcHlKzzjG7xn61zIJRAucO-p7gnXud7S5SCUeVyWFCk";
        const fullUrl = `${item.link}${token}`;
        return (
            <View style={styles.container}>
                <View style={styles.box}>
                    <View style={{ flexDirection: 'column' }}>
                        {/* Triangle au-dessus de l'image */}
                        <View style={styles.triangle}></View>
                        {/* Image avec un sombre */}
                        <TouchableOpacity onPress={() => {
                            navigation.navigate('WebViewScreen', { url: fullUrl })
                        }}>
                            <Image source={{ uri: ImageUrl }} style={{ width: '100%', height: 'auto', aspectRatio: 1, position: 'relative' }} />
                            <View style={styles.overlay}></View>
                            <View style={{ flexDirection: 'column', position: 'absolute', top: '50%', left: '50%', transform: [{ translateX: -30 }, { translateY: -30 }] }}>
                                <AntDesign name="caretright" size={60} color="white" style={{ opacity: 0.8, textShadowColor: 'rgba(0, 0, 0, 0.75)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 5 }} />
                            </View>
                        </TouchableOpacity>

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

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return(
        <SafeAreaView style={style.container}>
            <View >
                <TouchableOpacity onPress={() => navigation.goBack()} style={{flexDirection:'row',marginRight:20,}}>
                    <AntDesign name="left" selectable={true} style={style.iconGauche} />
                    <Text style={style.nameCategory}>{selectedCategory}</Text>
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
                        <Image source={require('../../assets/images/folder-type.png')} style={styles.imageError} />
                        <Text style={styles.errorText}>Aucun exercice dans le backpack.</Text>
                    </View>
                )}
            />
            <TouchableOpacity
                style={style.iconAdd}
                onPress={() => navigation.navigate('AddExercices')}
            >
                <AntDesign name="pluscircle" color={"#242F65"} size={50}  />
            </TouchableOpacity>
        </SafeAreaView>
    )
}

const style = StyleSheet.create({
    container:{
        flexGrow: 1,
        backgroundColor: '#FFFFFF',
        marginBottom: 70,
        width:'100%',
        height:'100%',
    },
    iconGauche:{
        color:'#242F65',
        fontSize:26,
        marginTop:Platform.OS === "ios" ? 20: 50,
        marginLeft:15,
        fontFamily:'bold'
    },
    nameCategory:{
        fontFamily:'bold',
        fontSize:24,
        color:'#293772',
        lineHeight:29,
        marginTop:Platform.OS === "ios" ? 20: 45,
        marginLeft:3
    },
    box: {
        position: 'relative',
        width: '85%',
        height: 'auto',
        aspectRatio: 1,
        marginLeft: 20,
        marginTop: 20,
    },
    triangle: {
        width: 0,
        height: 0,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderLeftWidth: 12,
        borderRightWidth: 12,
        borderBottomWidth: 24,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomColor: '#000',
        position: 'absolute',
        top: 0,
        left: '50%',
        marginLeft: -12,
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    iconAdd:{
        flexDirection: "row",
        justifyContent: 'flex-end',
        marginRight: 20,
        marginBottom:70
    },

    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorContainer: {
        flex: 1,
        alignSelf:"center",
        marginTop:220,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        fontFamily: 'regular',
        fontSize: 15,
        color: '#2C2C2C',
        lineHeight: 22,
        marginBottom: 30,
    },
    imageError: {
        width: 100,
        height: 100,
        resizeMode: 'contain',
        marginBottom: 20,
    },
})

export default AdminExercices
