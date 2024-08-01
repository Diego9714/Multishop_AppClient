import React, { useState, useCallback } from 'react'
import { Text, View, TouchableOpacity } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { LinearGradient } from 'expo-linear-gradient'
import styles from '../../styles/CardsHome.styles'
// Screens
import Sincro from '../../app/(tabs)/Sincro'
import Products from '../../app/(tabs)/Products'
// Components
import SelectProducts from '../../components/orders/SelectProducts'
import Report from '../../components/reports/Report'


const CardsHome = () => {
  const [isSelectProductsModalVisible, setIsSelectProductsModalVisible] = useState(false)
  const [isReportesModalVisible, setIsReportesModalVisible] = useState(false)

  // SelectProducts
  const openSelectProductsModal = () => {
    setIsSelectProductsModalVisible(true)
  }

  const closeSelectProductsModal = () => {
    setIsSelectProductsModalVisible(false)
  }

  // Report
  const openReportesModal = () => {
    setIsReportesModalVisible(true)
  }

  const closeReportesModal = () => {
    setIsReportesModalVisible(false)
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
    <LinearGradient
      colors={['#ffff', '#9bdef6', '#ffffff', '#9bdef6']}
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

          <SelectProducts
            isVisible={isSelectProductsModalVisible}
            onClose={closeSelectProductsModal}
          />

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
            onPress={openReportesModal}
          >
            <MaterialIcons name="query-stats" size={80} color="#38B0DB" />
            <Text style={styles.title}>Reportes</Text>
          </TouchableOpacity>

          <Report
            isVisible={isReportesModalVisible}
            onClose={closeReportesModal}
          />

        </View>
      </View>
    </LinearGradient>
  )
}

export default CardsHome
