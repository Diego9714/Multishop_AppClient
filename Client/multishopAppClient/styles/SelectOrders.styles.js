import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  mainContainer: {
    width: "100%",
    height: "100%",
    backgroundColor: 'rgba(0, 0, 0, 0.10)',
    alignItems: "center"
  },
  gradientBackground: {
    width: '100%',
    height: '100%',
  },
  titlePage: {
    // height: '6%',
    alignItems: "center",
    marginBottom: 20
  },
  title: {
    marginTop: 20,
    fontSize: 20,
    fontWeight: "400",
    color: '#FFF',
  },
  listOrderContainer: {
    height: "56%",
    width: "95%",
    backgroundColor: 'rgba(255, 255, 255, 1)',
    borderRadius: 20,
  },
  headerProductContainer: {
    width: "100%",
    backgroundColor: "#38B0DB",
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    color: '#fff',
  },
  titleListContainer: {
    display: "flex",
    width: "100%",
    flexDirection: "row",
    // justifyContent: "space-evenly",
    justifyContent: "center",
    // gap: 20,
    paddingVertical: 15,
  },
  titleListClient: {
    color: 'white',
    width: '50%',
    // backgroundColor: 'gray',
    textAlign: 'center'
  },
  titleListPrice: {
    color: '#fff',
    width: '25%',
    textAlign: 'center',
    // backgroundColor: 'black',
  },
  titleListActions: {
    color: '#fff',
    width: '25%',
    textAlign: 'center',
    // backgroundColor: 'blue',
  },
  listContainer: {
    marginHorizontal: 10,
    height: '100%',
  },
  orderItem: {
    display: "flex",
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  nameProd: {
    color: 'white',
    width: '50%',
    textAlign: 'center',
    justifyContent: "center"
  },
  priceContainer: {
    color: 'white',
    width: '30%',
    alignItems: 'center',
    justifyContent: "center"
  },
  buttonAction: {
    width: '20%',
    justifyContent: 'center',
    flexDirection: 'row',
    // justifyContent: 'space-between',
  },
  button: {
    // marginHorizontal: 5,
  },
  noOrdersText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#999',
  },

  buttonsAction: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 5,
  },
  buttonSincro: {
    backgroundColor: '#38B0DB',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 7,
  },
  textButtonSincro: {
    color: '#fff',
    marginRight: 10,
  },
  paginationContainer: {
    width: '90%',
    flexDirection: 'row',
    marginHorizontal: '5%',
    paddingHorizontal: '20%', 
    paddingVertical: 10,
  },
  pageButton: {
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
  }
});

export default styles;
