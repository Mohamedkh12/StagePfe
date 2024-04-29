import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { FlatList, TouchableOpacity, Text, RefreshControl, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { axiosProvider } from '../http/httpService';
import styles from './styles';

const getToken = async (key) => {
    return await AsyncStorage.getItem(key);
};

const CategoryList = ({ navigation, selectedChild }) => {
    const [categories, setCategories] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [countExercice, setCountExercice] = useState({});

    useEffect(() => {
        fetchCategories();
    }, [selectedChild]);

    const fetchCategories = async () => {
        try {
            const token = await getToken('TokenAdmin');
            const response = await axiosProvider.getWithToken('exercises/Categories', token);
            const categoriesData = response.data.categories;

            setCategories(categoriesData);

            if (selectedChild) {
                await fetchCountExercice(selectedChild, categoriesData);
            }
        } catch (error) {
            console.error(error.message);
        }
    };

    const fetchCountExercice = async (childName, categoriesData) => {
        try {
            const token = await getToken('jwtToken');
            const counts = {};

            for (const category of categoriesData) {
                const response = await axiosProvider.getWithToken(`exercises/CountExercice?category=${category}&child=${childName}`, token);
                counts[category] = response.data;
            }

            setCountExercice(counts);
        } catch (error) {
            console.error(error.message);
        }
    };

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchCategories();
        setRefreshing(false);
    }, [selectedChild]);

    const memoizedCategories = useMemo(() => categories, [categories]);
    const memoizedCountExercice = useMemo(() => countExercice, [countExercice]);

    const renderCategory = ({ item }) => {
        return (
            <TouchableOpacity onPress={() => navigation.navigate('ListExercices', { selectedCategory: item })}>
                <View style={styles.box}>
                    <Text style={styles.h2}>{item}</Text>
                    <Text style={styles.text}>{memoizedCountExercice[item]} exercices</Text>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View>
            <FlatList
                data={memoizedCategories}
                renderItem={renderCategory}
                keyExtractor={(category) => category}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            />
        </View>
    );
};

export default CategoryList;
