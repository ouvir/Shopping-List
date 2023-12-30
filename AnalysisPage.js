import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Dimensions} from 'react-native';

const { width: DEVICE_WIDTH, height: DEVICE_HEIGHT } = Dimensions.get("window");

export const AnalysisPage = () => {
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
        backgroundColor: "teal",
        alignItems: 'center',
        justifyContent: "space-between",
    }
});

export default AnalysisPage;