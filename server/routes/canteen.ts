import { Router } from 'express';
import { db, createNotification } from '../db';

const router = Router();

// GET /api/canteen/menu - Full menu with real stock and prices
router.get('/menu', async (req, res) => {
  try {
    const category = req.query.category as string;
    let query = db.from('canteen_items').select('*').order('name', { ascending: true });

    if (category && category !== 'All') {
      query = query.eq('category', category);
    }

    const { data, error } = await query;
    if (error) {
      return res.status(500).json({ error: error.message });
    }

    const formatted = (data || []).map((item) => ({
      id: item.id,
      name: item.name,
      price: item.price,
      category: item.category,
      isAvailable: item.is_available ?? true,
      stockCount: item.stock_count ?? 50,
      image: item.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80',
      rating: item.rating || 4.8,
      ratingCount: item.rating_count || 120,
      prepTime: item.prep_time || '10 mins'
    }));

    res.json({ menu: formatted });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch canteen menu' });
  }
});

// POST /api/canteen/orders - Create canteen order (with server-side price validation)
router.post('/orders', async (req, res) => {
  try {
    const { studentId, studentName, items, paymentMethod } = req.body;
    // items: Array<{ itemId: string, quantity: number }>

    if (!studentId || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'studentId and items array are required' });
    }

    // Fetch live prices and availability from DB
    const itemIds = items.map((i) => i.itemId);
    const { data: dbItems, error: fetchErr } = await db
      .from('canteen_items')
      .select('*')
      .in('id', itemIds);

    if (fetchErr || !dbItems) {
      return res.status(500).json({ error: 'Failed to verify items' });
    }

    const itemMap = new Map(dbItems.map((i) => [i.id, i]));

    let totalAmount = 0;
    const validatedOrderItems: any[] = [];
    const itemSummaryParts: string[] = [];

    for (const reqItem of items) {
      const dbItem = itemMap.get(reqItem.itemId);
      if (!dbItem) {
        return res.status(400).json({ error: `Item with ID ${reqItem.itemId} no longer exists.` });
      }
      if (dbItem.is_available === false) {
        return res.status(400).json({ error: `"${dbItem.name}" is currently out of stock.` });
      }

      const quantity = Math.max(1, parseInt(reqItem.quantity, 10) || 1);
      const itemTotal = dbItem.price * quantity;
      totalAmount += itemTotal;

      validatedOrderItems.push({
        item_id: dbItem.id,
        item_name: dbItem.name,
        price_at_order: dbItem.price,
        quantity,
        subtotal: itemTotal
      });

      itemSummaryParts.push(`${quantity}x ${dbItem.name}`);
    }

    // Generate token number like #ORD-108
    const { count } = await db.from('canteen_orders').select('id', { count: 'exact', head: true });
    const orderToken = `ORD-${100 + (count || 0) + 1}`;

    // Insert order
    const { data: newOrder, error: orderErr } = await db
      .from('canteen_orders')
      .insert({
        token_number: orderToken,
        student_id: studentId,
        student_name: studentName || 'Abhishek Gupta',
        total_amount: totalAmount,
        payment_method: paymentMethod || 'UPI',
        payment_status: 'PAID',
        status: 'PENDING',
        items_summary: itemSummaryParts.join(', '),
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (orderErr) {
      return res.status(500).json({ error: orderErr.message });
    }

    // Insert order items
    const orderItemsRows = validatedOrderItems.map((oi) => ({
      order_id: newOrder.id,
      item_id: oi.item_id,
      item_name: oi.item_name,
      quantity: oi.quantity,
      unit_price: oi.price_at_order,
      subtotal: oi.subtotal
    }));

    try {
      await db.from('canteen_order_items').insert(orderItemsRows);
    } catch (_) {}

    // Notify student
    await createNotification(
      studentId,
      'canteen_order',
      `Order #${orderToken} Placed`,
      `Your order for ${itemSummaryParts.join(', ')} (₹${totalAmount}) is being prepared by the canteen staff.`,
      '/canteen'
    );

    res.json({
      order: newOrder,
      tokenNumber: orderToken,
      items: validatedOrderItems,
      totalAmount,
      message: `Order #${orderToken} placed successfully!`
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to place canteen order' });
  }
});

// GET /api/canteen/orders/student - Student order history
router.get('/orders/student', async (req, res) => {
  try {
    const studentId = req.query.studentId as string;
    if (!studentId) {
      return res.status(400).json({ error: 'studentId is required' });
    }

    const { data, error } = await db
      .from('canteen_orders')
      .select('*')
      .eq('student_id', studentId)
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json({ orders: data || [] });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch student orders' });
  }
});

// GET /api/canteen/orders/active - Live orders for Canteen staff portal
router.get('/orders/active', async (req, res) => {
  try {
    const { data: orders, error } = await db
      .from('canteen_orders')
      .select('*')
      .neq('status', 'completed')
      .order('created_at', { ascending: true });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    // Calculate queue positions
    const formatted = (orders || []).map((ord, idx) => ({
      ...ord,
      queuePosition: idx + 1
    }));

    res.json({ orders: formatted });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch active canteen orders' });
  }
});

// PATCH /api/canteen/orders/:id/status - Update order status (PENDING -> PREPARING -> READY -> COMPLETED)
router.patch('/orders/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const targetStatus = status.toLowerCase();
    if (!['pending', 'preparing', 'ready', 'completed', 'cancelled'].includes(targetStatus)) {
      return res.status(400).json({ error: 'Invalid order status' });
    }

    const { data, error } = await db
      .from('canteen_orders')
      .update({
        status: targetStatus,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    // If READY, notify student immediately
    if (status === 'READY' && data.student_id) {
      await createNotification(
        data.student_id,
        'canteen_order_ready',
        `Order #${data.token_number} is READY!`,
        `Your hot food is ready for pickup at Sathaye Canteen Counter 1. Please collect your tray.`,
        '/canteen'
      );
    }

    res.json({ order: data, message: `Order #${data.token_number} status updated to ${status}` });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to update order status' });
  }
});

// PATCH /api/canteen/items/:id - Toggle stock or availability
router.patch('/items/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { isAvailable, price, stockCount } = req.body;

    const updates: Record<string, any> = {};
    if (isAvailable !== undefined) updates.is_available = isAvailable;
    if (price !== undefined) updates.price = price;
    if (stockCount !== undefined) updates.stock_count = stockCount;

    const { data, error } = await db
      .from('canteen_items')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json({ item: data, message: 'Menu item updated' });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to update canteen item' });
  }
});

