import { Controller, useForm } from 'react-hook-form';
import {KeyboardAvoidingView, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View} from "react-native";
import CustomHeader from "./CustomHeader";
import styles from "./Paiement.styles";
import {AntDesign} from "@expo/vector-icons";
import ProgressStepsScreen from "./ProgressStepsScreen";
import React, {useEffect, useState} from "react";
import {axiosProvider} from "../http/httpService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import JWT, { SupportedAlgorithms } from 'expo-jwt';
const InfosPersonnelles = (({ navigation }) => {
    const {control:control, handleSubmit:handelsubmit, formState: {errors}} = useForm(
        {
            defaultValues: {
                nom: '',
                prenom: '',
                Adresse: '',
                codePostale: '',
                ville:'',
                phone: '',
            }
        }
    );
    const steps = ['Abonnement', 'Compte parent', 'Paiement', 'Mes enfants', 'Mes infos personnelles'];
    const currentStep =4;
    const [data, setData] = useState([]);
   /* const onSubmit = () => {
        axiosProvider.get(`parents/findParent/${global.parentId}`)
            .then(response => {
                console.log(response);
                if (response.status === 200) {
                    const responseData = response.data;
                    if (responseData && responseData.username && responseData.password) {
                        const key = 'shh';
                        const payload = {
                            username: responseData.username,
                            password: responseData.password,
                            roleId: 2
                        };
                        const tokenParent = JWT.encode(payload, key);
                        AsyncStorage.setItem('tokenParent', tokenParent)
                            .then(() => {
                                console.log("tokenParent : ", tokenParent);
                                navigation.navigate('ButtomTabNavigation', { screen: 'Recompenses' });
                            })
                            .catch(error => {
                                console.log("Erreur lors de l'enregistrement du tokenParent :", error);
                            });
                    } else {
                        console.log("Les données username ou password sont manquantes dans la réponse.");
                    }
                }
            })
            .catch(error => {
                console.log("Erreur lors de la récupération des données du parent :", error);
            });
    };

    useEffect(() => {
        // Appeler la fonction onSubmit lorsque le composant est monté
        onSubmit();
    }, []);
*/

    return (
        <KeyboardAvoidingView behavior="padding" enabled>
            <ScrollView  style={styles.container}>
                <View>
                    <CustomHeader />
                    <ProgressStepsScreen steps={steps} currentStep={currentStep} />
                </View>
                <SafeAreaView>
                    <View style={{marginTop:15}}>
                        <Text style={styles.h1}>Mes infos personnelles</Text>
                        <Text style={styles.text}>Ces informations sont liés au paiement, elle nous permettront d’établir vos factures.</Text>
                    </View>
                    <View style={styles.content}>
                        {/* nom */}
                        <Controller
                            control={control}
                            rules={{
                                required: 'Ce champ est requis.',
                                maxLength: { value: 30, message: 'Le prénom est trop long.' },
                            }}
                            render={({ field }) => (
                                <>
                                    <Text style={styles.label}>Nom*</Text>
                                    <View style={styles.inputwrapper}>
                                        <TextInput
                                            {...field}
                                            placeholder="Nom"
                                            onBlur={field.onBlur}
                                            onChangeText={field.onChange}
                                            value={field.value}
                                            style={styles.inputcontent}
                                            autoComplete={'cc-given-name'}
                                            inputMode='text'
                                        />
                                    </View>
                                    {errors.nom && <Text style={{ color: 'red' }}>{errors.nom.message}</Text>}
                                </>
                            )}
                            name={'nom'}
                        />

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
                                            {...field}
                                            placeholder="Prénom"
                                            onBlur={field.onBlur}
                                            onChangeText={(value) => field.onChange(value)}
                                            value={field.value}
                                            inputMode='text'
                                            autoComplete={'cc-family-name'}
                                            style={styles.inputcontent}
                                        />
                                    </View>
                                    {errors.prenom && <Text style={{ color: 'red' }}>{errors.prenom.message}</Text>}
                                </>
                            )}
                            name="prénom"
                        />

                        <Controller
                            control={control}
                            rules={{
                                required: 'Ce champ est requis.',
                                maxLength: { value: 30, message: 'Le prénom est trop long.' },
                            }}
                            render={({ field }) => (
                                <>
                                    <Text style={styles.label}>Adresse*</Text>
                                    <View style={styles.inputwrapper}>
                                        <TextInput
                                            {...field}
                                            placeholder="Adresse"
                                            onBlur={field.onBlur}
                                            onChangeText={(value) => field.onChange(value)}
                                            value={field.value}
                                            style={styles.inputcontent}
                                            dataDetectorTypes={'address'}
                                            autoComplete={'street-address'}
                                        />
                                    </View>
                                    {errors.Adresse && <Text style={{ color: 'red' }}>{errors.Adresse.message}</Text>}
                                </>
                            )}
                            name={'Adresse'}
                        />

                        {/* Code postale* */}
                        <Controller
                            control={control}
                            rules={{
                                required: 'Ce champ est requis.',
                                maxLength: { value: 30, message: 'Le prénom est trop long.' },
                            }}
                            render={({ field }) => (
                                <>
                                    <Text style={styles.label}>Code postale*</Text>
                                    <View style={styles.inputwrapper}>
                                        <TextInput
                                            style={styles.inputcontent}
                                            placeholder="Code postale"
                                            onBlur={field.onBlur}
                                            onChangeText={(value) => field.onChange(value)}
                                            value={field.value}
                                            autoComplete={'postal-code'}
                                        />
                                    </View>
                                    {errors.codePostale && <Text style={{ color: 'red' }}>{errors.codePostale.message}</Text>}
                                </>
                            )}
                            name="codePostale"
                        />

                        <Controller
                            control={control}
                            rules={{
                                required: 'Ce champ est requis.',
                            }}
                            render={({ field }) => (
                                <>
                                    <Text style={styles.label}>Ville*</Text>
                                    <View style={styles.inputwrapper}>
                                        <TextInput
                                            style={styles.inputcontent}
                                            placeholder="Ville"
                                            onBlur={field.onBlur}
                                            onChangeText={(value) => field.onChange(value)}
                                            value={field.value}
                                        />
                                    </View>
                                    {errors.Ville && <Text style={{ color: 'red' }}>{errors.Ville.message}</Text>}
                                </>
                            )}
                            name="Ville"
                        />

                        <Controller
                            control={control}
                            rules={{
                                required: true,
                                pattern: /^[0-9]{10}$/i,
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
                                    {errors.phone && <Text style={{ color: 'red' }}>{errors.phone.message}</Text>}
                                </>
                            )}
                            name="phone"
                        />

                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 30,alignSelf:'center'}}>
                        <TouchableOpacity style={styles.buttom} onPress={()=>navigation.navigate('ButtomTabNavigation', { screen: 'Recompenses' })}>
                            <Text style={styles.textbuttom}>LET’S GOT</Text>
                            <AntDesign name="right" selectable={true} style={styles.iconRight} />
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            </ScrollView>
        </KeyboardAvoidingView>
    );
})

export default InfosPersonnelles;
