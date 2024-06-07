import {StyleSheet,Platform} from "react-native";

const styles = StyleSheet.create({
    container: {
        flex:1,
        padding: 20,
        backgroundColor: '#FFFFFF',
    },
    content:{
        marginRight:20,
    },
    title: {
        fontSize: 27,
        fontWeight: 'bold',
        marginBottom: 10,
        marginTop:Platform.OS === "ios" ? 10: 50,
        color:'#293772',
    },
    h3: {
        fontFamily:'bold',
        fontSize:22,
        color:'#293772',
        lineHeight:27,
        marginLeft:3,
        marginTop : 10
    },
    text: {
        fontFamily: 'regular',
        fontSize: 15,
        color: '#2C2C2C',
        lineHeight: 22,
        marginTop: 10,
        padding: 10,
    },
    box: {
        width: '90%',
        marginLeft: '5%',
        marginTop: 25,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#242F65',
        borderRadius: 8,
        flexDirection: 'row',
        padding: 10,
        height: 60,
        alignItems: 'center',
        alignContent: 'center',
        justifyContent: 'space-between',
        shadowColor: '#242F65',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    boxExercice: {
        width: '90%',
        marginLeft: '5%',
        marginTop: 20,
        height: 'auto',
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#242F65',
        borderRadius: 10,
        flexDirection: 'column',
        //padding: 10,
        alignItems: 'flex-start',
        shadowColor: '#242F65',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
    url:{ 
        width: '100%', 
        height: 'auto',
        aspectRatio: 1, 
        position: 'relative',
        shadowColor: '#242F65',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        borderRadius:10,
    },
    triangleIcon:{ 
        flexDirection: 'column',
        position: 'absolute', 
        top: '50%', 
        left: '50%', 
        transform: 
            [{ translateX: -30 }, { translateY: -30 }] 
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    icon: {
        marginLeft: 180,
        marginTop: 20,
        justifyItems:"flex-end"
    },
    iconGauche:{
        color:'#242F65',
        fontSize:26,
        marginTop:Platform.OS === "ios" ? 12: 50,
        marginLeft:15,
        fontFamily:'bold'
    },
    errorContainer: {
        flex: 1,
        alignSelf:"center",
        marginTop:220,
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

export default styles;