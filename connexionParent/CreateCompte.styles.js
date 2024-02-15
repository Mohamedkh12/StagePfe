import {StyleSheet} from "react-native";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: '#FFFFFF',
        width: "100%",
    },
    logoContainer: {
        top: 0,
        left: 0,
        width: 430,
        height: 100,
        backgroundColor: '#FFFFFF',
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.29,
        shadowRadius: 6,
        opacity: 1,
    },
    logo: {
        position: 'absolute',
        width: 66,
        height: 53,
        resizeMode: 'cover',
        marginTop:30,
        marginLeft:50
    },
    content:{
        position: 'absolute',
        width: "100%",
        height: "100%",
        opacity: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 27,
        marginLeft: 20,
    },
    H1:{
        marginTop:30,
        fontFamily:'bold',
        fontSize: 26,
        lineHeight: 32,
        color: '#293772',
        opacity: 1,
        textAlign:"center"
    },
    contentParent:{
        marginTop:15,
        alignItems:"center",
    },
    contetnEnseignant:{
        marginTop:10,
        marginBottom:12,
        alignItems:"center",
       justifyContent:"center"
    },
    imageParent:{
        width: 97,
        height: 111,
        opacity: 1,
        resizeMode: 'cover',
    },
    imageEnseignant:{
        width: 97,
        height: 111,
        opacity: 1,
        resizeMode: 'cover',
        paddingLeft: 30
    },
    H2:{
      fontFamily:'bold',
      fontSize:24,
      lineHeight: 29,
        color: '#293772',
    },
    text:{
        fontFamily:'regular',
        color: '#2C2C2C',
        fontSize: 15,
        lineHeight: 19,
        textAlign:"center",
        marginLeft:40,
        marginRight:40
    },
    lien:{
        fontFamily:'regular',
        color: '#2C2C2C',
        fontSize: 18,
        lineHeight: 22,
        textAlign:"center",
        textDecorationLine:"underline",
        marginTop:10
    }
})

export default styles