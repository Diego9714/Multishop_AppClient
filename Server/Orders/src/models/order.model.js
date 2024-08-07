import { pool }   from '../connection/mysql.connect.js'
import {parse, format } from 'date-fns'

export class Orders {
  static async saveOrder(order) {
    try {
      let ordersCompleted = []
      let ordersNotCompleted = []
  
      const connection = await pool.getConnection()
  
      for (const info of order) {
        const { id_order, id_scli, cod_cli, nom_cli, totalUsd, totalBs, tipfac, fecha, products, prodExistence } = info
  
        // Convertir la fecha desde 'DD/MM/YYYY' a un objeto Date
        const dateObj = parse(fecha, 'dd/MM/yyyy', new Date());

        // Formatear la fecha a 'YYYY-MM-DD'
        const formattedFecha = format(dateObj, 'yyyy-MM-dd');

        console.log("formattedFecha");
        console.log(formattedFecha);

  
        const existingOrder = `SELECT id_order FROM preorder WHERE cod_order = ? AND id_scli = ? AND cod_cli = ?  AND amountUsd = ? AND date_created = ?;`
        const [checkOrder] = await connection.execute(existingOrder, [id_order ,id_scli, cod_cli, totalUsd, formattedFecha])
  
        if (checkOrder.length > 0) {
          ordersCompleted.push(info)
        } else {  
          // Registramos el pedido
          let sqlOrder = 'INSERT INTO preorder (cod_order , id_scli, cod_cli,  amountUsd, amountBs, tip_doc, date_created) VALUES (?, ?, ?, ?, ?, ?, ?);'
          let [orderResult] = await connection.execute(sqlOrder, [id_order, id_scli, cod_cli,  totalUsd, totalBs, tipfac, formattedFecha])
  
          const id_orderr = orderResult.insertId
  
          let allProductsAvailable = true
  
          if(prodExistence == 0){
            for (const prod of products) {
              const { codigo, quantity, descrip, priceUsd, priceBs } = prod
    
              const saveProd = `INSERT INTO prodorder (id_order, cod_order, cod_cli, codigo, descrip, quantity, priceUsd, priceBs, date_created) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`
              await connection.execute(saveProd, [id_orderr, id_order, cod_cli, codigo, descrip, quantity, priceUsd, priceBs, formattedFecha])
            }
          }else{
            // Verificamos la existencia de los productos
            for (const prod of products) {
              const { codigo, quantity, descrip, priceUsd, priceBs } = prod
    
              // Buscar el producto y verificar su existencia
              const productQuery = `SELECT existencia FROM sinv WHERE codigo = ?;`
              const [product] = await connection.execute(productQuery, [codigo])

              if (product.length > 0) {
                let currentExistence = product[0].existencia
    
                // Ajusta la existencia a 0 si la cantidad solicitada es mayor que la existencia actual
                if (currentExistence < quantity) {
                  quantity = currentExistence
                  currentExistence = 0
                } else {
                  currentExistence -= quantity
                }
    
                // Guardamos el producto en el pedido
                const saveProd = `INSERT INTO prodorder (id_order, cod_order, cod_cli, codigo, descrip, quantity, priceUsd, priceBs, date_created) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`
                await connection.execute(saveProd, [id_orderr, id_order, cod_cli, codigo, descrip, quantity, priceUsd, priceBs, formattedFecha])
    
                // Actualizamos la existencia del producto
                const updateExistence = `UPDATE sinv SET existencia = ? WHERE codigo = ?;`
                await connection.execute(updateExistence, [currentExistence, codigo])
              } else {
                allProductsAvailable = false
                ordersNotCompleted.push(info)
                break
              }
            }
          }
  
          if (allProductsAvailable) {
            ordersCompleted.push(info)
          }
        }
      }
  
      connection.release()
  
      return {
        code: 200,
        status: true,
        msg: 'Orders processed',
        completed: ordersCompleted,
        notCompleted: ordersNotCompleted
      }
    } catch (error) {
      return error
    }
  }
  
  static async saveVisits(visits) {
    try {
      let visitsCompleted = []
      let visitsNotCompleted = []
  
      for (const info of visits) {
        const { id_scli, cod_cli, nom_cli,  fecha } = info
  
        const connection = await pool.getConnection()
  
        const existingVisit = `SELECT id_visit FROM visits WHERE id_scli = ? AND cod_cli = ?  AND date_created = ?;`
        const [checkVisit] = await connection.execute(existingVisit, [id_scli, cod_cli,  fecha])

        if (checkVisit.length > 0) {
          visitsCompleted.push(info)
        } else {
          let sql = 'INSERT INTO visits ( id_scli, cod_cli, nom_cli, date_created) VALUES (?, ?, ?, ?, ?);'
          await connection.execute(sql, [ id_scli, cod_cli, nom_cli, fecha])
  
          visitsCompleted.push(info)
        }
  
        connection.release()
      }
  
      return {
        code: 200,
        status: true,
        msg: 'Visits processed',
        completed: visitsCompleted,
        notCompleted: visitsNotCompleted
      }
    } catch (error) {
      return error
    }
  }

  static async savePass(visits) {
    try {
      let passCompleted = []
      let passNotCompleted = []
  
      for (const info of visits) {
        const { id_pass, id_scli, cod_cli, nom_cli,  monto, tipoPago, tasaPago, fecha } = info
  
        const connection = await pool.getConnection()
  
        const existingPass = `SELECT id_pass FROM pass WHERE id_scli = ? AND identifier = ?  AND date_created = ?;`
        const [checkPass] = await connection.execute(existingPass, [id_scli, id_pass,  fecha])

        if (checkPass.length > 0) {
          passCompleted.push(info)
        } else {
          let sql = 'INSERT INTO pass (identifier, id_scli, cod_cli, nom_cli,  amount, currency_type, currency_rate, date_created) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
          await connection.execute(sql, [id_pass, id_scli, cod_cli, nom_cli,  monto, tipoPago, tasaPago, fecha])
  
          passCompleted.push(info)
        }
  
        connection.release()
      }
  
      return {
        code: 200,
        status: true,
        msg: 'Pass processed',
        completed: passCompleted,
        notCompleted: passNotCompleted
      }
    } catch (error) {
      return error
    }
  }
}

