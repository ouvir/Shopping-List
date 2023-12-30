import { StyleSheet, Text, ScrollView, View, TouchableOpacity, Dimensions, TextInput, Vibration, Alert } from 'react-native';
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
                size={24} color={props.check ? theme.subFont : theme.font} />
            <Text style={props.check ? styles.item_text_dashed : styles.item_text}>{props.text}</Text>
        </TouchableOpacity>
    );
};

//get index, items, pageName
export const Page = (props) => {
    const [edit, setEdit] = useState(false);
    const textInputRef = useRef();
    const items = props.items;


    // when chage pageName, catch the focus for async
    useEffect(() => {
        if (edit && textInputRef.current) {
            textInputRef.current.focus();
        }
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
                    <TouchableOpacity onPress={props.doubleCheckDeletePage}>
                        <MaterialIcons name="remove-circle-outline" size={30} color={theme.subFont} />
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
        width: DEVICE_WIDTH * 0.9,
        height: DEVICE_HEIGHT * 0.95,
        alignItems: 'center',
        borderRadius: 10,
        borderColor: theme.border,
        borderWidth: 1,
        backgroundColor: theme.subBackground
    },

    cart_title: {
        width: DEVICE_WIDTH * 0.8,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingVertical: 20,
        borderBottomWidth: 1,
        borderColor: theme.border,

    },
    cart_title_text: {
        color: theme.font,
        fontSize: 30,
        fontWeight: "600",
    },

    cart_list: {
        width: DEVICE_WIDTH * 0.9,
        paddingHorizontal: 10,
        paddingVertical: 10
    },

    item: {
        flexDirection: "row",
        paddingVertical: 10,
        alignItems: "center",
        backgroundColor: theme.background,
        borderRadius: 8,
        paddingHorizontal: 10,
        marginBottom: 5,
    },
    item_icon: {
        marginRight: 15,
    },

    item_text: {
        color: theme.font,
        fontSize: 20,
        fontWeight: "500",
    },

    item_text_dashed: {
        color: theme.subFont,
        fontSize: 20,
        fontWeight: "500",
        textDecorationLine: 'line-through',
    },

    divideLine: {
        borderWidth: 1,
        borderColor: theme.border,
        marginVertical: 5,
        marginBottom: 10,
    }
});


export default Page;