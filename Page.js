import { StyleSheet, Text, ScrollView, View, TouchableOpacity, Dimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from './colors';
import React from 'react';

const { width: DEVICE_WIDTH } = Dimensions.get("window");

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
    const items = props.items;
    return (
        <View key={props.index} style={styles.page}>
            <View style={styles.cart}>
                <View style={styles.cart_title}>
                    <Text style={styles.cart_title_text}>{props.pageName}</Text>
                    <TouchableOpacity onPress={props.doubleCheckDeletePage}>
                        <MaterialIcons name="remove-circle-outline" size={30} color={theme.subFont} />
                    </TouchableOpacity>
                </View>
                <ScrollView style={styles.cart_list}>
                    { Object.keys(items).filter((key) => !items[key].check).map((key) =>
                        <Item key={key} value={key} text={items[key].text} check={items[key].check}
                            onCheckItem={props.onCheckItem} doubleCheckDeleteItem={props.doubleCheckDeleteItem} />) }
                    <View style={styles.divideLine}></View>
                    { Object.keys(items).filter((key) => items[key].check).map((key) =>
                        <Item key={key} value={key} text={items[key].text} check={items[key].check}
                            onCheckItem={props.onCheckItem} doubleCheckDeleteItem={props.doubleCheckDeleteItem} />) }

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
        width: "90%",
        height: "95%",
        alignItems: 'center',
        borderRadius: 10,
        borderColor: theme.border,
        borderWidth: 1,
        backgroundColor: theme.subBackground
    },

    cart_title: {
        width: "100%",
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
        width: "100%",
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