import { Orders } from '../models/order.model.js'

export const controller = {}

controller.saveOrder = async (req, res) => {
  try {
    let msg = {
      status: false,
      msg: "Unsuccessful synchronization",
      code: 500
    }

    const { order } = req.body

    console.log(order)

    if (!order || order.length === 0) {
      return res.status(400).json({
        status: false,
        msg: "No orders provided",
        code: 400
      })
    }

    const result = await Orders.saveOrder(order)
    console.log(result)

    const processOrder = {
      completed: result.completed,
      notCompleted: result.notCompleted,
    }

    msg = {
      status: true,
      msg: "Successful synchronization",
      code: 200,
      processOrder
    }

    return res.status(200).json(msg)
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}
