import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { Image } from 'react-native';
import Enfants from '../EspaceparentEnfants/Enfants';
import ParentProfil from '../EspaceParentProfil/ParentProfil';
import BackPack from '../BackPack/BackPack';
import ParentExercices from '../EspaceParentExercices/ParentExercices';
import ListExercices from "../EspaceParentExercices/ListExercice";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const ParentExercicesStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="ParentExercices" component={ParentExercices} options={{headerShown: false}}/>
            <Stack.Screen name="ListExercices" component={ListExercices} options={{headerShown: false}}/>
            <Stack.Screen name="BackPack" component={BackPack} options={{headerShown: false}}/>
        </Stack.Navigator>
    );
};

const AppNavigator = () => {

    return (
        <Tab.Navigator
            screenOptions={{
                tabBarShowLabel: true,
                tabBarHideOnKeyboard: true,
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: '#00000029',
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    elevation: 0,
                    height: 70,
                },
                tabBarLabelStyle: {
                    fontFamily: 'regular',
                    fontSize: 12,
                    color: '#707070',
                    lineHeight: 15,
                    textAlign: 'center',
                    marginBottom: 10,
                },
            }}>

            <Tab.Screen
                name="ParentExercicesStack"
                component={ParentExercicesStack}
                options={{
                    title: 'Exercices',
                    tabBarIcon: () => (
                        <Image
                            source={require('../assets/images/exercice.svg')}
                            style={{ width: 24, height: 24, resizeMode: 'contain' }}
                        />
                    ),
                }}
            />
            <Tab.Screen
                name="BackPack"
                component={BackPack}
                options={{
                    title: 'BackPack',
                    tabBarIcon: () => (
                        <MaterialIcons name="backpack" size={24} color="black" />
                    ),
                }}
            />
            <Tab.Screen
                name="Enfants"
                component={Enfants}
                options={{
                    title: 'Enfants',
                    tabBarIcon: () => <MaterialIcons name="child-care" size={24} color="black" />,
                }}
            />
            <Tab.Screen
                name="ParentProfil"
                component={ParentProfil}
                options={{
                    title: 'Compte parent',
                    tabBarIcon: () => <FontAwesome name="user" size={24} color="black" />,
                }}
            />
        </Tab.Navigator>
    );
};


export default AppNavigator;
