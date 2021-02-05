import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Modal,
  FlatList, Text, TouchableOpacity,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import AppText from "./Text";
import Screen from "./Screen";
import defaultStyles from "../config/styles";
import PickerItem from "./PickerItem";
import colors from "../config/colors";

const AppPicker = (props) => {
  const { icon, items, numberOfColumns, onSelectItem, PickerItemComponent=PickerItem, placeholder, selectedItem } = props;
  const [modalVisible, setModalVisible] = useState(false);
  const [value, setValue] = useState('');
  //console.log("app picker", items);
  return (
    <>
      <TouchableWithoutFeedback onPress={() => setModalVisible(true)}>
        <View style={styles.container}>
          {icon && (
            <MaterialCommunityIcons
              name={icon}
              size={20}
              color={defaultStyles.colors.medium}
              style={styles.icon}
            />
          )}
          {selectedItem ?
              (<AppText style={styles.text}>{selectedItem}</AppText>) : (
            <AppText style={styles.placeholder}>{placeholder}</AppText>
          )}
          <MaterialCommunityIcons
            name="chevron-down"
            size={20}
            color={defaultStyles.colors.medium}
          />
        </View>
      </TouchableWithoutFeedback>
      <Modal
          animationType="slide"
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
      >
          <View style={styles.centeredView}>
              <View style={styles.modalView}>
                  <FlatList
                    data={items}
                    keyExtractor={(item) => item.category.toString()}
                    //numColumns={numberOfColumns}
                    renderItem={(itemData) => {
                        // let data;
                        // if(itemData.item.sub_category === undefined)
                        // {
                        //     data = itemData.item.category;
                        //     console.log("itemData in if", itemData.item.category)
                        // }else{
                        //     itemData.item.sub_category.map((item) => console.log("item in map", item));
                        //     console.log("itemData", itemData.item.sub_category);
                        // }

                        // item={itemData.item.category}
                        //                                 onPress={() => {
                        //                                     onSelectItem(itemData.item.category)
                        //                                     setModalVisible(false);
                        //                                 }}
                        return(
                            <PickerItemComponent
                                item={
                                    itemData.item.sub_category === undefined ? itemData.item.category
                                        :
                                        itemData.item.sub_category.map((item) => item)
                                }
                                onPress={() => {
                                    setModalVisible(false);
                                    onSelectItem(itemData.item.sub_category === undefined ? itemData.item.category
                                        :
                                        itemData.item.sub_category.map((item) => item));
                                }}
                            />
                        );
                    }}
                  />
                  <TouchableOpacity
                      style={styles.openButton}
                      onPress={() => {
                          setModalVisible(!modalVisible);
                      }}
                  >
                      <Text style={styles.textStyle}>Close</Text>
                  </TouchableOpacity>
           </View>
       </View>
        {/*</Screen>*/}
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: defaultStyles.colors.light,
    borderRadius: 25,
    flexDirection: "row",
    //width: "100%",
    padding: 15,
    marginVertical: 10,
  },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        //alignItems: "center",
        marginTop: 15
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        height: 500
    },
  icon: {
    marginRight: 10,
  },
  placeholder: {
    color: defaultStyles.colors.medium,
    flex: 1,
  },
  text: {
    flex: 1,
  },
  openButton: {
    margin: 20
  },
  textStyle: {
    color: colors.primary,
    textAlign: "center",
    fontSize: 20
  },
});

export default AppPicker;
