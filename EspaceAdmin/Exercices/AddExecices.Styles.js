import { StyleSheet, Platform } from "react-native";

const styles = StyleSheet.create({
    container: {
        width: "100%",
        height: "100%",
        backgroundColor: '#FFFFFF',
    },
    content: {
        width: "90%",
        flexDirection: 'column',
        backgroundColor: '#D8F6F5',
        borderRadius: 23,
        opacity: 1,
        marginTop: 20,
        padding: 20,
        alignSelf: 'center',
    },
    box: {
        width: '90%',
        height: 100,
        marginLeft: '5%',
        justifyContent: 'space-between',
        marginBottom: 20,
        marginTop: 20,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#242F65',
        borderRadius: 8,
        opacity: 1,
    },
  
    label: {
        fontFamily: 'regular',
        fontSize: 15,
        color: '#272727',
        lineHeight: 19,
        marginBottom: 10,
        marginTop: 18,
        paddingHorizontal: 10,
    },
    uploadedImage: {
        width: '100%',
        height: '100%',
        borderRadius: 8,
    },
    inputimage: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: 232,
        height: 55,
        position: 'absolute',
        backgroundColor: '#FFFFFF',
        borderColor: '#242F65',
        borderWidth: 1,
        borderRadius: 8,
        padding: 16,
        opacity: 1,
    },
    inputimagewrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
        width: 312,
        height: 112,
        backgroundColor: '#FFFFFF',
        borderColor: '#242F65',
        borderWidth: 1,
        borderRadius: 8,
        borderStyle: 'dashed',
        padding: 16,
        opacity: 1,
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
    passwordInputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    passwordInputContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    passwordInput: {
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
    title: {
        fontFamily: 'bold',
        fontSize: 24,
        width: '80%',
        textAlign: 'center',
        color: '#293772',
        lineHeight: 29,
        marginTop: 50,
        marginLeft: 16,
        marginBottom: 20,
    },
    h2: {
        fontFamily: 'bold',
        fontSize: 24,
        color: '#293772',
        lineHeight: 29,
        marginTop: 5,
        marginLeft: 3,
    },
    text: {
        fontFamily: 'regular',
        fontSize: 15,
        color: '#2C2C2C',
        lineHeight: 19,
        marginTop: 10,
        marginLeft: 25,
        marginRight: 3,
    },
    icon: {
        flexDirection: 'column',
        alignItems: 'flex-end',
        right: 10,
        position: "absolute",
        marginTop: 30,
    },
    iconLeft: {
        color: '#242F65',
        fontSize: 26,
        marginTop: 50,
        marginLeft: 15,
        fontFamily: 'bold',
    },
    iconplus: {
        position: 'relative',
        fontSize: 24,
        color: '#242F65',
        marginRight: 8,
    },
    passwordIcon: {
        position: 'absolute',
        color: '#000000',
        fontSize: 24,
        textAlign: 'right',
        right: 15,
    },
    textbuttom: {
        fontFamily: 'medium',
        fontSize: 16,
        color: '#242F65',
        lineHeight: 19,
        textAlign: 'center',
    },
    buttom: {
        backgroundColor: '#65D9D6',
        borderWidth: 1,
        borderColor: '#65D9D6',
        borderRadius: 8,
        opacity: 1,
        width: '90%',
        height: 43,
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 12,
        marginRight: 20,
        marginLeft: 20,
        marginBottom: 20,
    },
    classInputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: Platform.OS === 'ios' ? 'flex-start' : 'center',
        marginBottom: 10,
    },
    classInputContent: {
        flex: 1,
        fontFamily: 'regular',
        fontSize: 16,
        justifyContent: 'center',
        color: '#707070',
        lineHeight: 19,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#707070',
        borderRadius: 8,
        opacity: 1,
        height: 52,
        padding: 10,
    }
});

export default styles;
