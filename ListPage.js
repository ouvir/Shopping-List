import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, ScrollView, TextInput, Text, TouchableOpacity, Pressable, Alert, Vibration, Modal, Dimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from './colors';
import { useState, useRef, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Page from './Page';
import Calendar from './Calendar';

const ITEM_STORAGE_KEY = "@Items";
const PAGE_STORAGE_KEY = "@Pages";

const { width: DEVICE_WIDTH, height: DEVICE_HEIGHT } = Dimensions.get("window");

export const ListPage = () => {
    const [text, setText] = useState(""); // input text
    const [items, setItems] = useState({});
    const [page, setPage] = useState(0); // current user show page index
    const [pages, setPages] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalText, setModalText] = useState("");
    const [display, setDisplay] = useState(0);

    const scrollViewRef = useRef(null);
    const textInputRef = useRef();

    useEffect(() => {
        loadPagesForAsyncStorage();
        loadItemsForAsyncStorage();
    }, []);

    // about text
    const onChangeText = (payload) => setText(payload);

    const isSpecialText = (text) => {
        const specia_pattern = /[^a-zA-Z0-9가-힣ㄱ-ㅎ]/g;
        return specia_pattern.test(text);
    }

    // about item
    const saveItemsForAsyncStorage = async (saveData) => {
        try {
            await AsyncStorage.setItem(ITEM_STORAGE_KEY, JSON.stringify(saveData));
        } catch (e) {
            alert("오류: item 저장 오류");
        }

    }
    const loadItemsForAsyncStorage = async () => {
        try {
            const s = await AsyncStorage.getItem(ITEM_STORAGE_KEY);
            if (s) setItems(JSON.parse(s));
        } catch (e) {
            alert("오류: item 로딩 오류");
        }
    }

    const addItem = async () => {
        if (text === "") return;
        if (!isCorrectItemName(text)) {
            alert("추가할 항목은 14자리를 넘을 수 없고, 특수문자를 사용할 수 없습니다.");
            setText("");
            return
        }
        const newItems = { ...items, [Date.now()]: { page: pages[page].pageID, text: text, check: false } };
        setItems(newItems);
        saveItemsForAsyncStorage(newItems);
        setText("");
    }
    const doubleCheckDeleteItem = (key) => {
        Vibration.vibrate(10);
        Alert.alert("이 항목을 삭제하시겠습니까?", items[key].text, [
            { text: "삭제", onPress: () => deleteItem(key) },
            { text: "취소" }
        ],
            { cancelable: true }
        );
    }
    const deleteItem = (key) => {
        const newItems = { ...items };
        delete newItems[key];
        setItems(newItems);
        saveItemsForAsyncStorage(newItems);
    }
    const onCheckItem = (key) => {
        const newItems = { ...items };
        newItems[key].check = !newItems[key].check;
        setItems(newItems);
        saveItemsForAsyncStorage(newItems);
    }

    // item 이름 14글자 이하
    // item 이름 특수문자 불가능
    const isCorrectItemName = (name) => {
        if (name.length > 14) return false;
        if (isSpecialText(name)) return false;
        return true;
    }



    // about page =>  [{pageID: timestamp, name: name }]
    const savePagesForAsyncStorage = async (saveData) => {
        try {
            await AsyncStorage.setItem(PAGE_STORAGE_KEY, JSON.stringify(saveData));
        } catch (e) {
            alert("오류: page 저장 오류");
        }

    }
    const loadPagesForAsyncStorage = async () => {
        try {
            const s = await AsyncStorage.getItem(PAGE_STORAGE_KEY);
            if (s) setPages(JSON.parse(s));
        } catch (e) {
            alert("오류: page 로딩 오류");
            loadPagesForAsyncStorage();
        }
    }

    const addPage = () => {
        if (!isCorrectPageName(modalText)) {
            alert("리스트의 제목은 10글자를 넘길 수 없고, 특수문자를 사용할 수 없습니다.");
            return
        }

        const timestamp = Date.now();
        const dateObj = new Date(Date.now());
        const date = dateObj.getFullYear() + '.' + (dateObj.getMonth() + 1) + '.' + dateObj.getDate();
        const newPages = [{ pageID: timestamp, name: modalText, date: date }, ...pages];
        setModalText("");
        setModalVisible(false);
        setPages(newPages);
        savePagesForAsyncStorage(newPages);
    }
    const doubleCheckDeletePage = (index) => {
        Alert.alert("이 목록을 삭제하시겠습니까?", pages[index].name, [
            { text: "삭제", onPress: () => deletePage(index) },
            { text: "취소" }
        ],
            { cancelable: true }
        );
    }
    const deletePage = (index) => {
        let newPages = [...pages];
        if (index === 0 && newPages.length === 1) {
            newPages = [];
        } else {
            newPages.splice(index, 1);
        }

        setPages(newPages);
        savePagesForAsyncStorage(newPages);

        // delete page's all item
        const newItems = Object.entries(items)
            .filter(([item]) => item.page != pages[index].pageID)
            .reduce((acc, [key, item]) => ({ ...acc, [key]: item }), {});
        setItems(newItems);
        saveItemsForAsyncStorage(newItems);
    }
    const onChangePage = (event) => {
        const offsetX = event.nativeEvent.contentOffset.x;
        const layoutWidth = event.nativeEvent.layoutMeasurement.width;
        const pageNum = Math.floor(offsetX / layoutWidth);
        setPage(pageNum);
    }
    const changePageName = (index, pageName, textInputRef) => {
        if (!isCorrectPageName(pageName)) {
            alert("리스트의 제목은 10글자를 넘길 수 없고, 특수문자를 사용할 수 없습니다.");
            textInputRef.current.setNativeProps({ text: pages[page].name, })
            return
        }

        const newPages = [...pages];
        newPages[index].name = pageName;
        setPages(newPages);
        savePagesForAsyncStorage(newPages);
    }
    // page 이름 10글자이하
    // page 이름 특수문자 불가능
    const isCorrectPageName = (name) => {
        if (name.length > 10) return false;
        if (isSpecialText(name)) return false;
        return true;
    }


    return (
        display === 0 ?
            <View style={styles.container}>
                <StatusBar style="auto" />

                <Modal
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                        Alert.alert('시간 초과');
                        setModalVisible(false);
                    }}>
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <Text style={styles.modalText}>페이지 이름:</Text>
                            <TextInput ref={textInputRef} style={styles.modalTextInput} onChangeText={(text) => setModalText(text)}>{modalText}</TextInput>
                            <View style={styles.modalButton}>
                                <Pressable
                                    style={[styles.button, styles.buttonAdd]}
                                    onPress={() => addPage()}>
                                    <Text style={styles.buttonText}>추가</Text>
                                </Pressable>
                                <Pressable
                                    style={[styles.button, styles.buttonCancle]}
                                    onPress={() => setModalVisible(false)}>
                                    <Text style={styles.buttonText}>취소</Text>
                                </Pressable>
                            </View>
                        </View>
                    </View>
                </Modal>

                <View style={styles.navBar}>
                    <Pressable onPress={() => setModalVisible(true)}>
                        <MaterialIcons name="post-add" size={30} color={theme.font} />
                    </Pressable>
                    <TouchableOpacity onPress={() => setDisplay(1)}>
                        <MaterialIcons name="calendar-today" size={24} color={theme.font} />
                    </TouchableOpacity>
                </View>

                <View style={styles.shopping_list}>
                    <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false}
                        onScroll={onChangePage} ref={scrollViewRef} >
                        {
                            pages.map((value, index) =>
                                <Page key={index} items={Object.entries(items).filter(([key, item]) => item.page === value.pageID).reduce((acc, [key, item]) => ({ ...acc, [key]: item }), {})}
                                    pageName={value.name} index={index}
                                    doubleCheckDeletePage={() => doubleCheckDeletePage(index)} onCheckItem={onCheckItem}
                                    doubleCheckDeleteItem={doubleCheckDeleteItem} changePageName={changePageName} />
                            )
                        }
                    </ScrollView>
                </View>

                <TextInput style={styles.input} placeholder="+  목록 추가" value={text} onChangeText={onChangeText} onSubmitEditing={addItem} />
            </View>

            :
            <Calendar goBack={() => setDisplay(0)}></Calendar>
            
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
        flex: 1,
        flexDirection: "row",
        width: DEVICE_WIDTH,
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20,
        marginTop: 60,
        marginBottom: 10
    },
    shopping_list: {
        flex: 16,
        alignItems: "center"
    },

    input: {
        flex: 1,
        fontSize: 18,
        fontWeight: "500",
        width: DEVICE_WIDTH * 0.9,
        backgroundColor: theme.subBackground,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderColor: theme.border,
        borderWidth: 1,
        borderRadius: 20,
        marginBottom: 10
    },


    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.4)",
    },
    modalView: {
        width: DEVICE_WIDTH *0.95,
        height: 300,
        backgroundColor: theme.subBackground,
        borderRadius: 5,
        padding: 30,
        shadowColor: '#000',
        shadowOffset: {
            width: 1,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        justifyContent: "space-between"
    },
    modalText: {
        fontSize: 20,
        fontWeight: "500",
    },
    modalTextInput: {
        borderWidth: 2,
        borderRadius: 5,
        borderColor: "grey",
        textAlign: "left",
        fontSize: 24,
        fontWeight: "600",
        paddingVertical: 10,
        paddingHorizontal: 20
    },
    modalButton: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-end",
        justifyContent: "flex-end",
    },

    button: {
        width: 80,
        borderRadius: 5,
        padding: 10,
        marginLeft: 3
    },
    buttonAdd: {
        backgroundColor: theme.font,
    },
    buttonCancle: {
        backgroundColor: theme.subFont,
    },
    buttonText: {
        color: 'white',
        fontSize: 15,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default ListPage;