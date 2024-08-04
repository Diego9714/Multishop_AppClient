import {Router} from 'express'
const router = Router()

// Environment
import { PRODUCTS , CATEGORY , CURRENCY, COMPANY } from '../global/_var.js'

// Controller
import {controller} from '../controllers/products.controller.js'

// Routes
router.get(PRODUCTS , controller.getProducts)
router.get(CATEGORY , controller.getCategory)
router.get(CURRENCY , controller.getCurrency)
router.get(COMPANY  , controller.getCompany)

export default router