import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, ScrollView, TextInput, Text, TouchableOpacity, Alert, Vibration, Modal, Dimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useState, useRef, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Page from './Page';
import { theme } from './colors';

const ITEM_STORAGE_KEY = "@Items";
const PAGE_STORAGE_KEY = "@Pages";

const { width: DEVICE_WIDTH, height: DEVICE_HEIGHT } = Dimensions.get("window");

const ModalToAddPage = (props) => {
    const [modalText, setModalText] = useState("");
    return (
        <Modal
            transparent={true}
            visible={props.modalVisible}
            onRequestClose={() => {
                Alert.alert('시간 초과');
                props.setModalVisible(false);
            }}>
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Text style={styles.modalText}>새 페이지 추가</Text>
                    <TextInput ref={props.textInputRef} style={styles.modalTextInput}
                        onChangeText={(text) => setModalText(text)} placeholder={"페이지 이름"} placeholderTextColor={theme.font[1]}
                        onSubmitEditing={() => { props.addPage(modalText); setModalText("") }}
                    />
                    <View style={styles.modalButton}>
                        <TouchableOpacity
                            style={[styles.button, styles.buttonAdd]}
                            onPress={() => { props.addPage(modalText); setModalText("") }}>
                            <Text style={styles.buttonText}>추가</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.button, styles.buttonCancle]}
                            onPress={() => { props.setModalVisible(false); setModalText("") }}>
                            <Text style={styles.buttonText}>취소</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}
const NavBar = (props) => {
    return (
        <View style={styles.navBar}>
            <TouchableOpacity onPress={() => props.setModalVisible(true)}>
                <MaterialIcons name="post-add" size={30} color={theme.font[0]} />
            </TouchableOpacity>
            {
                props.pageSize === 0 ? null :
                    <TouchableOpacity onPress={() => props.doubleCheckDeletePage()}>
                        <MaterialIcons name="delete" size={30} color={theme.font[0]} />
                    </TouchableOpacity>
            }

        </View>
    );
}
const MainView = (props) => {
    return (
        <View style={styles.shoppingList}>
            <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false}
                onScroll={props.onChangePage} ref={props.scrollViewRef} >
                {
                    props.pages.map((value, index) =>
                        <Page key={index} items={Object.entries(props.items).filter(([key, item]) => item.page === value.pageID).reduce((acc, [key, item]) => ({ ...acc, [key]: item }), {})}
                            pageName={value.name} index={index} onCheckItem={props.onCheckItem}
                            doubleCheckDeleteItem={props.doubleCheckDeleteItem} changePageName={props.changePageName}
                            navigation={props.navigation} />
                    )
                }
            </ScrollView>
        </View>
    );
}


export const ListPage = (props) => {
    const [text, setText] = useState(""); // input text
    const [items, setItems] = useState({});
    const [page, setPage] = useState(0); // current user show page index
    const [pages, setPages] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);

    const scrollViewRef = useRef(null);
    const textInputRef = useRef();


    useEffect(() => {
        loadPagesForAsyncStorage();
        loadItemsForAsyncStorage();
    }, []);

    // about text
    const onChangeText = (payload) => setText(payload);
    const isSpecialText = (text) => {
        const specia_pattern = /[^a-zA-Z0-9가-힣ㄱ-ㅎ ]/g;
        return specia_pattern.test(text);
    }

    // about item => {[Date.now()]: { page: pages[page].pageID, text: text, check: false } };
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
    const isCorrectItemName = (name) => {    // item 이름 14글자 이하, item 이름 특수문자 불가능
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

    const addPage = (pageName) => {
        if (!isCorrectPageName(pageName)) {
            alert("리스트의 제목은 10글자를 넘길 수 없고, 특수문자를 사용할 수 없습니다.");
            return
        }

        let name = pageName;
        const timestamp = Date.now();
        const dateObj = new Date(Date.now());
        const date = dateObj.getFullYear() + '.' + (dateObj.getMonth() + 1) + '.' + dateObj.getDate();

        // name is not blank, change default value = date
        if (name === "") {
            name = "새 페이지";
        }

        const newPages = [{ pageID: timestamp, name: name, date: date }, ...pages];
        setModalVisible(false);
        setPages(newPages);
        savePagesForAsyncStorage(newPages);
    }
    const doubleCheckDeletePage = () => {
        if (pages.length === 0) return

        const index = page;
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
    const isCorrectPageName = (name) => {     // page 이름 10글자이하, page 이름 특수문자 불가능
        if (name.length > 10) return false;
        if (isSpecialText(name)) return false;
        return true;
    }


    return (
        <View style={styles.container}>
            <StatusBar style="auto" />

            <ModalToAddPage theme={theme} textInputRef={textInputRef} setModalVisible={setModalVisible} addPage={addPage} modalVisible={modalVisible} />

            <NavBar setModalVisible={setModalVisible} doubleCheckDeletePage={doubleCheckDeletePage} pageSize={pages.length} />

            {pages.length === 0 ?
                <TouchableOpacity style={styles.blankPage} onPress={() => setModalVisible(true)}>
                    <MaterialIcons name="post-add" size={200} color={theme.font[1]} />
                    <Text style={styles.blankPageText}>목록을 추가해주세요</Text>
                </TouchableOpacity>
                :
                [
                    <MainView key="main" navigation={props.navigation} onChangePage={onChangePage} scrollViewRef={scrollViewRef} pages={pages} items={items}
                        doubleCheckDeleteItem={doubleCheckDeleteItem} onCheckItem={onCheckItem}
                        changePageName={changePageName} setModalVisible={setModalVisible} />
                    ,
                    <TextInput key="input" style={styles.input} placeholder="+  목록 추가" placeholderTextColor={theme.font[1]}
                        value={text} onChangeText={onChangeText} onSubmitEditing={addItem} />
                ]
            }
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 9,
        width: DEVICE_WIDTH,
        backgroundColor: theme.background[0],
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
        marginBottom: 10
    },
    shoppingList: {
        flex: 16,
        alignItems: "center"
    },

    blankPage: {
        flex: 1,
        width: DEVICE_WIDTH,
        alignItems: "center",
        justifyContent: "center",
        paddingBottom: DEVICE_HEIGHT * 0.1,
    },
    blankPageText: {
        fontSize: 24,
        fontWeight: "500",
        color: theme.font[1],
    },

    input: {
        fontSize: 18,
        fontWeight: "600",
        width: DEVICE_WIDTH * 0.9,
        backgroundColor: theme.background[1],
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderColor: theme.border,
        borderWidth: 1,
        borderRadius: 5,
        marginVertical: 15,
    },

    // WindowToAddPage
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.5)",
        paddingBottom: DEVICE_HEIGHT * 0.1,
    },
    modalView: {
        width: DEVICE_WIDTH * 0.95,
        height: 300,
        backgroundColor: theme.background[1],
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
        fontSize: 24,
        fontWeight: "500",
        color: theme.font[0]
    },
    modalTextInput: {
        borderWidth: 3,
        borderRadius: 3,
        borderColor: theme.border,
        textAlign: "left",
        fontSize: 20,
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
        marginLeft: 3,
        // borderWidth: 1,
        // borderColor: theme.border
    },
    buttonAdd: {
        backgroundColor: theme.point,
    },
    buttonCancle: {
        backgroundColor: theme.border,
    },
    buttonText: {
        color: theme.font[2],
        fontSize: 15,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default ListPage;