import React, {useCallback, useEffect, useState} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {axiosProvider} from "../../http/httpService";
import {ActivityIndicator, FlatList, RefreshControl, SafeAreaView, Text, TouchableOpacity, View} from "react-native";
import styles from "./ClassScreen.Styles";
import AdminExercices from "./AdminExercices";
import {AntDesign} from "@expo/vector-icons";

const SubCategory = ({ route,navigation }) => {
    const { selectedCategory } = route.params;
    const { selectedClass } = route.params;
    const [data, setData] = useState('');
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [countExercice,setCountExercice]=useState(0);

    const getToken = async (key) => {
        return await AsyncStorage.getItem(key);
    };

    useEffect(() => {
        fetchData();
    }, [selectedCategory]);
    const fetchData = async () => {
        try {
            setLoading(true);
            const token = await getToken('TokenAdmin');
            const response = await axiosProvider.get('exercises/SubCategories-by-categories', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setData(response.data[selectedCategory]);
        } catch (error) {
            console.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchData();
        setTimeout(() => {
            setRefreshing(false);
        }, 1000);
    }, []);
    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    const renderCategory=({item})=> {
        return (
            <View>
                <TouchableOpacity  style={styles.box} onPress={() => navigation.navigate('AdminExercices', {selectedClass : selectedClass, selectedCategory: selectedCategory,selectedSubCategory : item })}>
                    <Text style={styles.p}>{item}</Text>
                </TouchableOpacity>
            </View>
        )
    }
    return (
        <SafeAreaView style={styles.container}>
            <View >
                <TouchableOpacity onPress={() => navigation.goBack()} style={{flexDirection:'row',marginRight:20,}}>
                    <AntDesign name="left" selectable={true} style={styles.iconGauche} />
                    <Text style={styles.h3}>{selectedCategory} </Text>
                </TouchableOpacity>
            </View>
            <FlatList
                data={data}
                keyExtractor={(item) => item}
                renderItem={renderCategory}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            />
        </SafeAreaView>
    );
};


export default SubCategory