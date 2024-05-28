import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, View, Text, StyleSheet, RefreshControl, Image, Switch } from 'react-native';
import { axiosProvider } from '../../http/httpService';

const ShowExercice = () => {
    const [exercises, setExercises] = useState([]);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        showExercice();
    }, []);

    const showExercice = async () => {
        try {
            const response = await axiosProvider.get('exercises/showExercice');
            setExercises(response.data);
            console.log("www")
        } catch (error) {
            console.log(error);
        }
    };

    const toggleExerciseStatus = async (exerciseId, currentStatus) => {
        const newStatus = currentStatus === '1' ? '0' : '1';

        console.log('Preparing to toggle exercise status:', { exerciseId, newStatus });

        try {
            const response = await axiosProvider.patch('exercises/changeExerciseStatus', {
                exerciseId: exerciseId,
                newStatus: newStatus,
            });

            console.log('Response:', response);

            // Update the exercises state with the new status
            const updatedExercises = exercises.map(exercise =>
                exercise.id === exerciseId ? { ...exercise, active: newStatus } : exercise
            );
            setExercises([...updatedExercises]);

            console.log(`Statut de l'exercice mis à jour : ${newStatus}`);
        } catch (error) {
            console.error(`Erreur lors du changement de statut de l'exercice :`, error);
        }
    };

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        showExercice();
        setTimeout(() => {
            setRefreshing(false);
        }, 1000);
    }, []);

    const renderItem = ({ item }) => (
            <View style={styles.exerciseItem}>
                <Text style={styles.exerciseName}>{item.name}</Text>
              
            </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={exercises}
                renderItem={renderItem}
                keyExtractor={item => item.id.toString()}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                ListEmptyComponent={() => (
                    <View style={styles.errorContainer}>
                        <Image source={require('../../assets/images/folder-type.png')} style={styles.imageError} />
                        <Text style={styles.errorText}>Aucun exercice dans le backpack.</Text>
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    exerciseItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        marginVertical: 5,
        width: '90%',
        backgroundColor: '#f9f9f9',
        borderRadius: 10,
    },
    exerciseName: {
        fontSize: 16,
    },
    errorContainer: {
        flex: 1,
        alignSelf: 'center',
        marginTop: 220,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        fontFamily: 'regular',
        fontSize: 15,
        color: '#2C2C2C',
        lineHeight: 22,
        marginBottom: 30,
    },
    imageError: {
        width: 100,
        height: 100,
        resizeMode: 'contain',
        marginBottom: 20,
    },
});

export default ShowExercice;
