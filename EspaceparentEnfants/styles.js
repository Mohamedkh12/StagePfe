import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        backgroundColor: '#FFFFFF',
    },
    box: {
        width: '90%',
        marginLeft: '5%',
        marginTop: 20,
        height: 'auto',
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#242F65',
        borderRadius: 10,
        flexDirection: 'column',
        alignItems: 'flex-start',
        shadowColor: '#242F65',
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        position: 'relative', // Pour permettre le positionnement absolu de l'icône d'options
    },
    floatingButton: {
        flexDirection: "row",
        justifyContent: 'flex-end',
        marginRight: 20,
        marginBottom: 20,
        position: 'absolute',
        bottom: 20,
        right: 20,
    },
    image: {
        width: 80,
        height: 80,
        marginLeft: 20,
        borderRadius: 40,
    },
    title: {
        fontFamily: 'bold',
        fontSize: 26,
        color: '#293772',
        lineHeight: 32,
        marginTop: 45,
        marginLeft: 25,
    },
    h2: {
        fontFamily: 'bold',
        fontSize: 24,
        color: '#293772',
        lineHeight: 29,
        marginTop: 30,
        marginLeft: 25,
    },
    text: {
        fontFamily: 'regular',
        fontSize: 15,
        color: '#2C2C2C',
        lineHeight: 22,
        marginTop: 10,
    },
    icon: {
        flexDirection: 'column',
        alignItems: 'flex-end',
        right: 10,
        marginTop: 30,
    },
    textbuttom: {
        fontFamily: 'medium',
        fontSize: 16,
        color: '#242F65',
        lineHeight: 19,
        textAlign: 'center',
    },
    buttom: {
        flexDirection: 'column',
        right: 10,
        borderRadius: 8,
        borderColor: '#242F65',
        borderWidth: 1,
        marginTop: 7,
        marginLeft: 20,
        width: 260,
        height: 43,
        justifyContent: 'center',
    },
    optionsContainer: {
        flexDirection: 'column',
        alignItems: 'flex-end',
        marginLeft: 'auto',
    },
    ellipsisButton: {
        position: 'absolute', // Positionnement absolu pour placer l'icône à droite
        top: 10,
        right: 10,
    },
    optionsBox: {
        flexDirection: 'row',
        backgroundColor: '#F0F0F0',
        padding: 5,
        borderRadius: 5,
        elevation: 2, // Ombre pour Android
        shadowColor: '#000', // Ombre pour iOS
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
        marginTop: 5,
        marginRight: 10,
    },
    optionButton: {
        marginHorizontal: 5,
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 10,
    },
    optionText: {
        marginLeft: 5,
        fontSize: 16,
        color: '#242F65',
    },
});

export default styles;
