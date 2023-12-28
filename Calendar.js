import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from './colors';

export function Calendar(props) {
    return (
        <View style={styles.container}>
            <StatusBar style="auto" />
            <View style={styles.header}>
                <TouchableOpacity style={styles.button} onPress={props.goBack}>
                    <MaterialIcons name="view-list" size={24} color={theme.font} />
                </TouchableOpacity>

                <Text style={styles.title}>December 2023</Text>

            </View>
            <View style={styles.main}>
                <Text style={styles.day}>Sun</Text>
                <Text style={styles.day}>Mon</Text>
                <Text style={styles.day}>Tue</Text>
                <Text style={styles.day}>Wed</Text>
                <Text style={styles.day}>Thu</Text>
                <Text style={styles.day}>Fri</Text>
                <Text style={styles.day}>Sat</Text>
            </View>
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingTop: 60,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: theme.background,
        padding:20,
        paddingBottom: 30,
    },
    button: {
        width: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    icon: {
        height: 20,
        width: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    main: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        padding: 16,
        backgroundColor: theme.subBackground,
    },
    day: {
        textAlign: 'center',
        fontWeight: 'bold',
    },
});

export default Calendar;