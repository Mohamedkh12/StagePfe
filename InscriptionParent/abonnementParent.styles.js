import {Platform, StyleSheet} from "react-native";

const styles = StyleSheet.create({
    contentContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 50,
    },
    contentContainer2: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
        marginTop: 50
    },
    content1: {
        backgroundColor: '#E8F9F9',
        opacity: 1,
        width: 355,
        height: 500,
        borderRadius: 15,
        marginTop: 20,
        marginBottom: 80,
    },
    content2: Platform.select({
        ios: {
            backgroundColor: '#FEEBC4',
            opacity: 1,
            width: 355,
            height: 560,
            borderRadius: 15,
            marginTop: 40,
        },
        android: {
            backgroundColor: '#FEEBC4',
            opacity: 1,
            width: 355,
            height: 560,
            borderRadius: 15,
            marginTop: 120,
        }

}),
    innerContent: {
        alignItems: 'center',
        marginTop: 10,
    },
    H1: {
        fontFamily: 'bold',
        fontSize: 26,
        color: "#293772",
        lineHeight: 32,
        marginTop: 10,
        marginLeft: 10,
        textAlign: 'center',
    },
    H2: {
        fontFamily: 'bold',
        fontSize: 24,
        color: "#293772",
        lineHeight: 29,
        marginTop: 17,
    },
    H3: {
        fontFamily: 'bold',
        fontSize: 25,
        color: "#293772",
        lineHeight: 27,
        textAlign: 'center',
    },
    text: (marginTop, marginButton) => ({
        fontSize: 15,
        fontFamily: 'regular',
        color: '#2C2C2C',
        lineHeight: 19,
        marginLeft: 10,
        textAlign: 'center',
        marginBottom: marginButton,
        marginTop: marginTop,
    }),
    textContainer: {
        marginLeft: 20,
        marginRight: 20,
        marginTop: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        alignSelf: 'center',
    },

    containerImage: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        alignSelf: 'center',
        marginTop: 10,
    },
    image: {
        opacity: 1,
        marginTop: 25,
        marginRight: 40,
        marginLeft: 40,
    },
    buttonWrapper: {
        backgroundColor: '#65D9D6',
        borderWidth: 1,
        borderColor: '#65D9D6',
        borderRadius: 8,
        opacity: 1,
        paddingHorizontal: 20, // Utilisation de padding horizontal au lieu de largeur fixe
        paddingVertical: 10, // Utilisation de padding vertical pour l'espacement
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 10,
        alignSelf: 'center', // Centrer le bouton horizontalement
    },
    buttonText: {
        fontFamily: 'medium',
        fontSize: 15, // Taille de la police adaptative
        lineHeight: 19,
        letterSpacing: 0,
        color: '#242F65',
        textTransform: 'uppercase',
        opacity: 1,
    },

    italicText: {
        fontFamily: 'italic',
        fontSize: 15,
        color: '#707070',
        lineHeight: 19,
        textAlign: 'center',
    },
    lienRetour: {
        position: 'absolute',
        paddingVertical:-15,
        marginLeft: 30,
        fontFamily:'regular',
        fontSize:18,
        color:'#2C2C2C',
        textDecorationLine:'underline',
        lineHeight:22,
    },
    icon:{
        marginLeft:10,
        fontSize:20,
        color:"#272727"
    }
});
export default styles