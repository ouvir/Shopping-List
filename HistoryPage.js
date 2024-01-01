import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text, Dimensions, TouchableOpacity, ScrollView } from 'react-native';
import React, { useState, useEffect } from 'react';
import SubView from './HistoryPageSubView';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from './colors';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width: DEVICE_WIDTH, height: DEVICE_HEIGHT } = Dimensions.get("window");

const ITEM_STORAGE_KEY = "@Items";
const PAGE_STORAGE_KEY = "@Pages";


const NavBar = (props) => {
    return (
        <View style={styles.navBar}>
            <TouchableOpacity onPress={() => { }}>
                <MaterialIcons name="format-list-bulleted" size={30} color={theme.font} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => props.setDisplay(1)}>
                <MaterialIcons name="calendar-today" size={28} color={theme.font} />
            </TouchableOpacity>
        </View>
    );
}

const MainView = (props) => {
    return (
        <View style={styles.mainView}>
            <NavBar key="navBar" setDisplay={props.setDisplay} />
            <View style={styles.listView}>
                <ScrollView style={styles.scrollView}>
                    {props.pages.map((item) =>
                        <TouchableOpacity key={item.pageID} style={styles.page} activeOpacity={0.6}>
                            <View style={styles.pageInfo}>
                                <Text style={styles.pageTitle}>{item.name}</Text>
                                <Text style={styles.pageDate}>{item.date}</Text>
                            </View>
                            <Text style={styles.price}>₩5000</Text>
                        </TouchableOpacity>
                    )}
                    {props.pages.map((item) =>
                        <TouchableOpacity key={item.pageID} style={styles.page} activeOpacity={0.6}>
                            <View style={styles.pageInfo}>
                                <Text style={styles.pageTitle}>{item.name}</Text>
                                <Text style={styles.pageDate}>{item.date}</Text>
                            </View>
                            <Text style={styles.price}>₩5000</Text>
                        </TouchableOpacity>
                    )}
                    {props.pages.map((item) =>
                        <TouchableOpacity key={item.pageID} style={styles.page} activeOpacity={0.6}>
                            <View style={styles.pageInfo}>
                                <Text style={styles.pageTitle}>{item.name}</Text>
                                <Text style={styles.pageDate}>{item.date}</Text>
                            </View>
                            <Text style={styles.price}>₩5000</Text>
                        </TouchableOpacity>
                    )}
                    {props.pages.map((item) =>
                        <TouchableOpacity key={item.pageID} style={styles.page} activeOpacity={0.6}>
                            <View style={styles.pageInfo}>
                                <Text style={styles.pageTitle}>{item.name}</Text>
                                <Text style={styles.pageDate}>{item.date}</Text>
                            </View>
                            <Text style={styles.price}>₩5000</Text>
                        </TouchableOpacity>
                    )}
                </ScrollView>
            </View>
        </View>
    );
}

export const HistoryPage = (props) => {
    const [display, setDisplay] = useState(0);
    const [pages, setPages] = useState([]);

    useEffect(() => {
        loadPagesForAsyncStorage();
    }, []);

    //props.route.params
    // const savePagesForAsyncStorage = async (saveData) => {
    //     try {
    //         await AsyncStorage.setItem(PAGE_STORAGE_KEY, JSON.stringify(saveData));
    //     } catch (e) {
    //         alert("오류: page 저장 오류");
    //     }

    // }
    const loadPagesForAsyncStorage = async () => {
        try {
            const s = await AsyncStorage.getItem(PAGE_STORAGE_KEY);
            if (s) setPages(JSON.parse(s));
        } catch (e) {
            alert("오류: page 로딩 오류");
        }
    }

    return (
        <View style={styles.container}>
            <StatusBar style="auto" />

            {display === 0 ?
                <MainView pages={pages} key="mainView" setDisplay={setDisplay} />
                :
                <SubView goBack={() => setDisplay(0)} />}
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 9,
        width: DEVICE_WIDTH,
        backgroundColor: theme.background,
        alignItems: 'center',
        justifyContent: "space-between",
    },
    navBar: {
        flexDirection: "row",
        width: DEVICE_WIDTH,
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20,
        marginTop: 60,
        marginBottom: 10,
    },
    mainView: {
        flex: 1,
        width: DEVICE_WIDTH,
        justifyContent: "space-between",
    },
    listView: {
        flex: 1,
        width: DEVICE_WIDTH,
        backgroundColor: theme.subBackground,
        alignItems: "flex-end",
    },
    scrollView: {
        width: DEVICE_WIDTH * 0.9,
        backgroundColor: theme.subBackground,
    },
    page: {
        height: DEVICE_HEIGHT * 0.1,
        backgroundColor: theme.background,
        marginBottom: 5,
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 10,
        borderRadius: 5,
        flexDirection: "row",
    },
    pageInfo: {

    },
    pageTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 2,
    },
    price: {
        fontSize: 23,
        fontWeight: "bold",
        color: "teal"
    }
});

export default HistoryPage;