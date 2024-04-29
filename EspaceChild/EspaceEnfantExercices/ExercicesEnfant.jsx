import {SafeAreaView, Text, TouchableOpacity, View} from "react-native";
import {useState} from "react";

const ExercicesEnfant = ({navigation}) => {

    return(
        <SafeAreaView>
            <View>
                <View>
                    <Text>Mes exercices</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('BackPackEnfant')}>
                        <Text>BackPack</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    )
}

export default ExercicesEnfant