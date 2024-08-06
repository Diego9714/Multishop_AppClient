import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TouchableOpacity, ScrollView, Pressable, ImageBackground } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import styles from '../../styles/ReportModal.styles';
import { images } from '../../constants';
import { MaterialIcons, AntDesign } from '@expo/vector-icons';
import ModalSelectOrder from './ModalSelectOrder';
import ViewOrder from './ViewOrder';

const formatDate = (date) => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

const ReportOrders = ({ isVisible, onClose }) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateType, setDateType] = useState('start');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalSelectVisible, setIsModalSelectVisible] = useState(false);
  const [isViewOrderVisible, setIsViewOrderVisible] = useState(false);
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  const handleDateChange = (event, selectedDate) => {
    // If user cancels the date picker, event is undefined
    if (event.type === 'dismissed') {
      setShowDatePicker(false);
      return;
    }
    
    if (selectedDate) {
      if (dateType === 'start') {
        setStartDate(selectedDate);
      } else {
        setEndDate(selectedDate);
      }
      setShowDatePicker(false);
    }
  };

  const handleSelectDate = (type) => {
    setDateType(type);
    setShowDatePicker(true);
  };

  const handleFilter = () => {
    const formattedStartDate = startDate ? new Date(startDate) : new Date();
    formattedStartDate.setHours(0, 0, 0, 0);

    const formattedEndDate = endDate ? new Date(endDate) : new Date();
    formattedEndDate.setHours(23, 59, 59, 999);

    const filtered = orders.filter(order => {
      const orderDate = new Date(order.fecha);
      return orderDate >= formattedStartDate && orderDate <= formattedEndDate;
    });

    setFilteredOrders(filtered);
    setPage(1);
  };

  const handleReset = () => {
    const today = new Date();
    setStartDate(null);
    setEndDate(null);
    setFilteredOrders(orders);
    setPage(1);
  };

  const handleOpenModalSelect = (order) => {
    setSelectedOrder(order);
    setIsModalSelectVisible(true);
  };

  const handleCloseModalSelect = () => {
    setIsModalSelectVisible(false);
  };

  const handleOpenViewOrder = (order) => {
    setSelectedOrder(order);
    setIsViewOrderVisible(true);
    handleCloseModalSelect();
  };

  const handleCloseViewOrder = () => {
    setIsViewOrderVisible(false);
  };

  const handleAction = async (action, order) => {
    if (action === 'Ver') {
      handleOpenViewOrder(order);
    }
  };

  useEffect(() => {
    const getOrders = async () => {
      const synchronizedOrdersString = await AsyncStorage.getItem('SynchronizedOrders');
      const synchronizedOrders = synchronizedOrdersString ? JSON.parse(synchronizedOrdersString) : [];
      setOrders(synchronizedOrders);
      setFilteredOrders((prev) => {
        // If no filters are applied, update filteredOrders; otherwise, keep previous filtered state
        if (startDate === null && endDate === null) {
          return synchronizedOrders;
        }
        return prev;
      });
    };

    getOrders();

    const intervalId = setInterval(() => {
      getOrders();
    }, 10000);

    return () => clearInterval(intervalId);
  }, [startDate, endDate]); // Depend on startDate and endDate to fetch and update orders

  const applyPagination = () => {
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredOrders.slice(start, end);
  };

  const renderPaginationButtons = () => {
    const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
    const buttons = [];

    for (let i = 1; i <= totalPages; i++) {
      buttons.push(
        <Pressable
          key={i}
          style={[styles.pageButton, page === i && styles.pageButtonActive]}
          onPress={() => setPage(i)}
        >
          <Text style={[styles.pageButtonText, page === i && styles.pageButtonTextActive]}>
            {i}
          </Text>
        </Pressable>
      );
    }

    return buttons;
  };

  return (
    <>
      <Modal
        transparent={true}
        visible={isVisible}
        onRequestClose={onClose}
        animationType="slide"
        onDismiss={() => setShowDatePicker(false)} // Close date picker on modal dismiss
      >
        <ImageBackground source={images.fondo} style={styles.gradientBackground}>
          <View style={styles.container}>
            <View style={styles.mainTitleContainer}>
              <Text style={styles.mainTitle}>Historial de Pedidos</Text>
            </View>

            <View style={styles.dateSelectorsContainer}>
              <TouchableOpacity style={styles.buttonDate} onPress={() => handleSelectDate('start')}>
                <AntDesign name="calendar" size={24} color="#6b6b6b" />
                <Text style={styles.buttonTextDate}>
                  {startDate ? formatDate(startDate) : 'Fecha de inicio'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.buttonDate} onPress={() => handleSelectDate('end')}>
                <AntDesign name="calendar" size={24} color="#6b6b6b" />
                <Text style={styles.buttonTextDate}>
                  {endDate ? formatDate(endDate) : 'Fecha de fin'}
                </Text>
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
                value={dateType === 'start' ? startDate || new Date() : endDate || new Date()}
                mode="date"
                display="default"
                onChange={handleDateChange}
              />
            )}

            <View style={styles.productContainer}>
              <View style={styles.headerProductContainer}>
                <View style={styles.titleListContainer}>
                  <Text style={styles.titleListClient}>Nro Pedido</Text>
                  <Text style={styles.titleListPrice}>Fecha</Text>
                  <Text style={styles.titleListActions}>Acciones</Text>
                </View>
              </View>

              <ScrollView>
                {applyPagination().length > 0 ? (
                  applyPagination().map((order) => (
                    <View key={order.id_order} style={styles.productItem}>
                      <View style={styles.nameProd}>
                        <Text>{order.id_order}</Text>
                      </View>
                      <View style={styles.priceContainer}>
                        <Text>
                          {order.fecha}
                        </Text>
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

            <View style={styles.paginationContainer}>
              {renderPaginationButtons()}
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
        onAction={handleAction}
        selectedOrder={selectedOrder}
      />

      <ViewOrder
        isVisible={isViewOrderVisible}
        onClose={handleCloseViewOrder}
        order={selectedOrder}
      />
    </>
  );
};

export default ReportOrders;
