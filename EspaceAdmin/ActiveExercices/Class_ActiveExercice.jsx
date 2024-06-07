import React, { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { axiosProvider } from '../../http/httpService';
import { View, Text, ActivityIndicator, FlatList, TouchableOpacity, SafeAreaView, RefreshControl } from 'react-native';
import styles from "../Exercices/ClassScreen.Styles";
import {AntDesign} from "@expo/vector-icons";
const Classes = ({ navigation }) => {
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const getToken = async (key) => {
        return await AsyncStorage.getItem(key);
    };

    useEffect(() => {
        fetchClasses();
    }, []);

    const fetchClasses = async () => {
        try {
            setLoading(true);
            const token = await getToken('TokenAdmin');
            const response = await axiosProvider.get('exercises/getAllClass', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setClasses(response.data);
        } catch (error) {
            console.error('Error fetching classes:', error.message);
        } finally {
            setLoading(false);
        }
    };

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchClasses().then(() => setRefreshing(false));
    }, []);

    const renderClass = ({ item }) => (
        <View>
            <TouchableOpacity
                style={styles.box}
                onPress={() => navigation.navigate('CategoryActiveExercices', { selectedClass: item })}
            >
                <Text style={styles.p}>{item}</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View>
                <Text style={styles.h3}>les Classes</Text>
                {loading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#0000ff" />
                    </View>
                ) : (
                    <FlatList
                        data={classes}
                        renderItem={renderClass}
                        keyExtractor={(item) => item}
                        refreshControl={
                            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                        }
                    />
                )}
                <TouchableOpacity
                    style={styles.iconAdd}
                    onPress={() => navigation.navigate('AddActiveExercices')}
                >
                    <AntDesign name="pluscircle" color={"#242F65"} size={50}  />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default Classes;
