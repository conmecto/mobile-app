import { StyleSheet } from 'react-native';
import { COLOR_CODE } from './utils/enums';

const styles = StyleSheet.create({
  nameTextInput: {
    backgroundColor: COLOR_CODE.LIGHT_GREY,
    padding: 10,
    borderRadius: 10,
  },
  countryText: {
    letterSpacing: 0.25,
  },
  countryView: {
    backgroundColor: COLOR_CODE.LIGHT_GREY,
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  cityView: {
    backgroundColor: COLOR_CODE.LIGHT_GREY,
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  cityFlatlList: {
    flexGrow: 0
  },
  cityItem: {
    backgroundColor: COLOR_CODE.LIGHT_GREY,
    padding: 4,
  },
  selectButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 10,
    backgroundColor: COLOR_CODE.LIGHT_GREY
  },
  dateButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 10,
    backgroundColor: COLOR_CODE.LIGHT_GREY
  },
  cityButton: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: COLOR_CODE.LIGHT_GREY
  },
  genderButton: {
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: COLOR_CODE.LIGHT_GREY
  },
  genderButtonText: {
    fontSize: 15,
    letterSpacing: 0.25,
    color: COLOR_CODE.BLACK,
  },
  searchForButton: {
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: COLOR_CODE.LIGHT_GREY
  },
  searchForButtonText: {
    fontSize: 15,
    letterSpacing: 0.25,
    color: COLOR_CODE.BLACK,
  },
  cityButtonText: {
    fontSize: 15,
    letterSpacing: 0.25,
    color: COLOR_CODE.BLACK,
  },
  selectButtonText: {
    fontSize: 15,
    letterSpacing: 0.25,
    color: COLOR_CODE.BLACK,
  },
});

export default styles;