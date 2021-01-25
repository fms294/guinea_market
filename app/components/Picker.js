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
          {selectedItem ? (
            <AppText style={styles.text}>{selectedItem.label}</AppText>
          ) : (
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
                    keyExtractor={(item) => item.value.toString()}
                    numColumns={numberOfColumns}
                    renderItem={({ item }) => (
                      <PickerItemComponent
                        item={item}
                        label={item.label}
                        onPress={() => {
                          setModalVisible(false);
                          onSelectItem(item);
                        }}
                      />
                    )}
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
