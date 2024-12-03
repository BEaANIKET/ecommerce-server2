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
        const orders = await Order.aggregate([
            // Match orders for the logged-in user
            { $match: { userId: req.user.id } },

            // Sort by order date in descending order
            { $sort: { orderDate: -1 } },

            // Lookup to populate product details
            {
                $lookup: {
                    from: "products", // Name of the products collection
                    localField: "products.productId",
                    foreignField: "_id",
                    as: "productDetails",
                },
            },

            // Unwind products to merge details with their respective quantity
            { $unwind: "$products" },

            // Lookup the matching product details
            {
                $lookup: {
                    from: "products",
                    localField: "products.productId",
                    foreignField: "_id",
                    as: "productData",
                },
            },

            // Unwind the product data for easier manipulation
            { $unwind: "$productData" },

            // Group back orders by their _id, and aggregate product details
            {
                $group: {
                    _id: "$_id",
                    orderDate: { $first: "$orderDate" },
                    totalAmount: { $first: "$totalAmount" },
                    products: {
                        $push: {
                            name: "$productData.name",
                            image: "$productData.image",
                            price: "$productData.price",
                            quantity: "$products.quantity",
                        },
                    },
                },
            },

            // Project the final structure
            {
                $project: {
                    _id: 1,
                    orderDate: 1,
                    totalAmount: 1,
                    products: 1,
                },
            },
        ]);

        res.status(200).json({ success: true, data: orders });
    } catch (error) {
        console.error("Error fetching orders: ", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

