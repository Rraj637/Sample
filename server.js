const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/vaypariDB').then(() => {
    console.log('Database connected to MongoDB (vaypariDB)!');
}).catch((err) => {
    console.error('MongoDB connection error. Make sure MongoDB is running locally:', err);
});

// Define Cart Schema
const cartSchema = new mongoose.Schema({
    userId: String,
    productId: String,
    productName: String,
    price: Number,
    img: String,
    quantity: { type: Number, default: 1 }
});

const CartItem = mongoose.model('Cart', cartSchema);

// GET API: Fetch all cart items for a user
app.get('/api/cart', async (req, res) => {
    try {
        const userId = req.query.userId || 'user-123';
        const items = await CartItem.find({ userId });
        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({ error: 'Server error fetching cart' });
    }
});

// POST API: Add item to cart
app.post('/api/add-to-cart', async (req, res) => {
    try {
        const { userId, productId, productName, price, img } = req.body;
        
        let existingItem = await CartItem.findOne({ userId, productId });

        if (existingItem) {
            existingItem.quantity += 1;
            await existingItem.save();
            res.status(200).json({ message: 'Quantity updated!', item: existingItem });
        } else {
            const newItem = new CartItem({ userId, productId, productName, price, img });
            await newItem.save();
            res.status(201).json({ message: 'Added to cart successfully!', item: newItem });
        }

    } catch (error) {
        res.status(500).json({ error: 'Server error adding to cart' });
    }
});

// POST API: Update item quantity
app.post('/api/update-quantity', async (req, res) => {
    try {
        const { userId, productId, action } = req.body;
        
        let existingItem = await CartItem.findOne({ userId, productId });

        if (existingItem) {
            if (action === 'plus') {
                existingItem.quantity += 1;
                await existingItem.save();
            } else if (action === 'minus') {
                existingItem.quantity -= 1;
                if (existingItem.quantity <= 0) {
                    await CartItem.deleteOne({ _id: existingItem._id });
                } else {
                    await existingItem.save();
                }
            }
            res.status(200).json({ message: 'Quantity updated!' });
        } else {
            res.status(404).json({ error: 'Item not found in cart' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Server error updating quantity' });
    }
});

// ==================== ADMIN: PRODUCT MANAGEMENT ====================

const productSchema = new mongoose.Schema({
    name: String,
    price: Number,
    description: String,
    img: String,
    stock: { type: Number, default: 10 }
});
const Product = mongoose.model('Product', productSchema);

// GET API: Fetch all products
app.get('/api/products', async (req, res) => {
    try {
        const products = await Product.find({});
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch products' });
    }
});

// POST API: Add a new product
app.post('/api/products', async (req, res) => {
    try {
        const newProduct = new Product(req.body);
        await newProduct.save();
        res.status(201).json({ message: 'Product added successfully!', product: newProduct });
    } catch (error) {
        res.status(500).json({ error: 'Failed to add product' });
    }
});

// PUT API: Update a product
app.put('/api/products/:id', async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json({ message: 'Product updated!', product: updatedProduct });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update product' });
    }
});

// DELETE API: Delete a product
app.delete('/api/products/:id', async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Product deleted successfully!' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete product' });
    }
});

// ==================== ADMIN: ORDER MANAGEMENT ====================

const orderSchema = new mongoose.Schema({
    userId: String,
    customerName: String,
    items: Array,
    total: Number,
    status: { type: String, default: 'Pending' },
    createdAt: { type: Date, default: Date.now }
});
const Order = mongoose.model('Order', orderSchema);

// GET API: Fetch all orders
app.get('/api/orders', async (req, res) => {
    try {
        const orders = await Order.find({}).sort({ createdAt: -1 });
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
});

// PUT API: Update order status
app.put('/api/orders/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        const updatedOrder = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
        res.status(200).json({ message: 'Order status updated!', order: updatedOrder });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update order status' });
    }
});


const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Backend API running on http://localhost:${PORT}`);
});
