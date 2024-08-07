import { Products } from '../models/product.model.js'

export const controller = {}

controller.getProducts = async (req, res) => {
  try {
    const products = await Products.all()
    res.status(products.code).json(products)

  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}

controller.getCategory = async (req, res) => {
  try {
    const categories = await Products.categories()
    res.status(categories.code).json(categories)

  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}

controller.getCurrency = async (req, res) => {
  try {
    const currency = await Products.currency()
    res.status(currency.code).json(currency)

  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}

controller.getCompany = async (req, res) => {
  try {
    const company = await Products.company()
    res.status(company.code).json(company)

  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}

controller.getOrders = async (req, res) => {
  try {

    const { cod_cli } = req.params

    if (!cod_cli || cod_cli.length === 0) {
      return res.status(400).json({
        status: false,
        msg: "No client provided",
        code: 400
      })
    }

    const orders = await Products.orders(cod_cli)

    res.status(orders.code).json(orders)

  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}
