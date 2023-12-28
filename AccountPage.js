import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, ScrollView, TextInput, TouchableOpacity, Alert, Vibration } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from './colors';


export const AccountPage = () => {
    return (
        <View style={styles.container}>
            <StatusBar style="auto" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 9,
        width: "100%",
        backgroundColor: "orange",
        alignItems: 'center',
        justifyContent: "space-between",
    }
});

export default AccountPage;