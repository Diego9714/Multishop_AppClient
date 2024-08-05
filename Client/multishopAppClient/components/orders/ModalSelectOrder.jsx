// Dependencies
import React from 'react';
import { Text, View, Modal, Pressable } from 'react-native';
// Styles
import styles from '../../styles/ModalSelectOrder.styles';

const ModalSelectOrder = ({ isVisible, onClose, onSelect, selectedOrder }) => {

  const handleModalSelect = async (action) => {
    if (action === 'Eliminar' && selectedOrder) {
      onSelect('Eliminar', selectedOrder);
    } else if (action === 'Editar' && selectedOrder) {
      onSelect('Editar', selectedOrder);
    }
    
    onClose();
  };

  // const formatDate = (dateString) => {
  //   const date = new Date(dateString);
  //   const day = String(date.getDate()).padStart(2, '0');
  //   const month = String(date.getMonth() + 1).padStart(2, '0');
  //   const year = date.getFullYear();
  //   return `${day}/${month}/${year}`;
  // };

  return (
    <Modal visible={isVisible && !!selectedOrder} animationType="fade" transparent={true}>
      {selectedOrder && (
        <View style={styles.modalContainer}>
          <View style={styles.container}>
            <Text style={styles.modalTitle}>{selectedOrder.id_order}</Text>
            <Text style={styles.modalTitle}>{selectedOrder.fecha}</Text>

            <Pressable style={styles.modalButton} onPress={() => handleModalSelect('Eliminar')}>
              <Text style={styles.modalButtonText}>Eliminar</Text>
            </Pressable>
            <Pressable style={styles.modalButton} onPress={() => handleModalSelect('Editar')}>
              <Text style={styles.modalButtonText}>Editar</Text>
            </Pressable>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <Text style={styles.modalButtonText}>Salir</Text>
            </Pressable>
          </View>
        </View>
      )}
    </Modal>
  );
}

export default ModalSelectOrder;
