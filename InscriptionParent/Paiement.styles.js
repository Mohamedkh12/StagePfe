import {StyleSheet} from 'react-native';
const styles=StyleSheet.create({
    container:{
        width: "100%",
        height: "100%",
        backgroundColor: '#FFFFFF',
    },
    content: {
        flex: 1,
        flexDirection: 'column',
        width: 356,
        height: '100%',
        backgroundColor: '#D8F6F5',
        borderRadius: 23,
        opacity: 1,
        marginTop: 20,
        padding: 20,
        alignSelf: 'center',
    },
    h1: {
        fontSize: 24,
        fontFamily: 'bold',
        color: '#293772',
        lineHeight: 29,
        marginTop: 10,
        textAlign: 'center',
    },
    h3: {
        fontSize: 22,
        fontFamily: 'bold',
        lineHeight: 22,
        color: '#293772',
        marginBottom: 16,
    },
    text: {
        fontFamily: 'regular',
        fontSize: 15,
        color: '#2C2C2C',
        marginBottom: 16,
        marginTop: 18,
        marginLeft: 20,
        textAlign: 'left',
    },
    label: {
        fontFamily: 'regular',
        fontSize: 16,
        color: '#272727',
        lineHeight: 19,
        marginBottom: 10,
        marginTop: 18,
        paddingHorizontal: 10,
    },
    inputwrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    inputcontent: {
        flex: 1,
        fontFamily: 'regular',
        fontSize: 16,
        color: '#707070',
        lineHeight: 19,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#707070',
        borderRadius: 8,
        opacity: 1,
        height: 52,
        padding: 10,
    },
    datePicker: {
        height: 50,
        width: '100%',
        padding: 10,
        marginTop: 5,
    },
    icon: {
        position: 'absolute',
        color: '#000000',
        fontSize: 15,
        left: 15,
    },
    iconRight: {
        position: 'absolute',
        color: '#000000',
        fontSize: 15,
        right: 15,
        textAlign: 'right'
    },
    textbuttom:{
        fontFamily: 'medium',
        fontSize: 16,
        color: '#242F65',
        lineHeight: 19,
        textAlign: 'center',
    },
    buttom:{
        backgroundColor: '#65D9D6',
        borderWidth: 1,
        borderColor: '#65D9D6',
        borderRadius: 8,
        opacity: 1,
        width: 148,
        height: 43,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: -12,
        marginRight: 20,
    },
    lienRetour: {
        position: 'absolute',
        left:2,
        marginVertical: -3,
        paddingVertical: -15,
        marginLeft: 30,
        fontFamily: 'regular',
        fontSize: 18,
        color: '#2C2C2C',
        textDecorationLine: 'underline',
        lineHeight: 22,
        textAlign: 'left',
    },
})

export default styles