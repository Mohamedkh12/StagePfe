import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { FlatList, TouchableOpacity, Text, RefreshControl, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { axiosProvider } from '../http/httpService';
import ChildrenList from "./ChildrenList"
import JWT from 'expo-jwt';
import styles from './styles';

const getToken = async (key) => {
    return await AsyncStorage.getItem(key);
};

const CategoryList = ({ navigation }) => {
    const [categoriesData, setCategoriesData] = useState([]);
    const [classeData, setClasseData] = useState("");
    const [refreshing, setRefreshing] = useState(false);
    const [countExercice, setCountExercice] = useState({});
    const [selectedChildId, setSelectedChildId] = useState(null);
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
   
    const handleSelectChildId = (childId) => {
        setSelectedChildId(childId);
        global.childId=selectedChildId
    };
    useEffect(() => {
        if (selectedChildId) {
            fetchCategories(selectedChildId);
        }
    }, [selectedChildId]);

    const fetchCategories = async (childId) => {
        try {
            const token = await getToken('jwtToken');
            const decodedToken = JWT.decode(token, 'SECRET-CODE142&of', { timeSkew: 30 });
            const parentId = decodedToken.sub;
            console.log(parentId)
            console.log(selectedChildId)
            const response = await axiosProvider.getWithToken(`exercises/getCategoriesByParentAndChild?idParent=${parentId}&childId=${selectedChildId}`, token);
            
            const categoriesData = response.data.categories;
            console.log(categoriesData)
            if (Array.isArray(categoriesData)) {
                setCategoriesData(categoriesData);
                setClasseData(response.data.classe)
                console.log(classeData)
                await fetchCountExercice(childId, categoriesData);
            } else {
                console.error("Categories data is not an array.");
            }
        } catch (error) {
            console.error(error.message);
        }
    };


    const fetchCountExercice = async (childId, categories) => {
        try {
            const token = await getToken('jwtToken');
            const counts = {};

            for (const category of categories) {
                const response = await axiosProvider.getWithToken(`exercises/count-by-category-and-child?category=${category}&child=${childId}`, token);
                counts[category] = response.data;
            }

            setCountExercice(counts);
        } catch (error) {
            console.error(error.message);
        }
    };

    const onRefresh = useCallback(() => {
        if (selectedChildId) {
            setRefreshing(true);
            fetchCategories(selectedChildId);
            setRefreshing(false);
        }
    }, [selectedChildId]);

    const memoizedCountExercice = useMemo(() => countExercice, [countExercice]);

    const renderCategory = ({ item }) => {
        const category = item;
        return (
            <TouchableOpacity
                onPress={() => navigation.navigate('SubCategoryParents', { selectedCategory: category,selectedClass:classeData,selectedChildId:selectedChildId })}>
                <View style={styles.box}>
                    <Text style={styles.h2}>{category}</Text>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={{width:'100%',height:'100%',backgroundColor: '#FFFFFF'}}>
            <View>
                <ChildrenList setSelectedChild={setSelectedChildId} onSelectChildId={handleSelectChildId} />
            </View>
            <FlatList
                data={categoriesData}
                renderItem={renderCategory}
                keyExtractor={(category) => category}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            />
        </View>
    );
};

export default CategoryList;
