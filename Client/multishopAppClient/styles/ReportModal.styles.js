import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    marginTop: '6%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopRightRadius: 30,           
    borderTopLeftRadius: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 5,
      height: 5,
    },
    shadowOpacity: 2,
    shadowRadius: 2,
    elevation: 2,
    backgroundColor: 'rgba(0, 0, 0, 0.10)',
  },
  gradientBackground: {
    width: '100%',
    height: '100%',
  },
  mainTitleContainer: {
    width: '90%',
    // height: '4%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainSubtitleContainer: {
    width: '90%',
    height: '3%',
  },
  mainTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center'
  },
  mainSubtitle: {
    fontSize: 16,
    color: '#000'
  },
  buttonsAction: {
    marginTop: "5%",
    flexDirection: "row",
    gap: 30,
    marginBottom: '5%'
  },
  buttonsDateAction: {
    display: "flex",
    marginTop: "5%",
    flexDirection: "row",
    gap: 30,
    marginBottom: '5%'
  },
  dateSelectorsContainer:{
    display: 'flex',
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 20,
  },
  buttonDate: {
    width: 120,
    backgroundColor: '#fff',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 6,
    shadowColor: "#000",
    shadowOffset: {
      width: 5,
      height: 5,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginTop: 20,
    marginBottom: 20,
  },
  searchContainer:{
    display: 'flex',
    flexDirection: 'row',
    gap: 20,
    paddingHorizontal: 20,
  },
  buttonSearch: {
    width: 40,
    backgroundColor: '#fff',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 6,
    shadowColor: "#000",
    shadowOffset: {
      width: 5,
      height: 5,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginTop: 20,
    marginBottom: 20,
  },
  buttonExit: {
    width: 120,
    height: 40,
    backgroundColor: "#E72929",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  buttonTextDate: {
    color: "#6b6b6b",
    textAlign: "center",
    lineHeight: 25,
  },
  buttonTextSearch:{
    color: "#6b6b6b",
    textAlign: "center",
    lineHeight: 25,
    marginRight: 5,
  },
  buttonText: {
    color: "#FFF",
    textAlign: "center",
    lineHeight: 25
  },
  // LISTA DE PRODUCTOS
  productContainer:{
    height: "56%",
    width: "90%",
    // margin: 50,
    backgroundColor: 'rgba(255, 255, 255, 1)',
    borderRadius: 20,
  },
  headerProductContainer:{
    width: "100%",
    backgroundColor: '#38B0DB',
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    color: '#fff',
  },
  titleListContainer:{
    display: "flex",
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    paddingVertical: 15,
  },
  titleListClient: {
    color: 'white',
    width: '30%',
    textAlign: 'center',
  },
  titleListPrice: {
    color: 'white',
    width: '30%',
    textAlign: 'center',

  },
  titleListActions: {
    color: 'white',
    width: '20%',
    textAlign: 'center',
  },
  productItem: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingVertical: 10,
    margin: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  nameProd: {
    width: '35%',
    textAlign: 'center',
    justifyContent: 'center',
    // backgroundColor: 'gray',
  },
  nameProducts: {
    textAlign: 'center',
    justifyContent: 'center',
    // backgroundColor: 'gray',
  },
  priceContainer: {
    width: '33.3%',
    alignItems: 'center',
    // backgroundColor: 'gray',
  },
  quantityInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 5,
    paddingVertical: 3,
    textAlign: 'center',
  },
  buttonAction: {
    width: '25%',
    alignItems: 'center',
    // backgroundColor: 'gray'
  },
  buttonMore: {
    // padding: 5,
    // marginRight: 15,
  },
  // centerButtonPlaceholder: {
  //   width: 30, // mismo ancho que el icono delete para mantener el espacio consistente
  //   height: 30,
  // },
  pagination: {
    // height: '8%',
    width: '100%',
    flexDirection: 'row',
    paddingHorizontal: '24%', 
    paddingVertical: 10
  },
  pageButton: {
    // height: '22%',
    height: 40,
    padding: 10,
    margin: 5,
    backgroundColor: '#fff',
    borderRadius: 100,
  },
  pageButtonActive: {
    backgroundColor: '#38B0DB',
  },
  pageButtonText: {
    color: '#38B0DB',
    textAlign: 'center',
  },
  pageButtonTextActive:{
    color: '#fff',
  },
});

export default styles;
