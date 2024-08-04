import React, { useState, useCallback } from 'react'
import { Text, View, TouchableOpacity, ImageBackground } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
// Styles
import { images } from '../../constants'
import styles from '../../styles/CardsHome.styles'
// Screens
import Sincro from '../../app/(tabs)/Sincro'
import Products from '../../app/(tabs)/Products'
// Components
import SelectProducts from '../../components/orders/SelectProducts'
import ModalSelectReport from '../../components/reports/ModalSelectReport'

const CardsHome = () => {
  const [isSelectProductsModalVisible, setIsSelectProductsModalVisible] = useState(false)
  const [isModalSelectReportVisible, setIsModalSelectReportVisible] = useState(false)

  // SelectProducts
  const openSelectProductsModal = () => {
    setIsSelectProductsModalVisible(true)
  }

  const closeSelectProductsModal = () => {
    setIsSelectProductsModalVisible(false)
  }

  // Report
  const openModalSelectReport = () => {
    setIsModalSelectReportVisible(true)
  }

  const closeModalSelectReport = () => {
    setIsModalSelectReportVisible(false)
  }

  const navigation = useNavigation()

  const handlePress = (screenName) => {
    navigation.navigate(screenName)
  }

  // Use useFocusEffect to reset state when the component is focused
  useFocusEffect(
    useCallback(() => {
      // Reset the state when the component is focused
      setIsSelectProductsModalVisible(false)
    }, [])
  )

  return (
    <ImageBackground
      source={images.fondo}
      style={styles.gradientBackground}
    >
      <View style={styles.mainContainer}>
        <View style={styles.container}>
          <TouchableOpacity
            style={styles.cardContainer}
            activeOpacity={0.7}
            useNativeDriver={true}
            onPress={openSelectProductsModal}
          >
            <MaterialCommunityIcons name='truck' color="#38B0DB" size={80} />
            <Text style={styles.title}>Pedidos</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cardContainer}
            activeOpacity={0.7}
            useNativeDriver={true}
            onPress={() => handlePress(Sincro)}
          >
            <MaterialCommunityIcons name="cloud-upload" color="#38B0DB" size={80}/>
            <Text style={styles.title}>Enviar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cardContainer}
            activeOpacity={0.7}
            useNativeDriver={true}
            onPress={() => handlePress(Products)}
          >
            <MaterialCommunityIcons name='clipboard-edit-outline' color="#38B0DB" size={80} />
            <Text style={styles.title}>Productos</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cardContainer}
            activeOpacity={0.7}
            useNativeDriver={true}
            onPress={openModalSelectReport}
          >
            <MaterialIcons name="query-stats" size={80} color="#38B0DB" />
            <Text style={styles.title}>Reportes</Text>
          </TouchableOpacity>

        </View>
      </View>

      <SelectProducts
        isVisible={isSelectProductsModalVisible}
        onClose={closeSelectProductsModal}
      />

      <ModalSelectReport
        isModalSelectReportVisible={isModalSelectReportVisible}
        onClose={closeModalSelectReport}
      />
      
    </ImageBackground>
  )
}

export default CardsHome
