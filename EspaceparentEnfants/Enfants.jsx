import React, { useCallback, useEffect, useState } from 'react';
import {View, Text, Image, TouchableOpacity, FlatList, RefreshControl, Alert} from 'react-native';
import { AntDesign, MaterialIcons, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import styles from './styles';
import { axiosProvider } from '../http/httpService';
import AsyncStorage from "@react-native-async-storage/async-storage";
import JWT from 'expo-jwt';
import * as FileSystem from 'expo-file-system';

const Enfants = ({ navigation }) => {
    const [childrenData, setChildrenData] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [showOptions, setShowOptions] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const token = await AsyncStorage.getItem('jwtToken');
            const decodedToken = JWT.decode(token, 'SECRET-CODE142&of', { timeSkew: 30 });
            const parentId = decodedToken.sub;
            const response = await axiosProvider.getWithToken(`parents/findChildren/${parentId}`, token);
            const childrenWithLocalImages = await Promise.all(response.data.map(async (child) => {
                if (child.image) {
                    const localImageUri = await saveImageToLocal(child.image, `child_${child.id}_${Date.now()}.jpg`);
                    return { ...child, image: localImageUri };
                }
                return child;
            }));
            setChildrenData(childrenWithLocalImages);
        } catch (error) {
            console.error(typeof error === 'string' ? error : error.message);
        }
    };

    const saveImageToLocal = async (base64Image, fileName) => {
        const path = `${FileSystem.documentDirectory}${fileName}`;
        await FileSystem.writeAsStringAsync(path, base64Image, { encoding: FileSystem.EncodingType.Base64 });
        return path;
    };

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchData();
        setTimeout(() => {
            setRefreshing(false);
        }, 1000);
    }, []);

    const handleDeleteChild = async (childId, childName) => {
        try {
            const token = await AsyncStorage.getItem('jwtToken');
            if (!token) {
                throw new Error('JWT token not found');
            }
            Alert.alert(
                `Supprimer le compte de ${childName}`,
                "Etes-vous sûr de supprimer le compte de cet enfant ? Cette opération sera définitive.",
                [
                    {
                        text: "Annuler",
                        onPress: () => console.log("Suppression annulée"),
                        style: "cancel"
                    },
                    {
                        text: "Supprimer",
                        onPress: async () => {
                            const response = await axiosProvider.delete(`parents/remove/${childId}`, token);
                            console.log(response);
                            // Mettre à jour la liste après la suppression
                            setChildrenData(prevData => prevData.filter(child => child.id !== childId));
                        }
                    }
                ]
            );
        } catch (error) {
            console.error(error);
        }
    };

    const handleOptionsToggle = (childId) => {
        setShowOptions(showOptions === childId ? null : childId);
    };

    const renderEnfantItem = ({ item }) => {
        return (
            <View>
                <View style={styles.box}>
                    <View style={{ flexDirection: 'row' }}>
                        <Image source={{ uri: item.image }} style={styles.image} />
                        <View style={{ flexDirection: 'column' }}>
                            <Text style={styles.text}>{item.email}</Text>
                            <Text style={styles.text}>{item.classe}</Text>
                        </View>
                        <View style={{ flexDirection: 'column', alignItems: 'flex-end', marginLeft: 20, marginTop: 20 }}>
                            <TouchableOpacity onPress={() => handleOptionsToggle(item.id)} style={{ marginBottom: 5 }}>
                                <Ionicons name="ellipsis-vertical" size={24} color="black" />
                            </TouchableOpacity>
                            {showOptions === item.id && (
                                <View style={{ flexDirection: 'row' }}>
                                    <TouchableOpacity onPress={() => handleDeleteChild(item.id, item.email)} style={{ marginRight: 10 }}>
                                        <MaterialIcons name="delete" size={24} color="black" />
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => navigation.navigate('UpdateCompteChild', { childId: item.id, childName: item.email })}>
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

    return (
        <View style={{width:'100%', height:'100%', backgroundColor: '#FFFFFF'}}>
            <View style={{marginTop: 20}}>
                <Text style={styles.title}>Mes enfants</Text>
                <FlatList
                    data={childrenData}
                    renderItem={renderEnfantItem}
                    keyExtractor={(item, index) => index.toString()}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                />
                {childrenData.length < 3 && (
                    <View>
                        <TouchableOpacity
                            style={{ flexDirection: "row", justifyContent: 'flex-end', marginRight: 20, marginTop: 350 }}
                            onPress={() => navigation.navigate('AddChild')}
                        >
                            <AntDesign name="pluscircle" color={"#242F65"} size={50} />
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </View>
    );
};

export default Enfants;
