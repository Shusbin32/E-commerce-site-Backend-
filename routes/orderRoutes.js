const express = require('express');
const router = express.Router();
const axios = require('axios');
const {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus
} = require('../controllers/ordercontroller');

const { protect, isAdmin } = require('../middleware/Utils/authMiddleware');

// 🛒 Create a new order (User)
router.post('/', protect, createOrder);

// 👤 Get orders of logged-in user
router.get('/my-orders', protect, getMyOrders);

// 🔐 Admin: Get all orders
router.get('/', protect, isAdmin, getAllOrders);

// 🔧 Admin: Update order status
router.put('/:orderId/status', protect, isAdmin, updateOrderStatus);

// eSewa payment verification endpoint
router.post('/esewa/verify', async (req, res) => {
  const { amt, rid, pid, scd } = req.body; // these should come from your frontend

  try {
    const response = await axios.post(
      'https://uat.esewa.com.np/epay/transrec',
      null,
      {
        params: { amt, rid, pid, scd },
      }
    );

    // eSewa returns XML, so check for <response_code>Success</response_code>
    if (response.data.includes('<response_code>Success</response_code>')) {
      // Optionally update your order status in DB here
      return res.json({ success: true, message: 'Payment verified' });
    } else {
      return res.status(400).json({ success: false, message: 'Payment verification failed' });
    }
  } catch (err) {
    console.error('eSewa verification error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
