import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Modal } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from './colors';
import {Calendar, LocaleConfig} from 'react-native-calendars';

const { width: DEVICE_WIDTH, height: DEVICE_HEIGHT } = Dimensions.get("window");

LocaleConfig.locales['kr'] = {
    monthNames: [
        '1월',
        '2월',
        '3월',
        '4월',
        '5월',
        '6월',
        '7월',
        '8월',
        '9월',
        '10월',
        '11월',
        '12월'
    ],
    monthNamesShort: ['01.', '02.', '03.', '04.', '05.', '06.', '07.', '08.', '09.', '10.', '11.', '12.'],
    dayNames: ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'],
    dayNamesShort: ['일', '월', '화', '수', '목', '금', '토'],
    today: "오늘"
};
LocaleConfig.defaultLocale = 'kr';

const NavBar = (props) => {
    return (
        <View style={styles.navBar}>
            <TouchableOpacity style={styles.button} onPress={props.goBack}>
                <MaterialIcons name="view-list" size={32} color={theme.font[0]} />
            </TouchableOpacity>

            <Text style={styles.title}> Calendar </Text>
        </View>
    );
}

const ModalCalendar = (props) => {
    const [selected, setSelected] = useState('');
    
    return (
        <Modal
            transparent={true}
            visible={props.modalVisible}
            onRequestClose={() => {
                Alert.alert('시간 초과');
                props.setModalVisible(false);
            }}>
            <Calendar
                style={{
                    borderWidth: 1,
                    borderColor: theme.border,
                    borderRadius: 5,
                    width: DEVICE_WIDTH * 0.7,
                }}

                onDayPress={(day) => {
                    setSelected(day.dateString);
                    props.setModalVisible(false);
                }}

                initialDate='2024-01-02'
            />
           
        </Modal>

    );
}

const BottomSheet = () => {
    return (
        <View style={styles.bottomSheet}>
            <View></View>
        </View>
    );
}


export function SubView(props) {
    const [modalVisible, setModalVisible] = useState(false);

    return (
        <View style={styles.container}>
            <NavBar goBack={props.goBack} />
            <TouchableOpacity
                onPress={() => setModalVisible(true)}>
                <Text style={styles.buttonText}>띄우기</Text>
            </TouchableOpacity>
            <ModalCalendar modalVisible={modalVisible} setModalVisible={setModalVisible} />
            <BottomSheet />
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.background[0],
        alignItems: "center",
        justifyContent: "space-between"
    },
    navBar: {
        flexDirection: "row",
        width: DEVICE_WIDTH,
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20,
        marginTop: 60,
        marginBottom: 10
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    calendar: {
        borderWidth: 1,
        borderColor: 'gray',
        height: 100
    },

    bottomSheet: {
        width: DEVICE_WIDTH,
        height: DEVICE_HEIGHT * 0.5,
        backgroundColor: theme.background[1],
        borderRadius: 5,
        borderColor: theme.border,
        borderTopWidth: 2,
        elevation: 2
    }
});

export default SubView;