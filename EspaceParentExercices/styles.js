import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
       
        padding: 20,
        backgroundColor: '#FFFFFF',
    },
    childContainer: {
        flexDirection: 'row',
        marginBottom: 10,
        marginTop: 20,
        marginLeft: 20,
        paddingHorizontal: 10,
    },
    childItem: {
        fontSize: 18,
        lineHeight: 22,
        marginLeft: 40,
    },
    defaultChild: {
        color: '#707070',
    },
    selectedChild: {
        color: '#242F65',
    },
    selectedLine: {
        height: 1,
        backgroundColor: '#242F65',
        marginTop: 5,
        width: 50,
        marginLeft: 40,
    },
    itemSeparator: {
        height: 10,
    },
    text: {
        fontFamily: 'regular',
        fontSize: 15,
        color: '#2C2C2C',
        lineHeight: 22,
        marginTop: 10,
        marginLeft: 25
    },
    h2: {
        fontFamily: 'bold',
        fontSize: 24,
        color: '#293772',
        lineHeight: 29,
        marginTop: 5,
        marginLeft: 25
    },
    box: {
        width: '90%',
        marginLeft: '5%',
        marginTop: 30,
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
});

export default styles;
