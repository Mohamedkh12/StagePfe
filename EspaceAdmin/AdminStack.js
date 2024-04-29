import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import AdminExercices from "./Exercices/AdminExercices" ;
import ListChildParent from "./ListUsers/ListChildParent";
import {FontAwesome} from "@expo/vector-icons";
import {Image} from "react-native";
import CategoryExercices from "./Exercices/CategoryExercice";
import ClassList from "./Exercices/ClassList";

const screenOptions = {
    tabBarShowLabel: true,
    tabBarHideOnKeyboard:true,
    headerShown: false,
    tabBarStyle:{
        backgroundColor:'#00000029',
        position:"absolute",
        bottom:0,
        left:0,
        right:0,
        elevation:0,
        height:70,
    },
    tabBarLabelStyle: {
        fontFamily:'regular',
        fontSize:12,
        color:'#707070',
        lineHeight:15,
        textAlign:'center',
        marginBottom:10

    }
}
const Tab=createBottomTabNavigator()
const AdminStack = () => {
  return(
      <Tab.Navigator screenOptions={screenOptions}>
          <Tab.Screen name={'CategoryExercices'} component={CategoryExercices} options={{title:'Exercices',
              tabBarIcon: () => (
                  <Image
                      source={require('../assets/images/exercice.svg')}
                      style={{ width: 24, height: 24, resizeMode: 'contain' }}
                  />
              )}}
         />
          <Tab.Screen name={'Profile'} component={ListChildParent} options={{title:'Users',
              tabBarIcon:()=>{
                  return(<FontAwesome name="user" size={24} color="black" />)
              }}}/>
      </Tab.Navigator>
  )
}

export default AdminStack

