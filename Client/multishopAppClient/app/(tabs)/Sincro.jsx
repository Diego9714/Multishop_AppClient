import { Text, View }   from 'react-native'
import React            from 'react'
// Components
import Navbar           from '../../components/Navbar'
import SelectOrders     from '../../components/orders/SelectOrders'


const Sincro = () => {
  return (
    <View>
      <Navbar/>
      <SelectOrders/>
    </View>
  )
}

export default Sincro
