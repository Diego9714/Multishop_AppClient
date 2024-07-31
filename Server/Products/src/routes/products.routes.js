import {Router} from 'express'
const router = Router()

// Environment
import { PRODUCTS , CATEGORY , CURRENCY} from '../global/_var.js'

// Controller
import {controller} from '../controllers/products.controller.js'

// Routes
router.get(PRODUCTS , controller.getProducts)
router.get(CATEGORY , controller.getCategory)
router.get(CURRENCY , controller.getCurrency)

export default router