// POST /api/canteen/items - Add new dish to menu
router.post('/items', async (req, res) => {
  try {
    const { name, price, category, image, isAvailable } = req.body;
    if (!name || price === undefined) {
      return res.status(400).json({ error: 'name and price are required' });
    }

    const { data, error } = await db
      .from('canteen_items')
      .insert({
        name,
        price,
        category: category || 'Snacks',
        image_url: image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80',
        is_available: isAvailable ?? true,
        stock_count: 50,
        rating: 4.8,
        rating_count: 1
      })
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.status(201).json({ item: data, message: 'Item added successfully' });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to add canteen item' });
  }
});

// GET /api/canteen/stats - Canteen sales and metrics
router.get('/stats', async (req, res) => {
  try {
    const { data: allOrders } = await db.from('canteen_orders').select('*');
    const orders = allOrders || [];

    const totalOrders = orders.length;
    const completedOrders = orders.filter((o) => o.status === 'COMPLETED');
    const preparingOrders = orders.filter((o) => o.status === 'PREPARING' || o.status === 'PENDING');
    const readyOrders = orders.filter((o) => o.status === 'READY');

    const totalRevenue = orders.reduce((sum, o) => sum + (o.total_amount || 0), 0);

    res.json({
      totalOrders,
      activeQueue: preparingOrders.length + readyOrders.length,
      preparingCount: preparingOrders.length,
      readyCount: readyOrders.length,
      completedCount: completedOrders.length,
      totalRevenue
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch canteen stats' });
  }
});

export default router;
