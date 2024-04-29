import React, { useEffect, useState } from 'react';
import { SafeAreaView, TouchableOpacity, View, Text, StyleSheet, Image, FlatList } from 'react-native';
import { axiosProvider } from '../../http/httpService';
import * as FileSystem from "expo-file-system";

const ListChildParent = () => {
    const [parents, setParents] = useState([]);
    const [children, setChildren] = useState([]);
    const [showParents, setShowParents] = useState(true);

    const saveImageToLocal = async (base64Image, fileName) => {
        const path = `${FileSystem.documentDirectory}${fileName}`;
        await FileSystem.writeAsStringAsync(path, base64Image, { encoding: FileSystem.EncodingType.Base64 });
        return path;
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const parentResponse = await axiosProvider.get('admin/AllParents');
                const childResponse = await axiosProvider.get('admin/AllChildren');
                const childrenWithLocalImages = await Promise.all(childResponse.data.map(async (child) => {
                    if (child.image) {
                        const localImageUri = await saveImageToLocal(child.image, `child_${child.id}_${Date.now()}.jpg`);
                        return { ...child, image: localImageUri };
                    }
                    return child;
                }));
                setParents(parentResponse.data);
                setChildren(childrenWithLocalImages);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const renderItem = ({ item }) => {
        if (showParents) {
            return (
                <View style={styles.item}>
                    <Text style={styles.text}>{item.username}</Text>
                    <Text style={styles.text}>{item.email}</Text>
                    <Text style={styles.text}>{item.tel}</Text>
                </View>
            );
        } else {
            return (
                <View style={styles.item}>
                    <View style={{ flexDirection: 'row' }}>
                        <Image source={{ uri: item.image }} style={styles.image} />
                        <View style={{ flexDirection: 'column' }}>
                            <Text style={styles.text}>{item.email}</Text>
                            <Text style={styles.text}>{item.classe}</Text>
                        </View>
                    </View>
                </View>
            );
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={[styles.button, styles.buttonParent, showParents ? styles.activeButton : null]}
                    onPress={() => setShowParents(true)}
                >
                    <Text style={styles.buttonText}>Parents</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.button, styles.buttonChild, !showParents ? styles.activeButton : null]}
                    onPress={() => setShowParents(false)}
                >
                    <Text style={styles.buttonText}>Children</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={showParents ? parents : children}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                style={styles.listContainer}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        flexGrow: 1,
        backgroundColor: '#FFFFFF',
        marginTop: 30,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    button: {
        flex: 1,
        padding: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#ccc',
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonParent: {
        marginRight: 5,
    },
    buttonChild: {
        marginLeft: 5,
    },
    activeButton: {
        backgroundColor: '#007bff',
        borderColor: '#007bff',
    },
    buttonText: {
        fontFamily: 'medium',
        fontSize: 16,
        color: '#242F65',
        lineHeight: 19,
        textAlign: 'center',
    },
    listContainer: {
        flex: 1,
        marginBottom: 80,
    },
    text: {
        fontFamily: 'regular',
        fontSize: 15,
        color: '#2C2C2C',
        lineHeight: 20,
        marginTop: 20,
        marginLeft: 25,
    },
    item: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#242F65',
    },
    image: {
        width: 80,
        height: undefined,
        aspectRatio: 1,
        borderRadius: 50,
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 20,
        resizeMode: 'contain',
        flexDirection: 'row',
    },
});

export default ListChildParent;
