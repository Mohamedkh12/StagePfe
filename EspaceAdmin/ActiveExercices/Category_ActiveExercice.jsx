import React, {useCallback, useEffect, useState} from 'react';
import {View, Text, FlatList, ActivityIndicator, SafeAreaView, TouchableOpacity, RefreshControl} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { axiosProvider } from '../../http/httpService';
import styles from "../Exercices/ClassScreen.Styles";
import {AntDesign} from "@expo/vector-icons";

const CategoryActiveExercices = ({ route,navigation }) => {
    const { selectedClass } = route.params;
    const [data, setData] = useState('');
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const getToken = async (key) => {
        return await AsyncStorage.getItem(key);
    };

    useEffect(() => {
        fetchData();
    }, [selectedClass]);
    const fetchData = async () => {
        try {
            setLoading(true);
            const token = await getToken('TokenAdmin');
            const response = await axiosProvider.get('exercises/categories-by-class', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setData(response.data[selectedClass]);
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
                <TouchableOpacity  style={styles.box} onPress={() => navigation.navigate('SubCategoryActiveExercice', {selectedClass : selectedClass, selectedCategory: item })}>
                    <Text style={styles.p}>{item}</Text>
                </TouchableOpacity>
            </View>
        )
    }
    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity onPress={() => navigation.navigate("Classes")} style={{flexDirection:'row',marginRight:20,}}>
                <AntDesign name="left" selectable={true} style={styles.iconGauche} />
                <Text style={styles.h3}>Catégories pour classe {selectedClass} </Text>
            </TouchableOpacity>
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



export default CategoryActiveExercices;
