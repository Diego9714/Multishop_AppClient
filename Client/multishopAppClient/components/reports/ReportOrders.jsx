import React, { useState, useEffect } from 'react'
import { Modal, View, Text, TouchableOpacity, ScrollView, Pressable, ImageBackground } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import DateTimePicker from '@react-native-community/datetimepicker'
import styles from '../../styles/ReportModal.styles'
import { images } from '../../constants'
import { MaterialIcons } from '@expo/vector-icons'
import ModalSelectOrder from './ModalSelectOrder' // Asegúrate de importar el modal
import ViewOrder from './ViewOrder' // Asegúrate de importar el modal de visualización

const formatDate = (date) => {
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0') // Months are zero-indexed
  const year = date.getFullYear()
  return `${day}-${month}-${year}`
}

const ReportOrders = ({ isVisible, onClose }) => {
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [dateType, setDateType] = useState('start') // 'start' or 'end'
  const [startDate, setStartDate] = useState(new Date())
  const [endDate, setEndDate] = useState(new Date())
  const [orders, setOrders] = useState([])
  const [filteredOrders, setFilteredOrders] = useState([])
  const [selectedOrder, setSelectedOrder] = useState(null) // New state for the selected order
  const [isModalSelectVisible, setIsModalSelectVisible] = useState(false) // New state for ModalSelectOrder visibility
  const [isViewOrderVisible, setIsViewOrderVisible] = useState(false) // New state for ViewOrder visibility

  const handleDateChange = (event, selectedDate) => {
    if (selectedDate) {
      if (dateType === 'start') {
        setStartDate(selectedDate)
        setShowDatePicker(false)
      } else {
        setEndDate(selectedDate)
        setShowDatePicker(false)
      }
    }
  }

  const handleSelectDate = (type) => {
    setDateType(type)
    setShowDatePicker(true)
  }

  const handleFilter = () => {
    const formattedStartDate = new Date(startDate)
    formattedStartDate.setHours(0, 0, 0, 0)

    const formattedEndDate = new Date(endDate)
    formattedEndDate.setHours(23, 59, 59, 999)

    const filtered = orders.filter(order => {
      const orderDate = new Date(order.fecha)
      return orderDate >= formattedStartDate && orderDate <= formattedEndDate
    })

    setFilteredOrders(filtered)
  }

  const handleReset = () => {
    const today = new Date()
    setStartDate(today)
    setEndDate(today)
    setFilteredOrders(orders)
  }

  const handleOpenModalSelect = (order) => {
    setSelectedOrder(order)
    setIsModalSelectVisible(true)
  }

  const handleCloseModalSelect = () => {
    setIsModalSelectVisible(false)
  }

  const handleOpenViewOrder = (order) => {
    setSelectedOrder(order)
    setIsViewOrderVisible(true)
    handleCloseModalSelect() // Close the select modal when opening view order
  }

  const handleCloseViewOrder = () => {
    setIsViewOrderVisible(false)
  }

  const handleAction = async (action, order) => {
    if (action === 'Eliminar') {
      // Implementar lógica para eliminar el pedido
      console.log(`Eliminar: ${order.nom_cli}`)
    } else if (action === 'Editar') {
      // Implementar lógica para editar el pedido
      console.log(`Editar: ${order.nom_cli}`)
    } else if (action === 'Ver') {
      handleOpenViewOrder(order)
    }
  }

  useEffect(() => {
    const getOrders = async () => {
      const synchronizedOrdersString = await AsyncStorage.getItem('SynchronizedOrders')
      const synchronizedOrders = synchronizedOrdersString ? JSON.parse(synchronizedOrdersString) : []
      setOrders(synchronizedOrders)
      setFilteredOrders(synchronizedOrders)
    }

    getOrders();
  
    const intervalId = setInterval(() => {
      getOrders();
    }, 10000)
  
    return () => clearInterval(intervalId);
  }, [])

  return (
    <>
      <Modal transparent={true} visible={isVisible} onRequestClose={onClose} animationType="slide">
        <ImageBackground source={images.fondo} style={styles.gradientBackground}>
          <View style={styles.container}>
            <View style={styles.mainTitleContainer}>
              <Text style={styles.mainTitle}>Historial de Pedidos</Text>
            </View>

            <View style={styles.dateSelectorsContainer}>
              <TouchableOpacity style={styles.buttonDate} onPress={() => handleSelectDate('start')}>
                <Text style={styles.buttonTextDate}>{formatDate(startDate)}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.buttonDate} onPress={() => handleSelectDate('end')}>
                <Text style={styles.buttonTextDate}>{formatDate(endDate)}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.buttonSearch} onPress={handleFilter}>
                <MaterialIcons name="search" size={25} color="#6b6b6b" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.buttonSearch} onPress={handleReset}>
                <MaterialIcons name="restore" size={24} color="#6b6b6b" />
              </TouchableOpacity>
            </View>

            {showDatePicker && (
              <DateTimePicker
                value={dateType === 'start' ? startDate : endDate}
                mode="date"
                display="default"
                onChange={handleDateChange}
              />
            )}

            <View style={styles.productContainer}>
              <View style={styles.headerProductContainer}>
                <View style={styles.titleListContainer}>
                  <Text style={styles.titleListClient}>Cliente</Text>
                  <Text style={styles.titleListPrice}>Total a pagar</Text>
                  <Text style={styles.titleListActions}>Acciones</Text>
                </View>
              </View>

              <ScrollView>
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order, index) => (
                    <View key={order.id_order} style={styles.productItem}>
                      <View style={styles.nameProd}>
                        <Text style={styles.nameProducts}>{order.nom_cli}</Text>
                      </View>
                      <View style={styles.priceContainer}>
                        <Text>{order.totalUsd} $</Text>
                      </View>
                      <View style={styles.buttonAction}>
                        <Pressable style={styles.buttonMore} onPress={() => handleOpenModalSelect(order)}>
                          <MaterialIcons name="more-vert" size={30} color="#7A7A7B" />
                        </Pressable>
                      </View>
                    </View>
                  ))
                ) : (
                  <Text style={styles.noOrdersText}>No hay pedidos disponibles</Text>
                )}
              </ScrollView>
            </View>

            <View style={styles.buttonsAction}>
              <Pressable style={styles.buttonExit} onPress={onClose}>
                <Text style={styles.buttonText}>Salir</Text>
              </Pressable>
            </View>
          </View>
        </ImageBackground>
      </Modal>

      <ModalSelectOrder
        isVisible={isModalSelectVisible}
        onClose={handleCloseModalSelect}
        onSelect={handleAction}
        selectedOrder={selectedOrder}
        onViewOrder={handleOpenViewOrder} // Asegúrate de pasar la función
      />


      <ViewOrder
        isVisible={isViewOrderVisible}
        onClose={handleCloseViewOrder}
        selectedOrder={selectedOrder}
      />
    </>
  )
}

export default ReportOrders
