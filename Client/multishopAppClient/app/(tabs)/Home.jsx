import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ModalErrorSincro from '../../components/home/ModalErrorSincro'; // Importa el modal de error
import CardsHome from '../../components/home/CardsHome';
import Navbar from '../../components/Navbar';
import { instanceProducts } from '../../global/api';
// JWT - Token
import JWT from 'expo-jwt';

// Helper functions
const storeData = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error storing ${key}:`, error);
    throw error;
  }
};

const getProducts = async (signal) => {
  try {
    const res = await instanceProducts.get(`/api/products`, { signal });
    const listProducts = res.data.products || []; // Asegúrate de que sea una lista, incluso si está vacía
    await storeData('products', listProducts);
    return { success: true };
  } catch (error) {
    if (error.name === 'AbortError') {
      console.log('Request to get products was aborted.');
    } else {
      console.error('Error fetching products:', error);
    }
    return { success: false, error };
  }
};

const getCategories = async (signal) => {
  try {
    const res = await instanceProducts.get(`/api/categories`, { signal });
    const listCategories = res.data.categories || []; // Asegúrate de que sea una lista, incluso si está vacía
    await storeData('categories', listCategories);
    return { success: true };
  } catch (error) {
    if (error.name === 'AbortError') {
      console.log('Request to get categories was aborted.');
    } else {
      console.error('Error fetching categories:', error);
    }
    return { success: false, error };
  }
};

const getCurrency = async (signal) => {
  try {
    const res = await instanceProducts.get(`/api/currency`, { signal });
    const listCurrency = res.data.currency || []; // Asegúrate de que sea una lista, incluso si está vacía
    await storeData('currency', listCurrency);
    return { success: true };
  } catch (error) {
    if (error.name === 'AbortError') {
      console.log('Request to get currency was aborted.');
    } else {
      console.error('Error fetching currency:', error);
    }
    return { success: false, error };
  }
};

const getCompany = async (signal) => {
  try {
    const res = await instanceProducts.get(`/api/company`, { signal });
    const listCompany = res.data.company || []; // Asegúrate de que sea una lista, incluso si está vacía
    await storeData('company', listCompany);
    return { success: true };
  } catch (error) {
    if (error.name === 'AbortError') {
      console.log('Request to get company was aborted.');
    } else {
      console.error('Error fetching company:', error);
    }
    return { success: false, error };
  }
};

const getOrdersSync = async (signal) => {
  try {
    let token = await AsyncStorage.getItem('tokenUser');
    const decodedToken = JWT.decode(token, "appMultishop2024*");

    let cod_cli = decodedToken.cod_cli;

    const res = await instanceProducts.get(`/api/orders/client/${cod_cli}`, { signal });
    const listorders = res.data.orders || []; // Asegúrate de que sea una lista, incluso si está vacía
    await storeData('SynchronizedOrders', listorders);
    return { success: true };
  } catch (error) {
    if (error.name === 'AbortError') {
      console.log('Request to get orders was aborted.');
    } else {
      console.error('Error fetching orders:', error);
    }
    return { success: false, error };
  }
};

const getAllInfo = async (setLoading, setMessage, setShowErrorModal) => {
  setLoading(true);
  setMessage('');
  setShowErrorModal(false); // Reinicia el estado del modal al iniciar la sincronización

  const controller = new AbortController();
  const { signal } = controller;

  const timeoutId = setTimeout(() => {
    controller.abort();
    setLoading(false);
    setMessage('Tiempo de espera agotado. Intenta nuevamente.');
    setShowErrorModal(true);
  }, 2000); // Timeout de 2 segundos

  try {
    const token = await AsyncStorage.getItem('tokenUser');
    if (token) {
      const results = await Promise.all([
        getProducts(signal),
        getCategories(signal),
        getCurrency(signal),
        getCompany(signal),
        getOrdersSync(signal)
      ]);

      clearTimeout(timeoutId);
      setLoading(false);

      const allSuccessful = results.every(result => result.success);

      if (allSuccessful) {
        return { success: true };
      } else {
        setShowErrorModal(true); // Muestra el modal si alguna solicitud falla
        return { success: false, error: 'Información no recibida.' };
      }
    } else {
      clearTimeout(timeoutId);
      setLoading(false);
      return { success: false, error: 'No se encontró el token del usuario.' };
    }
  } catch (error) {
    clearTimeout(timeoutId);
    setLoading(false);
    setShowErrorModal(true); // Muestra el modal si ocurre un error
    return { success: false, error: 'Error al actualizar la información.' };
  }
};

// Home Component
const Home = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showErrorModal, setShowErrorModal] = useState(false); // Estado para manejar la visibilidad del modal
  const [abortController, setAbortController] = useState(null);

  const handleRetry = async () => {
    setShowErrorModal(false);
    const result = await getAllInfo(setLoading, setMessage, setShowErrorModal);
    if (!result.success) {
      setMessage(result.error);
      setShowErrorModal(true);
    }
  };

  const handleCloseModal = () => {
    setShowErrorModal(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      const controller = new AbortController();
      setAbortController(controller);
      const result = await getAllInfo(setLoading, setMessage, setShowErrorModal);
      if (!result.success) {
        setMessage(result.error);
        setShowErrorModal(true);
      }
    };
    fetchData();

    // Cleanup function to abort request if component unmounts or new request is made
    return () => {
      if (abortController) {
        abortController.abort();
      }
    };
  }, []);

  return (
    <View>
      <Navbar />
      <CardsHome />
      <ModalErrorSincro
        visible={showErrorModal}
        onClose={handleCloseModal}
        onRetry={handleRetry}
        message={message}
      />
    </View>
  );
};

export default Home;
