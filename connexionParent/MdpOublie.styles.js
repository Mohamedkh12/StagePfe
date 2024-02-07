import {StyleSheet} from "react-native";

const styles = StyleSheet.create({
    container: {
        flex:1,
        flexDirection:"column",
        alignItems:"center",
        backgroundColor: '#FFFFFF',
        width:" 100%",
        height:"100%"
    },
    imagecontainer:{
        position:"relative",
        marginTop: 70,
        marginBottom: 80,
        width: 111,
        height: 89,
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
        opacity: 1,
    },
    H1:{
        fontFamily: 'bold',
        fontSize: 26,
        lineHeight: 32,
        color: '#293772',
        letterSpacing: 0,
        textAlign: 'left',
        opacity: 1,
    },
    text:{
        fontFamily:"regular",
        fontSize:15,
        color:"#2C2C2C",
        lineHeight:19,
    },
    inputwrapper:{
        marginTop: 30,
        marginBottom:25,
    },
    input:{
        width: 310,
        height: 52,
        fontFamily:"regular",
        marginTop:8,
        backgroundColor: '#FFFFFF',
        borderColor: '#707070',
        borderWidth: 1,
        borderRadius: 8,
        opacity: 1,
        fontSize:16,
        color:'#707070',
        letterSpacing:0,
        lineHeight:19,
        paddingLeft:15,
    },
    buttonwrapper:{
        marginTop:17,
        marginBottom:20,
        width: 315,
        height: 46,
        backgroundColor: '#65D9D6',
        borderColor: '#65D9D6',
        borderWidth: 1,
        borderRadius: 8,
        opacity: 1,
        justifyContent:"center",

    },
    buttontext:{
        alignSelf:"center",
        fontFamily:"meduim",
        fontSize:18,
        color:'#242F65',
        lineHeight:22,
        textTransform:"uppercase",
    },
    lientext:{
        fontSize:18,
        fontFamily:"regular",
        color:"#2C2C2C",
        lineHeight:22,
        textDecorationLine:"underline",
        marginBottom:20
    }

})

export default styles