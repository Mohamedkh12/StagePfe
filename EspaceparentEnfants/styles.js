import {StyleSheet} from "react-native";
const styles=StyleSheet.create({
    container:{
        width:'100%',
        height:'100%',
        backgroundColor: '#FFFFFF',
    },
    box: {
        width: '90%',
        marginLeft: '5%',

        marginTop: 25,
        height: 'auto',
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#242F65',
        borderRadius: 8,
        flexDirection: 'column',
        padding: 10,
        alignItems: 'flex-start',
    },

    image: {
        width: 80,
        height: 80,
        marginLeft: 20,
        borderRadius: 40,
    },

    title:{
        fontFamily:'bold',
        fontSize:26,
        color:'#293772',
        lineHeight:32,
        marginTop:30,
        marginLeft:25,
    },
    h2:{
        fontFamily:'bold',
        fontSize:24,
        color:'#293772',
        lineHeight:29,
        marginTop:30,
        marginLeft:25
    },
    text:{
        fontFamily:'regular',
        fontSize:15,
        color:'#2C2C2C',
        lineHeight:22,
        marginTop:10,
        marginLeft:25
    },
    icon:{
        flexDirection: 'column',
        alignItems: 'flex-end',
        right:10,
        marginTop:30
    },
    textbuttom:{
        fontFamily: 'medium',
        fontSize: 16,
        color: '#242F65',
        lineHeight: 19,
        textAlign: 'center',
    },
    buttom:{
        flexDirection: 'column',
        right:10,
        borderRadius:8,
        borderColor: '#242F65',
        borderWidth: 1,
        marginTop: 7,
        marginLeft: 20,
        width: 260,
        height: 43,
        justifyContent: 'center',
    }

})

export default styles