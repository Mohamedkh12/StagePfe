import React, { useState} from 'react';
import {Alert, ImageBackground, KeyboardAvoidingView, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View,} from 'react-native';
import { CheckBox } from 'react-native-elements';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import { Controller, useForm } from 'react-hook-form';
import CustomHeader from './CustomHeader';
import styles from './CompteParent.styles';
import ProgressStepsScreen from "./ProgressStepsScreen";
import {axiosProvider} from "../http/httpService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import JWT from "expo-jwt";

const CompteParent = ({ route, navigation }) => {
    const { roleId } = route.params;
    const {
        control,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm({
        defaultValues: {
            firstName: '',
            email: '',
            phone: '',
            password: '',
            acceptTerms: false,
        },
    });

    const [showPassword, setShowPassword] = useState(false);
    const [isChecked, setChecked] = useState(false);

    const onSubmit = async (data) => {
        if (!data.acceptTerms) {
            alert('Vous devez accepter les conditions générales de vente.');
        } else {
            try {
                const user = await createParentAccount(data);
                if (user.status === 400) {
                    Alert.alert('Erreur', 'Cet utilisateur existe déjà.');
                }
                if (user.status === 201) {
                    navigation.navigate('Paiement');
                }
            } catch (error) {
                console.error('Erreur lors de la création du compte parent :', error);
            }
        }
    };

    const createParentAccount = async (data) => {
        try {
            const response = await axiosProvider.post('parents/createParent', {
                username: data.firstName,
                email: data.email,
                tel: data.phone,
                password: data.password,
                roleId: roleId,
            });

            console.log("Response data:", response.data);
            await AsyncStorage.setItem('jwtToken', response.data.access_token);
            return response;
        } catch (error) {
            console.error('Erreur lors de la création du compte parent :', error);
            throw error;
        }
    };


    const steps = ['Abonnement', 'Compte parent', 'Paiement', 'Mes enfants', 'Mes infos personnelles'];
    const currentStep =1;
    return (
        <KeyboardAvoidingView behavior="padding" enabled>
            <ScrollView style={styles.container}>
                <View>
                    <CustomHeader />
                    <ProgressStepsScreen steps={steps} currentStep={currentStep} />
                </View>
                <SafeAreaView >
                    <ImageBackground source={require('../assets/images/bulleBleueBasse.png')} style={styles.image}>
                        <View style={styles.container}>
                            <View>
                                <Text style={styles.h1}>Mon Compte Parent</Text>
                                <Text style={styles.text}>
                                    Pour vous connecter à la plateforme, vous aurez besoin de votre identifiant et mot de passe.
                                </Text>
                            </View>
                            <View style={styles.content}>
                                <View style={{ marginLeft: 20, marginTop: 16 }}>
                                    <Text style={styles.h3}>Connexion</Text>

                                    {/* Prénom */}
                                    <Controller
                                        control={control}
                                        rules={{
                                            required: 'Ce champ est requis.',
                                            maxLength: { value: 30, message: 'Le prénom est trop long.' },
                                        }}
                                        render={({ field }) => (
                                            <>
                                                <Text style={styles.label}>Prénom*</Text>
                                                <View style={styles.inputwrapper}>
                                                    <TextInput
                                                        placeholder="First name"
                                                        onBlur={field?.onBlur}
                                                        onChangeText={(value) => field?.onChange(value)}
                                                        value={field?.value}
                                                        style={styles.inputcontent}
                                                    />
                                                </View>
                                                {errors.firstName && (
                                                    <Text style={{ color: 'red' }}>{errors.firstName.message}</Text>
                                                )}
                                            </>
                                        )}
                                        name="firstName"
                                    />

                                    {/* Email */}
                                    <Controller
                                        control={control}
                                        rules={{
                                            required: 'Ce champ est requis.',
                                            pattern: {
                                                value: /^\S+@\S+$/i,
                                                message: 'Email invalide.',
                                            },
                                        }}
                                        render={({ field }) => (
                                            <>
                                                <Text style={styles.label}>Email*</Text>
                                                <View style={styles.inputwrapper}>
                                                    <TextInput
                                                        onBlur={field.onBlur}
                                                        onChangeText={(value) => field.onChange(value)}
                                                        value={field.value}
                                                        keyboardType="email-address"
                                                        inputMode="email"
                                                        autoCompleteType="email"
                                                        placeholder="Enter your email address"
                                                        style={styles.inputcontent}
                                                    />
                                                </View>
                                                {errors.email && (
                                                    <Text style={{ color: 'red' }}>{errors.email.message}</Text>
                                                )}
                                            </>
                                        )}
                                        name="email"
                                    />

                                    {/* Mot de passe */}
                                    <Text style={styles.label}>Mot de passe*</Text>
                                    <View style={styles.passwordInputWrapper}>
                                        <Controller
                                            control={control}
                                            rules={{
                                                required: 'Ce champ est requis.',
                                                minLength: { value: 8, message: 'Le mot de passe doit avoir 8 caractères.' },
                                            }}
                                            render={({ field }) => (
                                                <View style={styles.passwordInputContainer}>
                                                    <TextInput
                                                        placeholder="Password"
                                                        onBlur={field.onBlur}
                                                        onChangeText={(value) => field.onChange(value)}
                                                        value={field.value}
                                                        secureTextEntry={!showPassword}
                                                        inputMode="text"
                                                        autoCompleteType="password"
                                                        style={styles.passwordInput}
                                                        minLength={8}
                                                    />
                                                    <MaterialIcons
                                                        style={styles.passwordIcon}
                                                        name={showPassword ? 'visibility' : 'visibility-off'}
                                                        onPress={() => setShowPassword(!showPassword)}
                                                    />
                                                </View>
                                            )}
                                            name="password"
                                        />

                                    </View>
                                    {errors.password && (
                                        <Text style={{ color: 'red' }}>{errors.password.message}</Text>
                                    )}
                                    {/* Téléphone */}
                                    <Controller
                                        control={control}
                                        rules={{
                                            required: 'Ce champ est requis.',
                                        }}
                                        render={({ field }) => (
                                            <>
                                                <Text style={styles.label}>Téléphone:</Text>
                                                <View style={styles.inputwrapper}>
                                                    <TextInput
                                                        placeholder="Phone"
                                                        onBlur={field.onBlur}
                                                        onChangeText={(value) => field.onChange(value)}
                                                        value={field.value}
                                                        keyboardType="numeric"
                                                        inputMode="tel"
                                                        autoCompleteType="tel"
                                                        dataDetectorTypes={'phoneNumber'}
                                                        style={styles.inputcontent}
                                                    />
                                                </View>
                                                {errors.phone && (
                                                    <Text style={{ color: 'red' }}>{errors.phone.message}</Text>
                                                )}
                                            </>
                                        )}
                                        name="phone"
                                    />

                                    {/* Acceptation des termes */}
                                    <View style={styles.checkboxContainer}>
                                        <CheckBox
                                            checked={isChecked}
                                            onPress={() => {
                                                setChecked(!isChecked);
                                                setValue('acceptTerms', !isChecked);
                                            }}
                                            style={styles.textcheck}
                                        />
                                        <Text style={{ marginLeft: -5 }}>
                                            <Text>En vous inscrivant, vous acceptez nos </Text>
                                            <TouchableOpacity onPress={() => {}}>
                                                <Text style={{ textDecorationLine: 'underline' }}>
                                                    Conditions générales de vente
                                                </Text>
                                            </TouchableOpacity>
                                        </Text>
                                        {errors.acceptTerms && (
                                            <Text style={{ color: 'red'}}>{errors.acceptTerms.message}</Text>
                                        )}

                                    </View>
                                </View>
                            </View>

                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 30 }}>
                                <TouchableOpacity onPress={() => navigation.goBack()}>
                                    <AntDesign name="left" selectable={true} style={styles.icon} />
                                    <Text style={styles.lienRetour}>Retour</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.buttom}
                                                  onPress={handleSubmit(onSubmit)}
                                                  >
                                    <Text style={styles.textbuttom}>SUIVANT</Text>
                                    <AntDesign name="right" selectable={true} style={styles.iconRight} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </ImageBackground>
                </SafeAreaView>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default CompteParent;
