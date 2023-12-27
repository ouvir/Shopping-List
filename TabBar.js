import { StyleSheet, View, TouchableOpacity } from 'react-native';
import React from 'react';
import { theme } from './colors';
import { MaterialIcons } from '@expo/vector-icons';

const ICON_SIZE = 30;

export const TabBar = (props) => {
    return (
        <View style={styles.tabBar} >
            <TouchableOpacity style={styles.tabBar_button} onPress={() => props.changeTabBarState(0)}>
                <MaterialIcons name="list-alt" size={ICON_SIZE} color={props.select === 0 ? theme.font : theme.subFont} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.tabBar_button} onPress={() => props.changeTabBarState(1)}>
                <MaterialIcons name="library-books" size={ICON_SIZE} color={props.select === 1 ? theme.font : theme.subFont} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.tabBar_button} onPress={() => props.changeTabBarState(2)}>
                <MaterialIcons name="analytics" size={ICON_SIZE} color={props.select === 2 ? theme.font : theme.subFont} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.tabBar_button} onPress={() => props.changeTabBarState(3)}> 
                <MaterialIcons name="account-circle" size={ICON_SIZE} color={props.select === 3 ? theme.font : theme.subFont} />
            </TouchableOpacity>

        </View>
    );
}

const styles = StyleSheet.create({
    tabBar: {
        flex: 2,
        width: "100%",
        backgroundColor: theme.subBackground,
        flexDirection: "row",
        alignItems: "center",
    },
    tabBar_button: {
        height: "100%",
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    }
});


export default TabBar;