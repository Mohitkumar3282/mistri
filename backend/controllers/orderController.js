import { MOCK_ORDERS } from '../../frontend/src/data/mockData.js';

let ordersDatabase = [...MOCK_ORDERS];

/**
 * @desc Get all material orders
 * @route GET /api/orders
 */
export const getOrders = async (req, res) => {
  try {
    const { status, search } = req.query;
    let result = [...ordersDatabase];

    if (status && status !== 'all') {
      result = result.filter(
        (o) => o.status?.toLowerCase() === status.toLowerCase()
      );
    }

    if (search) {
      const lower = search.toLowerCase();
      result = result.filter(
        (o) =>
          o.id?.toLowerCase().includes(lower) ||
          o.orderNumber?.toLowerCase().includes(lower) ||
          o.customerName?.toLowerCase().includes(lower) ||
          o.customerPhone?.includes(lower)
      );
    }

    res.json({
      success: true,
      count: result.length,
      data: result,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc Get single order by ID
 * @route GET /api/orders/:id
 */
export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = ordersDatabase.find(
      (o) => o.id === id || o.orderNumber === id
    );

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc Create new material order
 * @route POST /api/orders
 */
export const createOrder = async (req, res) => {
  try {
    const newOrder = {
      id: `ORD-${Date.now().toString().slice(-6)}`,
      orderNumber: `MST-2026-${Date.now().toString().slice(-5)}`,
      orderDate: new Date().toISOString(),
      status: 'Confirmed',
      paymentStatus: 'Paid',
      trackingSteps: [
        { title: 'Order Placed', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), completed: true, active: false },
        { title: 'Order Confirmed', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), completed: true, active: true },
        { title: 'Warehouse Dispatch', time: 'Pending', completed: false, active: false },
        { title: 'In Transit', time: 'Pending', completed: false, active: false },
        { title: 'Out for Delivery', time: 'Pending', completed: false, active: false },
        { title: 'Delivered & Unloaded', time: 'Pending', completed: false, active: false },
      ],
      driverName: 'Ramesh Patel',
      driverPhone: '+91 98260 99881',
      vehicleNumber: 'MP-09-TR-4421',
      estimatedArrival: 'Today, 2:30 PM',
      ...req.body,
    };

    ordersDatabase.unshift(newOrder);
    res.status(201).json({ success: true, data: newOrder });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * @desc Update order status, tracking step, driver info (Admin)
 * @route PUT /api/orders/:id
 */
export const updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const index = ordersDatabase.findIndex((o) => o.id === id || o.orderNumber === id);

    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    ordersDatabase[index] = { ...ordersDatabase[index], ...req.body };
    res.json({ success: true, data: ordersDatabase[index] });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * @desc Delete order (Admin)
 * @route DELETE /api/orders/:id
 */
export const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const initialLen = ordersDatabase.length;
    ordersDatabase = ordersDatabase.filter((o) => o.id !== id && o.orderNumber !== id);

    if (ordersDatabase.length === initialLen) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.json({ success: true, message: 'Order deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
