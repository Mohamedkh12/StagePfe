import React, { useState } from 'react';
import { View, TextInput, Button } from 'react-native';
const Form = ({ index, formData, handleInputChange }) => {
    return (
        <View>
            <TextInput
                style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10 }}
                placeholder="Username"
                value={formData.username}
                onChangeText={text => handleInputChange(index, 'username', text)}
            />
            <TextInput
                style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10 }}
                placeholder="Password"
                value={formData.password}
                onChangeText={text => handleInputChange(index, 'password', text)}
                secureTextEntry
            />
        </View>
    );
};
export default function App() {
    const [forms, setForms] = useState([{ username: '', password: '' }]);
    const [nextButtonDisabled, setNextButtonDisabled] = useState(true);
    const handleInputChange = (index, name, value) => {
        const newForms = [...forms];
        newForms[index][name] = value;
        setForms(newForms);
        // Check if all usernames are filled and unique
        const filledUsernames = newForms.filter(form => form.username.trim() !== '');
        const uniqueUsernames = new Set(filledUsernames.map(form => form.username.trim()));
        setNextButtonDisabled(filledUsernames.length !== forms.length || uniqueUsernames.size !== filledUsernames.length);
    };
    const handleAddForm = () => {
        setForms([...forms, { username: '', password: '' }]);
    };
    const handleNextButtonClick = () => {
        // Do something when the Next button is clicked
        console.log('Next button clicked');
    };
    return (
        <View style={{ padding: 20 }}>
            {forms.map((form, index) => (
                <Form key={index} index={index} formData={form} handleInputChange={handleInputChange} />
            ))}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Button title="+" onPress={handleAddForm} />
                <Button title="Next" onPress={handleNextButtonClick} disabled={nextButtonDisabled} />
            </View>
        </View>
    );
}