// Dependencies
import React, { useEffect }   from 'react'
import { View }               from 'react-native'
import AsyncStorage           from '@react-native-async-storage/async-storage'
// Components
import CardsHome              from '../../components/home/CardsHome'
import Navbar                 from '../../components/Navbar'
// Api
import {instanceProducts}       from '../../global/api'


const Home = () => {
  useEffect(() => {
    const getAllInfo = async () => {
      try {
        const token = await AsyncStorage.getItem('tokenUser')
        if (token) {

          const productsStored = await AsyncStorage.getItem('products')
          const categoriesStored = await AsyncStorage.getItem('categories')
          const currencyStored = await AsyncStorage.getItem('currency')
          const companyStored = await AsyncStorage.getItem('company')

          if (!productsStored) {
            getProducts()
          }
          if (!categoriesStored) {
            getCategories()
          }
          if (!currencyStored) {
            getCurrency()
          }
          if(!companyStored){
            getCompany()
          }
        }
      } catch (error) {
        console.error('Error al obtener el token:', error)
      }
    }
    getAllInfo()
  }, [])

  const getProducts = async () => {
    try {
      const res = await instanceProducts.get(`/api/products`)
      let listProducts = res.data.products
      await AsyncStorage.setItem('products', JSON.stringify(listProducts))
    } catch (error) {
      console.error('Error al obtener los productos:', error)
    }
  }

  const getCategories = async () => {
    try {
      const res = await instanceProducts.get(`/api/categories`)
      let listCategories = res.data.categories
      await AsyncStorage.setItem('categories', JSON.stringify(listCategories))
    } catch (error) {
      console.error('Error al obtener las categorías:', error)
    }
  }

  const getCurrency = async () => {
    try {
      const res = await instanceProducts.get(`/api/currency`)
      let listCurrency = res.data.currency
      await AsyncStorage.setItem('currency', JSON.stringify(listCurrency))
    } catch (error) {
      console.error('Error al obtener el cambio de las monedas:', error)
    }
  }

  const getCompany = async () => {
    try {
      const res = await instanceProducts.get(`/api/company`)
      let listCompany = res.data.company
      await AsyncStorage.setItem('company', JSON.stringify(listCompany))
    } catch (error) {
      console.error('Error al obtener el cambio de las monedas:', error)
    }
  }

  return (
    <View>
      <Navbar />
      <CardsHome />
    </View>
  )
}

export default Home
