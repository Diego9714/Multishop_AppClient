// Dependencies
import { Text, View, Pressable, Modal, 
  TextInput, ScrollView, Alert , TouchableOpacity , ImageBackground }     from 'react-native'
import React, { useState, useEffect, useCallback }      from 'react'
import { AntDesign, MaterialIcons, FontAwesome }        from '@expo/vector-icons'
import AsyncStorage                                     from '@react-native-async-storage/async-storage'
import { LinearGradient }                               from 'expo-linear-gradient'
import { useFocusEffect }                               from '@react-navigation/native';
// Modals And Components
import ModalProduct                                     from '../products/ModalProducts'
import SaveOrder                                        from './SaveOrder'
import FilterCategories                                 from '../filter/FilterCategories'
// Styles
import styles                                           from '../../styles/SelectProducts.styles'
import { images } from '../../constants'
// JWT - Token
import JWT from 'expo-jwt'

const SelectProducts = ({ isVisible, onClose }) => {
  const [selectedProductsCount, setSelectedProductsCount] = useState(0)
  const [products, setProducts] = useState([])
  const [visibleProducts, setVisibleProducts] = useState([])
  const [searchProduct, setSearchProduct] = useState('')
  const [displaySearchProduct, setDisplaySearchProduct] = useState('')
  const [page, setPage] = useState(1)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [isProductModalVisible, setIsProductModalVisible] = useState(false)
  const [isSaveOrderModalVisible, setIsSaveOrderModalVisible] = useState(false)
  const [productQuantities, setProductQuantities] = useState({})
  const itemsPerPage = 10
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false)
  const [searchCategory, setSearchCategory] = useState([])
  const [priceOrder, setPriceOrder] = useState('')
  const [isFiltering, setIsFiltering] = useState(false)
  const [prodExistence, setProdExistence] = useState(null)
  
  useFocusEffect(
    useCallback(() => {
      setIsSaveOrderModalVisible(false)
      fetchProducts();

    }, [])
  );

  // Actualiza el contador de productos seleccionados cuando cambia productQuantities
  useEffect(() => {
    const count = Object.values(productQuantities).filter(quantity => quantity > 0).length;
    setSelectedProductsCount(count);
  }, [productQuantities]);

  // UseEffect para la actualización de productos
  useEffect(() => {
    const getProducts = async () => {
      const productsInfo = await AsyncStorage.getItem('products');
      const productsJson = JSON.parse(productsInfo);
      const filteredProducts = (productsJson || []).filter(product => product.existencia > 0);

      // Mantén la selección y las cantidades actuales
      setProducts(prevProducts => {
        const updatedProducts = filteredProducts.map(product => {
          const existingProduct = prevProducts.find(p => p.codigo === product.codigo);
          return existingProduct ? existingProduct : product;
        });
        return updatedProducts;
      });
    };

    getProducts();

    const intervalId = setInterval(() => {
      getProducts();
    }, 2000); // Actualiza cada 2 segundos

    return () => clearInterval(intervalId);
  }, []); // Solo se ejecuta al montar el componente

  // UseEffect para aplicar filtros y paginación
  useEffect(() => {
    let filteredProducts = products.filter(product => product.existencia > 0);

    // Aplica filtros
    if (displaySearchProduct.length >= 3) {
      const searchWords = displaySearchProduct.toLowerCase().split(' ');
      filteredProducts = filteredProducts.filter(product =>
        searchWords.every(word => product.descrip.toLowerCase().includes(word))
      );
    }

    if (searchCategory.length > 0) {
      filteredProducts = filteredProducts.filter(product =>
        searchCategory.some(category => product.ncate.includes(category))
      );
    }

    // Ordena por precio si es necesario
    if (priceOrder === 'menor-mayor') {
      filteredProducts = filteredProducts.sort((a, b) => a.precioUsd - b.precioUsd);
    } else if (priceOrder === 'mayor-menor') {
      filteredProducts = filteredProducts.sort((a, b) => b.precioUsd - a.precioUsd);
    }

    // Paginación
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    setVisibleProducts(filteredProducts.slice(start, end));

    // Ajusta la página si es necesario
    if (filteredProducts.length > 0 && page > Math.ceil(filteredProducts.length / itemsPerPage)) {
      setPage(1);
    }
  }, [page, products, displaySearchProduct, searchCategory, priceOrder]); // Dependencias necesarias

  
  useEffect(() => {
    applyFilters()
  }, [page, products, displaySearchProduct, searchCategory, priceOrder])

  useEffect(() => {
    setIsFiltering(searchCategory.length > 0 || priceOrder !== '')
  }, [searchCategory, priceOrder])

  useEffect(() => {
    const getExistence = async () => {
      try {
        const token = await AsyncStorage.getItem('tokenUser')
        const decodedToken = JWT.decode(token, "appMultishop2024*")
        const prodExists = decodedToken.prodExistence
        setProdExistence(prodExists)
      } catch (error) {
        console.error('Error al obtener datos de AsyncStorage:', error)
      }
    }

    getExistence()
  }, [])

  const handleSearch = () => {
    if (searchProduct.length === 0) {
      setDisplaySearchProduct('')
      setPage(1)
      return
    }
  
    if (searchProduct.length < 3) {
      Alert.alert('Por favor ingrese al menos tres letras para buscar')
      return
    }
  
    setDisplaySearchProduct(searchProduct)
    setPage(1)
  }

  const handleProductSelection = useCallback((product) => {
    const updatedProductQuantities = { ...productQuantities };
    
    if (product.selected) {
      // Deseleccionar el producto
      product.selected = false;
      setSelectedProductsCount(prevCount => Math.max(prevCount - 1, 0));
      delete updatedProductQuantities[product.codigo];
    } else {
      // Seleccionar el producto
      product.selected = true;
      setSelectedProductsCount(prevCount => prevCount + 1);
      updatedProductQuantities[product.codigo] = 0; // Initialize with 0 quantity
    }
  
    setProductQuantities(updatedProductQuantities);
    setProducts(products.map(p =>
      p.codigo === product.codigo ? { ...p, selected: !p.selected } : p
    ));
  }, [productQuantities, products]);
  

  const handleQuantityChange = useCallback((productId, text) => {
    if (!/^\d*$/.test(text)) { // Allow empty string for quantity input
      Alert.alert('Cantidad no válida', 'Por favor ingrese solo números enteros positivos.')
      return
    }
  
    const quantity = text === '' ? 0 : parseInt(text, 10)
    const product = products.find(p => p.codigo === productId)
  
    // Allow any quantity greater than 0 if prodExistence is 0
    if (prodExistence === 0 && quantity > 0) {
      const updatedProductQuantities = { ...productQuantities }
      updatedProductQuantities[productId] = quantity
  
      if (quantity > 0) {
        if (!product.selected) {
          product.selected = true
          setSelectedProductsCount(prevCount => prevCount + 1)
        }
      } else {
        if (product.selected) {
          product.selected = false
          setSelectedProductsCount(prevCount => Math.max(prevCount - 1, 0))
        }
      }
  
      setProductQuantities(updatedProductQuantities)
      setProducts(products.map(p =>
        p.codigo === productId ? { ...p, selected: quantity > 0 } : p
      ))
      return
    }
  
    // Standard quantity check
    if (quantity > product.existencia) {
      Alert.alert('Cantidad no disponible', `La cantidad ingresada: ${quantity} supera la cantidad existente en el inventario: ${product.existencia}`)
      handleProductDelete(productId) // Deselect the product and clear the quantity if it exceeds the stock
      return
    }
  
    const updatedProductQuantities = { ...productQuantities }
    updatedProductQuantities[productId] = quantity
  
    if (quantity > 0) {
      if (!product.selected) {
        product.selected = true
        setSelectedProductsCount(prevCount => prevCount + 1)
      }
    } else {
      if (product.selected) {
        product.selected = false
        setSelectedProductsCount(prevCount => Math.max(prevCount - 1, 0))
      }
    }
  
    setProductQuantities(updatedProductQuantities)
    setProducts(products.map(p =>
      p.codigo === productId ? { ...p, selected: quantity > 0 } : p
    ))
  }, [productQuantities, products, prodExistence])
  
  const handleProductDelete = useCallback((productId) => {
    const updatedProductQuantities = { ...productQuantities }
    const wasSelected = productQuantities[productId] > 0
    delete updatedProductQuantities[productId]
    setProductQuantities(updatedProductQuantities)

    const updatedProducts = products.map(product =>
      product.codigo === productId ? { ...product, selected: false } : product
    )
    setProducts(updatedProducts)

    if (wasSelected) {
      setSelectedProductsCount(prevCount => Math.max(prevCount - 1, 0))
    }
  }, [productQuantities, products])

  const generateSelectedProductJSON = () => {
    // Filtrar productos seleccionados
    const selectedProducts = products.filter(product => product.selected);
  
    // Filtrar productos con cantidad mayor a 0
    const selectedProductsWithQuantities = selectedProducts
      .filter(product => (productQuantities[product.codigo] || 0) > 0) // Asegurarse de que la cantidad sea mayor a 0
      .map(product => ({
        codigo: product.codigo,
        descrip: product.descrip,
        exists: product.existencia,
        quantity: productQuantities[product.codigo] || 0,
        priceUsd: product.precioUsd,
        priceBs: (product.precioUsd * 36.372).toFixed(2),
      }));
  
    // Crear el objeto de la orden
    const order = {
      products: selectedProductsWithQuantities
    };
  
    return order;
  }
  

  const validateOrder = () => {
    const selectedProducts = products.filter(product => product.selected)
    for (const product of selectedProducts) {
      if (productQuantities[product.codigo] === 0) {
        Alert.alert('Error', 'No se pueden seleccionar productos con cantidad 0.')
        return false
      }
    }
    return true
  }

  const renderPaginationButtonsProducts = () => {
    let filteredProducts = products.slice()  
    
    if (displaySearchProduct.length >= 3) {
      const searchTerms = displaySearchProduct.toLowerCase().split(' ').filter(term => term.length > 0)
      filteredProducts = filteredProducts.filter(product => {
        const productDescrip = product.descrip.toLowerCase()
        return searchTerms.every(term => productDescrip.includes(term))
      })
    }
    if (searchCategory.length > 0) {
      filteredProducts = filteredProducts.filter(product =>
        searchCategory.some(category => product.ncate.includes(category))
      )
    }
  
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)

    // Si no hay búsqueda ni filtros, establecer las páginas por defecto en 5
    const maxPages = (displaySearchProduct.length === 0 && searchCategory.length === 0) ? 5 : totalPages

    let buttons = []
    let startPage = Math.max(1, page - 2)
    let endPage = Math.min(maxPages, startPage + 4)

    if (endPage - startPage < 4) {
      startPage = Math.max(1, endPage - 4)
    }
  
    for (let i = startPage; i <= endPage; i++) {
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
      )
    }
    return buttons
  }

  const openFilterModal = () => {
    setIsFilterModalVisible(true)
  }

  const closeFilterModal = () => {
    setIsFilterModalVisible(false)
  }

  const handleSaveFilters = (selectedFilters) => {
    console.log('Filtros seleccionados:', selectedFilters)
    setSearchCategory(selectedFilters.selectedCategory || '')
    setPriceOrder(selectedFilters.selectedPriceOrder || '')
    setPage(1)
  }

  const applyFilters = () => {
    let filteredProducts = products.slice()
  
    if (displaySearchProduct.length >= 3) {
      const searchTerms = displaySearchProduct.toLowerCase().split(' ').filter(term => term.length > 0)
      filteredProducts = filteredProducts.filter(product => {
        const productDescrip = product.descrip.toLowerCase()
        return searchTerms.every(term => productDescrip.includes(term))
      })

      // Mostrar alerta si no se encontraron productos
      if (filteredProducts.length === 0) {
        Alert.alert('Producto no encontrado', 'No se encontró ningún producto con ese nombre.')
        setSearchProduct('')
        setDisplaySearchProduct('')
        setPage(1)
        return
      }
    }
  
    // Filtrar por categoría o marca seleccionada
    if (searchCategory.length > 0 ) {
      filteredProducts = filteredProducts.filter(product =>
        searchCategory.some(category => product.ncate.includes(category))
      )
    }

    // Ordenar según el precio si se selecciona
    if (priceOrder === 'menor-mayor') {
      filteredProducts = filteredProducts.sort((a, b) => a.precioUsd - b.precioUsd)
    } else if (priceOrder === 'mayor-menor') {
      filteredProducts = filteredProducts.sort((a, b) => b.precioUsd - a.precioUsd)
    }
  
    // Paginación
    const start = (page - 1) * itemsPerPage
    const end = start + itemsPerPage
    setVisibleProducts(filteredProducts.slice(start, end))

    // Ajustar la página si no hay suficientes productos para la página actual
    if (filteredProducts.length > 0 && page > Math.ceil(filteredProducts.length / itemsPerPage)) {
      setPage(1)
    }
  }

  const fetchProducts = async () => {
    try {
      const productsInfo = await AsyncStorage.getItem('products');
      const productsJson = JSON.parse(productsInfo);
      const filteredProducts = (productsJson || []).filter(product => product.existencia > 0);
      setProducts(filteredProducts);
    } catch (error) {
      console.error('Error al obtener productos:', error);
    }
  };

  const handleOrderSaved = () => {
    setIsSaveOrderModalVisible(false);
    setSelectedProductsCount(0);
    setSearchProduct('');
    setDisplaySearchProduct('');
    setPage(1);
    setSelectedProduct(null);
    setProductQuantities({});

    fetchProducts();
  };

  const handleClose = () => {
    // Vaciar productos seleccionados y cantidades
    setProductQuantities({});
    setSelectedProductsCount(0);
  
    // Cerrar el modal
    onClose();
  };
  
  

  return (
    <Modal visible={isVisible} animationType="slide" transparent={true}>
      <ImageBackground
        source={images.fondo}
        style={styles.gradientBackground}
      >
        <View style={styles.container}>
          <View style={styles.mainTitleContainer}>
            <Text style={styles.mainTitle}>Selección de Productos</Text>
          </View>

          <View style={styles.finderContainer}>
            <View style={styles.seekerContainer}>
              <TextInput
                placeholder='Buscar Producto'
                style={styles.seeker}
                value={searchProduct}
                onChangeText={text => setSearchProduct(text)}
              />
              <Pressable onPress={handleSearch}>
                <FontAwesome name="search" size={28} color="#8B8B8B" />
              </Pressable>
            </View>
            <TouchableOpacity onPress={openFilterModal} style={styles.filterContainer}>
              <Text style={styles.textFilter}>Filtrar</Text>
              <MaterialIcons name="filter-alt" size={28} color="white" />
              {isFiltering && (
                <FontAwesome name="circle" size={20} color="red" style={styles.filterIndicator} />
              )}
            </TouchableOpacity>
          </View>

          <FilterCategories
            visible={isFilterModalVisible}
            onClose={closeFilterModal}
            onSave={handleSaveFilters}
          />

          <View style={styles.productContainer}>
            <View style={styles.headerProductContainer}>
              <View style={styles.titleListContainer}>
                <Text style={styles.titleListProduct}>Producto</Text>
                {/* <Text style={styles.titleListCant}>Cantidad</Text> */}
                <Text style={styles.titleListActions}>Acciones</Text>
              </View>
            </View>

            <View style={styles.listContainer}>
              <ScrollView>
              {visibleProducts.map((product, index) => (
                <View key={index} style={styles.productItem}>
                  <View style={styles.nameProd}>
                    <Text>{product.descrip}</Text>
                  </View>
                  <View style={styles.quantityContainer}>
                    <TextInput
                      style={styles.quantityInput}
                      keyboardType="numeric"
                      placeholder="Cantidad"
                      value={String(productQuantities[product.codigo] || '')}
                      onChangeText={text => handleQuantityChange(product.codigo, text)}
                    />

                    <Pressable
                      style={styles.buttonMore}
                      onPress={() => {
                        setSelectedProduct(product)
                        setIsProductModalVisible(true)
                      }}
                    >
                      <MaterialIcons name="more-vert" size={30} color="#7A7A7B" />
                    </Pressable>

                    {productQuantities[product.codigo] > 0 && (
                      <Pressable
                        // style={styles.button}
                        onPress={() => handleProductDelete(product.codigo)}
                      >
                        <MaterialIcons name="delete" size={30} color="#7A7A7B" />
                      </Pressable>
                    )}

                  </View>
                </View>
              ))}
              </ScrollView>
            </View>
          </View>

          <View style={styles.pagination}>
            <ScrollView horizontal style={styles.paginationContainer}>
              {renderPaginationButtonsProducts()}
            </ScrollView>
          </View>

          <View style={styles.buttonsAction}>
          <Pressable style={styles.buttonExit} onPress={handleClose}>
              <Text style={styles.buttonText}>Salir</Text>
            </Pressable>
            <Pressable
              style={[styles.buttonModal, { opacity: selectedProductsCount < 1 ? 0.5 : 1 }]}
              onPress={() => {
                if (selectedProductsCount >= 1 && validateOrder()) {
                  setIsSaveOrderModalVisible(true)
                }
              }}
              disabled={selectedProductsCount < 1}
            >
              <Text style={styles.buttonTextSave}>Guardar</Text>
              <AntDesign name="shoppingcart" size={26} color="white" />
              <View style={styles.counterContainer}>
                <Text style={styles.counterText}>{selectedProductsCount}</Text>
              </View>
            </Pressable>
          </View>

          {selectedProduct && (
            <ModalProduct
              isVisible={isProductModalVisible}
              onClose={() => setIsProductModalVisible(false)}
              product={selectedProduct}
            />
          )}
          
          <SaveOrder
            isVisible={isSaveOrderModalVisible}
            onClose={() => setIsSaveOrderModalVisible(false)}
            order={generateSelectedProductJSON()}
            onQuantityChange={handleQuantityChange}
            onDeleteProduct={handleProductDelete}
            onOrderSaved={handleOrderSaved}
          />
        </View>
      </ImageBackground>
    </Modal>
  )
}

export default SelectProducts
