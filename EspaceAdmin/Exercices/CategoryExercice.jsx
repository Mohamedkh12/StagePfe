import React, {useCallback, useEffect, useState} from 'react';
import {
    SafeAreaView,
    Text,
    TouchableOpacity,
    View,
    StyleSheet,
    FlatList,
    RefreshControl
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { axiosProvider } from '../../http/httpService';

const CategoryExercices = ({navigation}) => {
    const [categories, setCategories] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [countExercice,setCountExercice]=useState(0);
    const fetchCategories = async () => {
        try {
            const token = await AsyncStorage.getItem('TokenAdmin');
            const response = await axiosProvider.getWithToken('exercises/Categories', token);
            setCategories(response.data.categories);
            console.log("+++++fetchCategories :",response.data);
        } catch (error) {
            console.error(error.message);
        }
    };
    const fetchCountExercice = async () => {
        try {
            const token = await AsyncStorage.getItem('TokenAdmin');
            const counts = {};

            for (const category of categories) {
                const response = await axiosProvider.getWithToken(`exercises/CountExercice?category=${category}`, token);
                counts[category] = response.data;
            }

            setCountExercice(counts);
        } catch (error) {
            console.error(error.message);
        }
    };
    useEffect(() => {
        fetchCategories();
    }, []);
    useEffect(() => {
        if (categories.length > 0) {
            fetchCountExercice();
        }
    }, [categories]);

    const renderCategories = ({item}) => {
        console.log(item)
        return (
            <View>
                <TouchableOpacity style={styles.box} onPress={() => navigation.navigate('AdminExercices', { selectedCategory: item })}>
                    <Text style={styles.h3}>{item}</Text>
                    <Text style={styles.p}>{countExercice[item] || 0} exercices</Text>
                </TouchableOpacity>
            </View>
        )
    }
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchCategories();
        setTimeout(() => {
            setRefreshing(false);
        }, 1000);
    }, []);
    return (
        <SafeAreaView style={styles.container}>
            <View>
                <Text style={styles.title}>Les exercices</Text>
            </View>
            <FlatList
                data={categories}
                renderItem={renderCategories}
                keyExtractor={(item) => item}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>
                }

            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width:'100%',
        backgroundColor: '#FFFFFF'
    },
    box: {
        width: '90%',
        marginLeft: '5%',
        marginTop: 25,
        height: 60,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#242F65',
        borderRadius: 8,
        flexDirection: 'row',
        padding: 10,
        alignItems: 'flex-start',
        justifyContent: 'space-between'
    },
    title:{
        fontFamily:'bold',
        fontSize:26,
        color:'#293772',
        lineHeight:32,
        marginTop:30,
        marginLeft:25,
    },
    h3: {
        fontFamily:'bold',
        fontSize:22,
        color:'#293772',
        lineHeight:27,
        marginLeft:30,
    },
    p:{
        fontFamily:'regular',
        fontSize:18,
        color:'#707070',
        lineHeight:22,
        marginLeft:30,
    }
})


export default CategoryExercices
