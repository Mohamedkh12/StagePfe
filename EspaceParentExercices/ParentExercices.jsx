import React, { useState, useEffect } from 'react';
import { SafeAreaView, Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import ChildrenList from './ChildrenList';
import CategoryList from './CategoryList';
import styles from './styles';
import { axiosProvider } from "../http/httpService";
import JWT from "expo-jwt";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ParentExercices = ({ navigation }) => {
    const [selectedChild, setSelectedChild] = useState(null);
    const [selectedChildId, setSelectedChildId] = useState(null);
    const [initialChildName, setInitialChildName] = useState(null);

    const getToken = async (key) => {
        return await AsyncStorage.getItem(key);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = await getToken('jwtToken');
                const decodedToken = JWT.decode(token, 'SECRET-CODE142&of', { timeSkew: 30 });
                const parentId = decodedToken.sub;
                const response = await axiosProvider.getWithToken(`parents/childrenIdName/${parentId}`, token);
                const children = response.data;

                setSelectedChild(children[0].name);
                setInitialChildName(children[0].name);
                setSelectedChildId(children[0].id);
            } catch (error) {
                console.error(error.message);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        console.log("selectedChildId updated:", selectedChildId);
        global.selectedChildId = selectedChildId;
        console.log("global.selectedChildId:", global.selectedChildId);
    }, [selectedChildId]);

    const handleSelectChildId = (childId) => {
        setSelectedChildId(childId);
        setSelectedChild(childId);
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={localStyles.rowContainer}>
                <ChildrenList setSelectedChild={setSelectedChild} onSelectChildId={handleSelectChildId} />
                <TouchableOpacity style={localStyles.backPackButton} onPress={() => navigation.navigate('BackPack')}>
                    <Text style={localStyles.textbuttom}>Back Pack</Text>
                </TouchableOpacity>
            </View>
            <CategoryList navigation={navigation} selectedChild={selectedChild} />
        </SafeAreaView>
    );
};

const localStyles = StyleSheet.create({
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        marginRight: 140,
    },
    backPackButton: {
        padding: 10,
        backgroundColor: '#FFFFFF',
        borderColor: '#242F65',
        borderWidth: 1,
        borderRadius: 5,
        marginRight: 40,
        paddingHorizontal: 20,
        marginTop: 17,
    },
    textbuttom: {
        fontFamily: 'regular',
        fontSize: 16,
        color: '#242F65',
        lineHeight: 19,
        textAlign: 'center',
    },
});

export default ParentExercices;
