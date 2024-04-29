import React, { useEffect, useState } from 'react';
import {
    View,
    TouchableOpacity,
    Text,
    FlatList,
    RefreshControl,
    SafeAreaView
} from 'react-native';
import styles from './styles';
import AsyncStorage from "@react-native-async-storage/async-storage";
import JWT from "expo-jwt";
import { axiosProvider } from "../http/httpService";

const getToken = async (key) => {
    return await AsyncStorage.getItem(key);
};

const ChildrenList = ({ setSelectedChild, onSelectChildId }) => {
    const [selectedItem, setSelectedItem] = useState(null);
    const [childrenNames, setChildrenNames] = useState([]);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const token = await getToken('jwtToken');
            const decodedToken = JWT.decode(token, 'SECRET-CODE142&of', { timeSkew: 30 });
            const parentId = decodedToken.sub;
            const response = await axiosProvider.getWithToken(`parents/childrenIdName/${parentId}`, token);
            const children = response.data;

            setChildrenNames(children);
        } catch (error) {
            console.error(error.message);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchData();
        setRefreshing(false);
    };

    const renderChild = ({ item }) => {
        const isSelected = selectedItem === item.name;

        return (
            <TouchableOpacity onPress={() => {
                setSelectedChild(item.name);
                setSelectedItem(item.name);
                onSelectChildId(item.id);
            }}>
                <View style={{ alignItems: 'center' }}>
                    <Text style={[styles.childItem, isSelected ? styles.selectedChild : styles.defaultChild]}>
                        {item.name}
                    </Text>
                    {isSelected && <View style={styles.selectedLine} />}
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={childrenNames}
                renderItem={renderChild}
                keyExtractor={(item) => item.id.toString()}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                contentContainerStyle={styles.childContainer}
            />
        </SafeAreaView>
    );
};

export default ChildrenList;
