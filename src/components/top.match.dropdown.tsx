import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, Dimensions, TouchableOpacity, FlatList } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient';
import { COLOR_CODE } from '../utils/enums';

FontAwesome.loadFont();
const { width, height } = Dimensions.get('window');

const data = [
  { label: 'Top 10', key: 1, value: 10 }, { label: 'Top 20', key: 2, value: 20 }, 
  { label: 'Top 50', key: 3, value: 50 }, { label: 'Top 100', key: 4, value: 100 }
];

const TopMatchDropdown = ({ setTopMatchCount }: any) => {
  const defaultLabel = 'Filter';
  const [modalOpen, setIsModalOpen] = useState(false);
  const [dropdownSelected, setDropdownSelected] = useState(undefined);
  
  const onPressOpenModal = () => {
    setIsModalOpen(!modalOpen);
  }

  const onSelectItem = (item: any) => {
    setDropdownSelected(item.label);
    setTopMatchCount(item.value);
    setIsModalOpen(false);
  }

  const renderItem = ({ item }: any) => {
    return (
      <TouchableOpacity style={styles.modalItem} onPress={() => onSelectItem(item)}>
        <Text style={styles.modalText}>{item.label}</Text>
      </TouchableOpacity>
    );
  }

  const renderModal = () => {
    return (
      <Modal transparent visible={modalOpen} animationType='none'>
        <LinearGradient colors={[COLOR_CODE.OFF_WHITE, 'silver']} style={styles.modalContainer}>
          <FlatList
            style={{flex: 1}}
            data={data}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            scrollEnabled={false}
          />
        </LinearGradient>
      </Modal>
    );
  }

  return (
    <View style={styles.mainContainer}>
      <View style={styles.dropdownTextContainer}>
      { 
        dropdownSelected ?
        (<Text style={styles.text}>{dropdownSelected}</Text>) :
        (<Text style={styles.text}>{defaultLabel}</Text>)
      }
      </View>
      <TouchableOpacity style={styles.filterTouchable} onPress={onPressOpenModal}>
        <FontAwesome name='chevron-down' size={height * 0.02}/>
      </TouchableOpacity>
      {renderModal()}
    </View>
  );
}

export default TopMatchDropdown;

const styles = StyleSheet.create({
  mainContainer: {
    width: '80%',
    height: '70%',
    borderRadius: 30,
    flexDirection: 'row',
    backgroundColor: COLOR_CODE.OFF_WHITE,
  },

  modalContainer: {
    position: 'absolute',
    height: width * 0.5,
    width: width * 0.5,
    top: height * 0.3,
    left: width * 0.25,
    borderRadius: 30,
  },
  modalItem: {
    height: width * 0.5 * 0.25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalText: {
    fontSize: width * 0.05,
    fontWeight: '500',
  },

  dropdownTextContainer: {
    flex: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: width * 0.04,
    fontWeight: '500',
  },

  filterTouchable: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
});