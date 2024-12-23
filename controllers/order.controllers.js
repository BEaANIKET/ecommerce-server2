// controllers/orderController.js

import { Order } from "../model/order.model.js";
import { Product } from "../model/product.model.js";


// Create an order
export const createOrder = async (req, res) => {
    const { products, totalAmount, selectedAddress, paymentMethod, paymentId } = req.body;
    console.log(products, totalAmount, selectedAddress, paymentMethod, paymentId);

    if (!products || !totalAmount || !selectedAddress || !paymentMethod) {
        return res.status(400).json({ error: "All fields are required" });
    }

    const productDetails = await Product.find({ "_id": { $in: products.map(p => p.productId) } });

    if (!productDetails.length) {
        return res.status(400).json({ error: "Some products are not available" });
    }

    // Create the order
    try {
        const order = new Order({
            userId: req.user.id,
            products,
            totalAmount,
            selectedAddress,
            paymentMethod,
            paymentId,
        });

        await order.save();

        res.status(201).json({
            message: "Order created successfully",
            data: order,
        });
    } catch (error) {
        console.error("Error creating order: ", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const getOrderByUserid = async (req, res) => {
    const { id } = req.user;

    try {
        const order = await Order.find({
            userId: id
        }).select('-products.taxPercentage -products.productSku');

        if (!order) {
            return res.status(404).json({ error: "Order not found" });
        }

        res.status(200).json({ success: true, data: order });
    } catch (error) {
        console.error("Error fetching order: ", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Get all orders (for admin or user dashboard)
export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate({
            path: 'userId',
            select: 'firstName lastName email',
        })

        res.status(200).json({ success: true, data: orders });
    } catch (error) {
        console.error("Error fetching orders: ", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};