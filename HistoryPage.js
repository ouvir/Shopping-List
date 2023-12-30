import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Dimensions} from 'react-native';

const { width: DEVICE_WIDTH, height: DEVICE_HEIGHT } = Dimensions.get("window");

export const HistoryPage = () => {
    return (
        <View style={styles.container}>
            <StatusBar style="auto" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 9,
        width: DEVICE_WIDTH,
        backgroundColor: "tomato",
        alignItems: 'center',
        justifyContent: "space-between",
    }
});

export default HistoryPage;