// Dependencies
import React , {useState}                                                from 'react'
import { Modal, View, Text, TouchableOpacity, ScrollView , Pressable }  from 'react-native'
import { AntDesign, MaterialIcons, FontAwesome }        from '@expo/vector-icons'

import { LinearGradient }                                   from 'expo-linear-gradient'
import DateTimePicker from '@react-native-community/datetimepicker';
// Styles
import styles                                               from '../../styles/ReportModal.styles'

const Report = ({ isVisible, onClose }) => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [isStartDatePickerVisible, setIsStartDatePickerVisible] = useState(false);
  const [isEndDatePickerVisible, setIsEndDatePickerVisible] = useState(false);

  const showStartDatePicker = () => setIsStartDatePickerVisible(true);
  const hideStartDatePicker = () => setIsStartDatePickerVisible(false);

  const showEndDatePicker = () => setIsEndDatePickerVisible(true);
  const hideEndDatePicker = () => setIsEndDatePickerVisible(false);

  const handleStartDateChange = (event, selectedDate) => {
    if (selectedDate) {
      setStartDate(selectedDate);
      hideStartDatePicker();
    }
  };

  const handleEndDateChange = (event, selectedDate) => {
    if (selectedDate) {
      setEndDate(selectedDate);
      hideEndDatePicker();
    }
  };

  const handleFilter = () => {
    // Formatear las fechas en un formato legible o necesario
    const formattedStartDate = startDate.toISOString().split('T')[0];
    const formattedEndDate = endDate.toISOString().split('T')[0];
    console.log('Start Date:', formattedStartDate);
    console.log('End Date:', formattedEndDate);
    // Agregar lógica de filtrado aquí
  };

  return (
    <Modal transparent={true} visible={isVisible} onRequestClose={onClose} animationType="slide">
      <LinearGradient
      colors={['#ffff', '#9bdef6', '#ffffff', '#9bdef6']}
      style={styles.gradientBackground}
      >
        <View style={styles.container}>
          <View style={styles.mainTitleContainer}>
            <Text style={styles.mainTitle}>Historial de Productos</Text>
          </View>

          {/* <Text style={styles.mainSubtitle}>Buscar</Text> */}

          <View style={styles.buttonsDateAction}>
            <TouchableOpacity style={styles.buttonDate} onPress={showStartDatePicker}>
              <Text style={styles.buttonText}>
                Desde: {startDate.toISOString().split('T')[0]}
              </Text>
            </TouchableOpacity>

            {isStartDatePickerVisible && (
              <DateTimePicker
                value={startDate}
                mode="date"
                display="default"
                onChange={handleStartDateChange}
              />
            )}

            <TouchableOpacity style={styles.buttonDate} onPress={showEndDatePicker}>
              <Text style={styles.buttonText}>
                Hasta:  {endDate.toISOString().split('T')[0]}
              </Text>
            </TouchableOpacity>

            {isEndDatePickerVisible && (
              <DateTimePicker
                value={endDate}
                mode="date"
                display="default"
                onChange={handleEndDateChange}
              />
            )}
          </View>

          <View style={styles.productContainer}>
            <View style={styles.headerProductContainer}>
              <View style={styles.titleListContainer}>
                <Text style={styles.titleListClient}>Cliente</Text>
                <Text style={styles.titleListPrice}>Total a pagar</Text>
                <Text style={styles.titleListActions}>Acciones</Text>
              </View>
            </View>

            <ScrollView>
              {/* {visibleProducts.map((product, index) => ( */}
                <View style={styles.productItem}>
                  <View style={styles.nameProd}>
                    <Text>producto</Text>
                  </View>
                  
                  <View style={styles.buttonAction}>
                  
                    <Pressable
                      style={styles.buttonMore}
                      
                    >
                      <MaterialIcons name="more-vert" size={30} color="#7A7A7B" />
                    </Pressable>
                  </View>
                </View>
              {/* ))} */}
            </ScrollView>
          </View>

          <View style={styles.buttonsAction}>
            <Pressable style={styles.buttonExit} onPress={onClose}>
              <Text style={styles.buttonText}>Salir</Text>
            </Pressable>
          </View>

        </View>
      </LinearGradient>
    </Modal>
  )
}

export default Report
