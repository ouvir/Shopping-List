import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, ScrollView, TextInput, TouchableOpacity, Alert, Vibration, Keyboard, Dimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from './colors';
import { useState, useRef, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Page from './Page';
import TabBar from './TabBar';

const ITEM_STORAGE_KEY = "@Items";
const PAGE_STORAGE_KEY = "@Pages";
const { width: DEVICE_WIDTH } = Dimensions.get("window");

export default function App() {
  const scrollViewRef = useRef(null);
  const [text, setText] = useState(""); // input text
  const [items, setItems] = useState({});
  const [page, setPage] = useState(0); // current user show page index
  const [pages, setPages] = useState([]);
  const [keyboard,setKeyboard] = useState(false);
  const [tabBar, setTabBar] = useState(0);

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboard(true);
    });
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboard(false);
    });

    loadPagesForAsyncStorage();
    loadItemsForAsyncStorage();
    

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

// about text
  const onChangeText = (payload) => setText(payload);

// about item
  const saveItemsForAsyncStorage = async(saveData) => {
    try {
      await AsyncStorage.setItem(ITEM_STORAGE_KEY, JSON.stringify(saveData));
    } catch(e) {
      alert("오류: item 저장 오류");
    }

  }
  const loadItemsForAsyncStorage = async(saveData) => {
    try {
      const s = await AsyncStorage.getItem(ITEM_STORAGE_KEY);
      if(s) setItems(JSON.parse(s));
    } catch (e) {
      alert("오류: item 로딩 오류");
    }
  }

  const addItem = async () => {
    if (text === "") return;
    const newItems = {...items, [Date.now()]: { page: pages[page].pageID, text: text, check: false }};
    setItems(newItems);
    saveItemsForAsyncStorage(newItems);
    setText("");
  }
  const doubleCheckDeleteItem = (key) => {
    Vibration.vibrate(10);
    Alert.alert("이 항목을 삭제하시겠습니까?",items[key].text,[
      {text:"삭제", onPress: () => deleteItem(key)},
      {text:"취소"}
    ],
    {cancelable: true}
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

// about page
  const savePagesForAsyncStorage = async(saveData) => {
    try {
      await AsyncStorage.setItem(PAGE_STORAGE_KEY, JSON.stringify(saveData));
    } catch(e) {
      alert("오류: page 저장 오류");
    }

  }
  const loadPagesForAsyncStorage = async() => {
    try {
      const s = await AsyncStorage.getItem(PAGE_STORAGE_KEY);
      if(s) setPages(JSON.parse(s));
    } catch (e) {
      alert("오류: page 로딩 오류");
      loadPagesForAsyncStorage();
    }
  }

  const addPage = () => {
    const timestamp = Date.now();
    const date = new Date(timestamp);
    const name = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
    const newPages = [...pages, {pageID: timestamp, name: name }];
    setPages(newPages);
    savePagesForAsyncStorage(newPages);
  }
  const doubleCheckDeletePage = (index) => {
    Alert.alert("이 목록을 삭제하시겠습니까?",pages[index].name,[
      {text:"삭제", onPress: () => deletePage(index)},
      {text:"취소"}
    ],
    {cancelable: true}
    );
  }
  const deletePage = (index) => {
    let newPages = [...pages];
    if(index === 0 && newPages.length === 1){
      newPages = [];
    } else {
      newPages.splice(index, 1);
    }

    setPages(newPages);
    savePagesForAsyncStorage(newPages);
    
    // delete page's all item
    const newItems = Object.entries(items)
      .filter(([key, item]) => item.page != pages[index].pageID)
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


  // about tabBar State
  const changeTabBarState = (index) => {
    setTabBar(index);
  }

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.navBar}>
        <TouchableOpacity onPress={() => addPage()}>
          <MaterialIcons name="post-add" size={30} color={theme.font} />
        </TouchableOpacity>
        <TouchableOpacity>
          <MaterialIcons name="calendar-today" size={24} color={theme.font}/>
        </TouchableOpacity>
      </View>
      <View style={styles.shopping_list}>
        <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false} 
          onScroll={onChangePage} ref={scrollViewRef} >
          {
            pages.map((value, index) =>
              <Page key={index} items={Object.entries(items)
                .filter(([key, item]) => item.page === value.pageID)
                .reduce((acc, [key, item]) => ({ ...acc, [key]: item }), {})} pageName={value.name}
                doubleCheckDeletePage={() => doubleCheckDeletePage(index)} onCheckItem={onCheckItem} 
                doubleCheckDeleteItem={doubleCheckDeleteItem} />
            )
          }
        </ScrollView>
      </View>
      <TextInput style={styles.input} placeholder="+  목록 추가"
        value={text} onChangeText={onChangeText} onSubmitEditing={addItem}
      />
      {keyboard ? null: <TabBar select={tabBar} changeTabBarState={changeTabBarState}></TabBar>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
    alignItems: 'center',
    justifyContent: "space-between",
  },
  navBar: {
    flex:1,
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    alignItems:"center",
    paddingHorizontal: 20,
    marginTop: 60,
    marginBottom: 10
  },
  shopping_list: {
    flex: 16,
    alignItems: "center"
  },

  input: {
    flex:1,
    fontSize: 18,
    fontWeight: "500",
    width: "90%",
    backgroundColor: theme.subBackground,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderColor: theme.border,
    borderWidth: 1,
    borderRadius: 20,
    marginBottom: 10
  }
});
