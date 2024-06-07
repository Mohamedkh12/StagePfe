import {Platform, StyleSheet} from "react-native";

const styles = StyleSheet.create({
    container: {
        flex:1,
        padding: 20,
        backgroundColor: '#FFFFFF',
    },
    content:{
        marginRight:20,
    },
    box: {
        width: '90%',
        marginLeft: '5%',
        marginTop: 25,
        height: 60,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#242F65',
        borderRadius: 8,
        flexDirection: 'row',
        //padding: 10,
        alignItems: 'center',
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
    boxSubcategory: {
        width: '90%',
        marginLeft: '5%',
        marginTop: 25,
        height: 60,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#242F65',
        borderRadius: 8,
        flexDirection: 'row',
        padding: 10,
        alignItems: 'center',
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
    h3: {
        fontFamily:'bold',
        fontSize:22,
        color:'#293772',
        lineHeight:27,
        marginLeft:3,
        marginTop : 8,
        alignItems:"center"
    },
    p:{
        fontFamily:'regular',
        fontSize:18,
        color:'#707070',
        lineHeight:22,
        marginLeft:30,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    class: {
        fontSize: 16,
        paddingVertical: 5,
    },
    iconGauche:{
        color:'#242F65',
        fontSize:26,
        marginTop:Platform.OS === "ios" ? 10: 50,
        marginLeft:15,
        fontFamily:'bold'
    },
    iconAdd:{
        marginTop : 170,
        flexDirection: "row",
        justifyContent: 'flex-end',
        marginRight: 20,
        marginBottom:40
    },
});

export default styles