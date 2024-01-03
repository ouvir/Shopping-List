import { StyleSheet, Text, ScrollView, View, TouchableOpacity, Dimensions, TextInput, Vibration, Alert, Keyboard } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from './colors';
import React from 'react';
import { useState, useRef, useEffect } from 'react';

const { width: DEVICE_WIDTH, height: DEVICE_HEIGHT } = Dimensions.get("window");

const Item = (props) => {
    return (
        <TouchableOpacity style={styles.item} activeOpacity={0.8}
            onPress={() => props.onCheckItem(props.value)} onLongPress={() => props.doubleCheckDeleteItem(props.value)}>
            <MaterialIcons style={styles.item_icon} name={props.check ? "check-box" : "check-box-outline-blank"}
                size={30} color={props.check ? theme.font[1] : theme.font[0]} />
            <Text style={props.check ? styles.item_text_dashed : styles.item_text}>{props.text}</Text>
        </TouchableOpacity>
    );
};

//get index, items, pageName
export const Page = (props) => {
    const [edit, setEdit] = useState(false);
    const [keyboardStatus, setKeyboardStatus] = useState(false);
    const textInputRef = useRef();
    const items = props.items;


    // when chage pageName, catch the focus for async
    useEffect(() => {
        if (edit && textInputRef.current) {
            textInputRef.current.focus();
        }

        const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
            setKeyboardStatus(true);
        });
        const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
            setKeyboardStatus(false);
        });

        return () => {
            showSubscription.remove();
            hideSubscription.remove();
        };
    }, [edit]);

    const pressPageName = () => {
        Vibration.vibrate(10);
        setEdit(true);
    }

    const changePageName = (e) => {
        const text = e.nativeEvent.text;
        if (text === "") {
            Alert.alert("오류", "페이지 이름을 입력해주세요", [{ text: "확인" }], { cancelable: true });
            textInputRef.current.setNativeProps({ text: props.pageName, });
            setEdit(false);
            return;
        }
        if (props.pageName != text) {
            props.changePageName(props.index, text, textInputRef);
        }
        setEdit(false);
    }

    return (
        <View style={styles.page}>
            <View style={styles.cart}>
                <View style={styles.cart_title}>
                    <TouchableOpacity onLongPress={pressPageName}>
                        <TextInput ref={textInputRef} style={styles.cart_title_text} defaultValue={props.pageName}
                            editable={edit} onEndEditing={changePageName} ></TextInput>
                    </TouchableOpacity>
                </View>
                <ScrollView style={styles.cart_list}>
                    {Object.keys(items).filter((key) => !items[key].check).map((key) =>
                        <Item key={key} value={key} text={items[key].text} check={items[key].check}
                            onCheckItem={props.onCheckItem} doubleCheckDeleteItem={props.doubleCheckDeleteItem} />)}
                    <View style={styles.divideLine}></View>
                    {Object.keys(items).filter((key) => items[key].check).map((key) =>
                        <Item key={key} value={key} text={items[key].text} check={items[key].check}
                            onCheckItem={props.onCheckItem} doubleCheckDeleteItem={props.doubleCheckDeleteItem} />)}

                </ScrollView>
                {
                    !keyboardStatus && Object.keys(items).length != 0 && Object.keys(items).filter((key) => !items[key].check).length === 0 ?
                        <TouchableOpacity style={styles.settleUpButton} onPress={() => props.navigation.navigate("History", items)}>
                            <Text style={styles.settleUpButtonText}> 정산하기 </Text>
                        </TouchableOpacity>

                        : null
                }
            </View>
        </View>
    )
}



const styles = StyleSheet.create({
    page: {
        width: DEVICE_WIDTH,
        alignItems: 'center',
        marginTop: 15,
    },

    cart: {
        flex: 1,
        width: DEVICE_WIDTH * 0.9,
        height: DEVICE_HEIGHT * 0.7,
        alignItems: 'center',
        borderRadius: 5,

        borderColor: theme.border,
        borderWidth: 1,
        backgroundColor: theme.background[1]
    },

    cart_title: {
        width: DEVICE_WIDTH * 0.9,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingVertical: 20,
        borderBottomWidth: 1,
        borderColor: theme.border,

    },
    cart_title_text: {
        color: theme.font[0],
        fontSize: 30,
        fontWeight: "600",
    },

    cart_list: {
        width: DEVICE_WIDTH * 0.85,
        paddingHorizontal: 10,
        marginVertical: 10
    },

    item: {
        flexDirection: "row",
        paddingVertical: 10,
        alignItems: "center",
        backgroundColor: theme.background[2],
        borderColor: theme.border,
        borderRadius: 8,
        paddingHorizontal: 10,
        marginBottom: 5,
    },
    item_icon: {
        marginRight: 15,
    },

    item_text: {
        color: theme.font[0],
        fontSize: 20,
        fontWeight: "500",
    },

    item_text_dashed: {
        color: theme.font[1],
        fontSize: 20,
        fontWeight: "500",
        textDecorationLine: 'line-through',
    },

    divideLine: {
        borderWidth: 0.5,
        borderColor: theme.border,
        marginVertical: 5,
        marginBottom: 10,
        backgroundColor: theme.border
    }
    ,
    settleUpButton: {
        width: "100%",
        backgroundColor: theme.point,
        borderColor: theme.border,
        borderBottomEndRadius: 6,
        borderBottomStartRadius: 6,
        borderTopWidth: 1,
        paddingVertical: 10,
    },
    settleUpButtonText: {
        fontSize: 24,
        fontWeight:"bold",
        color: theme.font[2],
        paddingHorizontal: 10,
        paddingVertical: 5,
        textAlign: 'center',
    }
});


export default Page;