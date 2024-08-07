import AsyncStorage from '@react-native-async-storage/async-storage';
import {instanceProducts} from '../global/api';
// JWT - Token
import JWT from 'expo-jwt'

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
    const listProducts = res.data.products;
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
    const listCategories = res.data.categories;
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
    const listCurrency = res.data.currency;
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
    const listCompany = res.data.company;
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

const getAllInfo = async (setLoading, setMessage) => {
  setLoading(true);
  setMessage('');
  
  const controller = new AbortController();
  const { signal } = controller;

  const timeoutId = setTimeout(() => {
    controller.abort();
    setLoading(false);
    setMessage('Tiempo de espera agotado. Intenta nuevamente.');
  }, 10000); // Timeout de 10 segundos

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
        return { success: false, error: 'Información no actualizada.' };
      }
    } else {
      clearTimeout(timeoutId);
      setLoading(false);
      return { success: false, error: 'No se encontró el token del usuario.' };
    }
  } catch (error) {
    clearTimeout(timeoutId);
    setLoading(false);
    return { success: false, error: 'Error al actualizar la información.' };
  }
};

export { getAllInfo };
