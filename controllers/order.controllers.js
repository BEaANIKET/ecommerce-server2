// controllers/orderController.js

import { Order } from "../model/order.model.js";
import { Product } from "../model/product.model.js";

// Create an order
export const createOrder = async (req, res) => {
    const { products, totalAmount, selectedAddress, paymentMethod, paymentId, pamentStatus } = req.body;
    console.log(products, totalAmount, selectedAddress, paymentMethod, paymentId, pamentStatus);

    if (!products || !totalAmount || !selectedAddress || !paymentMethod || !pamentStatus) {
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
            pamentStatus
        });

        await order.save();

        // Optional: Update stock for the products
        for (const product of products) {
            await Product.findByIdAndUpdate(product.productId, {
                $inc: { stock: -product.quantity },
            });
        }

        res.status(201).json({
            success: true,
            message: "Order created successfully",
            data: order,
        });
    } catch (error) {
        console.error("Error creating order: ", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const getOrderById = async (req, res) => {
    const { id } = req.query;

    try {
        const order = await Order.findById(id).populate("products.productId");

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
        const orders = await Order.find().populate("products.productId").sort({ orderDate: -1 });
        res.status(200).json({ success: true, data: orders });
    } catch (error) {
        console.error("Error fetching orders: ", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
