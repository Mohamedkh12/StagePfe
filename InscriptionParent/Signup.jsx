import AbonnementParent from "./AbonnementParent";
import { View } from "react-native";
import { ProgressStep, ProgressSteps } from "react-native-progress-steps";
import { useState } from "react";

const Signup = () => {

    const buttonTextStyle = {
        color: '#393939'
    };
    return (
        <View style={styles.container}>
            <ProgressSteps
            >
                <ProgressStep label="Abonnement Parent" nextBtnTextStyle={buttonTextStyle} previousBtnTextStyle={buttonTextStyle}>
                    <View>
                        <AbonnementParent/>
                    </View>
                </ProgressStep>
            </ProgressSteps>
        </View>
    );
};

export default Signup;

const styles = {
    container: {
        flex: 1,
        justifyContent: "center",
        padding: 16,
    },
};
