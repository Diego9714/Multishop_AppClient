import { createAccessToken }   from '../libs/jwt.js'
import { pool }   from '../connection/mysql.connect.js'
import { format } from 'date-fns'

export class Products {
  static async all() {
    try {
      let msg = {
        status: false,
        msg: "Products not founded",
        code: 404
      }

      const connection = await pool.getConnection()

      let sql = `SELECT 
      sinv.codigo , sinv.descrip , sinv.precio1 as precioBs , FLOOR(sinv.existencia) as existencia , sinv.ccate,
      ROUND(detallepr.precio1, 2) as precioUsd,
      catego.ncate
      FROM sinv 
      INNER JOIN detallepr ON sinv.codigo = detallepr.codigo
      INNER JOIN catego ON sinv.ccate = catego.ccate
      WHERE sinv.existencia > 0
      ;`
      let [products] = await connection.execute(sql)
      
      connection.release()

      if(products.length > 0){

        msg = {
          status: true,
          msg: "Products found",
          code: 200,
          products
        } 
      }
  
      return msg
    } catch (error) {
      return error
    }
  }

  static async categories() {
    try {
      let msg = {
        status: false,
        msg: "Categories not founded",
        code: 404
      }

      const connection = await pool.getConnection()

      let sql = `SELECT ccate , ncate FROM catego;`
      let [categories] = await connection.execute(sql)
      
      connection.release()

      if(categories.length > 0){

        msg = {
          status: true,
          msg: "Categories found",
          code: 200,
          categories
        } 
      }
  
      return msg
    } catch (error) {
      return error
    }
  }

  static async brands() {
    try {
      let msg = {
        status: false,
        msg: "Brands not founded",
        code: 404
      }

      const connection = await pool.getConnection()

      let sql = `SELECT cmarca , nmarca FROM marca;`
      let [brands] = await connection.execute(sql)
      
      connection.release()

      if(brands.length > 0){

        msg = {
          status: true,
          msg: "Brands found",
          code: 200,
          brands
        } 
      }
  
      return msg
    } catch (error) {
      return error
    }
  }

  static async currency() {
    try {
      let msg = {
        status: false,
        msg: "Currency not founded",
        code: 404
      }

      const connection = await pool.getConnection()

      let sql = `SELECT moneda , cambio FROM tasamoneda;`
      let [currency] = await connection.execute(sql)
      
      connection.release()

      if(currency.length > 0){

        msg = {
          status: true,
          msg: "Currency found",
          code: 200,
          currency
        } 
      }
  
      return msg
    } catch (error) {
      return error
    }
  }

  static async company() {
    try {
      let msg = {
        status: false,
        msg: "Company not founded",
        code: 404
      }

      const connection = await pool.getConnection()

      let sql = `SELECT rif_emp , nom_emp , dir1_emp , noteOrder FROM empresa;`
      let [company] = await connection.execute(sql)
      
      connection.release()

      if(company.length > 0){

        msg = {
          status: true,
          msg: "company found",
          code: 200,
          company
        } 
      }
  
      return msg
    } catch (error) {
      return error
    }
  }

  static async orders(cod_cli) {
    try {
      const msg = {
        status: false,
        msg: "Error retrieving orders",
        code: 500
      };
  
      const connection = await pool.getConnection();
  
      // Query to get orders details
      const sqlPre = `
        SELECT 
          preorder.cod_order, 
          preorder.id_scli, 
          preorder.cod_cli, 
          scli.nom_cli, 
          scli.dir1_cli AS dir_cli,
          scli.tel_cli AS tlf_cli,
          preorder.tip_doc AS tipfac, 
          preorder.amountUsd AS totalUsd, 
          preorder.amountBs AS totalBs, 
          preorder.date_created AS fecha
        FROM preorder 
        JOIN scli ON preorder.id_scli = scli.id_scli 
        WHERE preorder.cod_cli = ?;
      `;
      const [preorders] = await connection.execute(sqlPre, [cod_cli]);
  
      // Query to get products for each order
      const sqlPro = `SELECT 
        cod_order, 
        codigo, 
        descrip, 
        quantity, 
        priceUsd, 
        priceBs 
      FROM prodorder 
      WHERE cod_cli = ?;`;
      const [prodorders] = await connection.execute(sqlPro, [cod_cli]);
  
      connection.release();
  
      const formatDate = (dateString) => {
        return format(new Date(dateString), 'dd/MM/yyyy');
      };
  
      // Organize orders and products
      if (preorders.length > 0) {
        // Map orders with their products
        const orders = preorders.map(order => {
          // Filter products for the current order
          const products = prodorders.filter(product => product.cod_order === order.cod_order);
  
          return {
            id_order: order.cod_order,
            id_scli: order.id_scli,
            nom_cli: order.nom_cli,
            cod_cli: order.cod_cli,
            dir_cli: order.dir_cli,
            products: products.map(p => ({
              codigo: p.codigo,
              descrip: p.descrip,
              quantity: p.quantity,
              priceUsd: p.priceUsd,
              priceBs: p.priceBs
            })),
            tipfac: order.tipfac,
            tlf_cli: order.tlf_cli,
            totalBs: order.totalBs,
            totalUsd: order.totalUsd,
            fecha: formatDate(order.fecha)
          };
        });
  
        return {
          status: true,
          msg: "Orders found",
          code: 200,
          orders
        };
      } else {
        // Return a 200 status with a message indicating no orders
        return {
          status: true,
          msg: "No orders found",
          code: 200,
          orders: []
        };
      }
    } catch (error) {
      return {
        status: false,
        msg: "Error retrieving orders",
        code: 500,
        error: error.message
      };
    }
  }
  
  
  
}

