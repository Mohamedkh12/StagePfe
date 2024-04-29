import React, {forwardRef, useEffect, useState} from "react";
import { KeyboardAvoidingView, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import CustomHeader from "./CustomHeader";
import { AntDesign } from "@expo/vector-icons";
import { Controller, useForm } from 'react-hook-form';
import RNDateTimePicker from "@react-native-community/datetimepicker";
import styles from "./Paiement.styles";
import {useRoute} from "@react-navigation/native";
import ProgressStepsScreen from "./ProgressStepsScreen";

const Paiement = forwardRef((props, ref) => {
    const { control, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            ntc: '',
            nc: '',
            date: new Date(),
            cvc: '',
        }
    });


    const { navigation } = props;
    const [date, setDate] = useState(new Date());


    const onSubmit = (newData) => {
        console.log("Données du formulaire:", newData);
        navigation.navigate('MesEnfants' );
    };

    const onChange = (event, selectedDate) => {
        console.log("Event:", event);
        console.log("Selected Date:", selectedDate);

        const currentDate = selectedDate || date;

        // on cancel set date value to previous date
        if (event?.type === 'dismissed') {
            setDate(date);
            return;
        }
        setDate(currentDate);
    };
    const steps = ['Abonnement', 'Compte parent', 'Paiement', 'Mes enfants', 'Mes infos personnelles'];
    const currentStep =2;
    return (
        <KeyboardAvoidingView behavior="padding" enabled>
            <ScrollView style={styles.container}>
                <View>
                    <CustomHeader />
                    <ProgressStepsScreen steps={steps} currentStep={currentStep} />
                </View>
                <SafeAreaView>
                    <View style={{ marginTop: 15 }}>
                        <Text style={styles.h1}>Paiement</Text>
                        <Text style={styles.text}>Veuillez saisir vos informations de paiement.</Text>
                    </View>
                    <View style={styles.content}>
                        <Text style={styles.h3}>Facturation</Text>
                        <Controller
                            control={control}
                            rules={{
                                required: 'Ce champ est requis.',
                            }}
                            render={({ field }) => (
                                <>
                                    <Text style={styles.label}>Nom du titulaire de la carte*</Text>
                                    <View style={styles.inputwrapper}>
                                        <TextInput
                                            {...field}
                                            placeholder="Nom du titulaire de la carte"
                                            onChangeText={(value)=>field.onChange(value)}
                                            value={field.value}
                                            onBlur={field.onBlur}
                                            style={styles.inputcontent}
                                        />
                                    </View>
                                    {errors.ntc && <Text style={{ color: 'red' }}>{errors.ntc.message}</Text>}
                                </>
                            )}
                            name={'ntc'}
                        />

                        {/* Numero de carte */}
                        <Controller
                            control={control}
                            rules={{
                                required: 'Ce champ est requis.',
                            }}
                            render={({ field }) => (
                                <>
                                    <Text style={styles.label}>Numéro de carte*</Text>
                                    <View style={styles.inputwrapper}>
                                        <TextInput
                                            {...field}
                                            placeholder="Numéro de carte"
                                            onChangeText={(value)=>field.onChange(value)}
                                            value={field.value}
                                            onBlur={field.onBlur}
                                            style={styles.inputcontent}
                                            keyboardType="numeric"
                                            inputMode="tel"
                                            autoCompleteType="cc-number"

                                        />
                                    </View>
                                    {errors.nc && <Text style={{ color: 'red' }}>{errors.nc.message}</Text>}
                                </>
                            )}
                            name="nc"
                        />

                        {/* Date de validite */}
                        <Controller
                            control={control}
                            rules={{
                                required: 'Ce champ est requis.',
                            }}
                            render={({ field }) => (
                                <>
                                    <Text style={styles.label}>Date d’expiration*</Text>
                                    <View style={{ alignSelf: 'flex-start' }}>
                                        <RNDateTimePicker
                                            value={date}
                                            mode="date"
                                            display={"default"}
                                            onChange={(event, selectedDate) => {
                                                const currentDate = selectedDate || date;
                                                setDate(currentDate);
                                                field.onChange(currentDate);
                                            }}
                                            style={styles.datePicker}
                                            onBlur={field.onBlur}
                                        />
                                    </View>
                                    {errors.date && <Text style={{ color: 'red' }}>{errors.date.message}</Text>}
                                </>
                            )}
                            name={'date'}
                        />

                        {/* CVC* */}
                        <Controller
                            control={control}
                            rules={{
                                required: 'Ce champ est requis.',
                                pattern: {
                                    value: /^[0-9]{3}$/i,
                                    message: 'CVC invalide. Veuillez entrer un CVC à 3 chiffres.',
                                },
                            }}
                            render={({ field }) => (
                                <>
                                    <Text style={styles.label}>CVC*</Text>
                                    <View style={styles.inputwrapper}>
                                        <TextInput
                                            {...field}
                                            style={styles.inputcontent}
                                            placeholder="CVC"
                                            keyboardType="numeric"
                                            inputMode="numeric"
                                            autoCompleteType="cc-csc"
                                            onChangeText={(value)=>field.onChange(value)}
                                            value={field.value}
                                            onBlur={field.onBlur}
                                        />
                                    </View>
                                    {errors.cvc && <Text style={{ color: 'red' }}>{errors.cvc.message}</Text>}
                                </>
                            )}
                            name={'cvc'}
                        />
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 30, }}>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <AntDesign name="left" selectable={true} style={styles.icon} />
                            <Text style={styles.lienRetour}>Retour</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.buttom} onPress={handleSubmit(onSubmit)}>
                            <Text style={styles.textbuttom}>SUIVANT</Text>
                            <AntDesign name="right" selectable={true} style={styles.iconRight} />
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            </ScrollView>
        </KeyboardAvoidingView>
    );
});

export default Paiement;
