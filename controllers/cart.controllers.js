import { Product } from "../model/product.model.js";
import { Cart } from '../model/cart.model.js'
import mongoose from "mongoose";

export const addToCart = async (req, res) => {
    try {
        const { productId, quantity = 1 } = req.body;

        if (!productId || quantity <= 0) {
            return res.status(400).json({
                message: 'Product ID and valid quantity are required.',
            });
        }

        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({
                message: 'User not authenticated.',
            });
        }

        const product = await Product.findById(productId).select('price').lean();
        if (!product) {
            return res.status(404).json({
                message: 'Product not found.',
            });
        }

        let cart = await Cart.findOne({ userId });
        if (cart) {
            const existingProduct = cart.products.find(
                (p) => p.productId.toString() === productId
            );

            if (existingProduct) {
                return res.status(400).json({
                    message: 'Product already exists in the cart.',
                });
            }

            // Add new product to the cart
            cart.products.push({ productId, quantity });
            await cart.save();
        } else {
            cart = new Cart({
                userId,
                products: [{ productId, quantity }],
            });
            await cart.save();
        }

        return res.status(200).json({
            message: 'Product added to cart successfully.',
            cart,
        });
    } catch (error) {
        console.error('Error in addToCart:', error);
        return res.status(500).json({
            message: 'Server error occurred while adding product to cart.',
            error: error.message,
        });
    }
};

export const getMyCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const cart = await Cart.aggregate([
            {
                $match: {
                    userId: new mongoose.Types.ObjectId(userId), // Match the userId
                },
            },
            { $unwind: '$products' }, // Unwind the products array
            {
                $lookup: {
                    from: 'products',
                    localField: 'products.productId',
                    foreignField: '_id',
                    as: 'productDetails',
                },
            },
            { $unwind: '$productDetails' },
            {
                $project: {
                    _id: 0,
                    product: {
                        _id: '$productDetails._id',
                        name: '$productDetails.name',
                        price: '$productDetails.price',
                        descriptions: '$productDetails.descriptions',
                        discountPrice: '$productDetails.discountPrice',
                        image: '$productDetails.image',
                        category: '$productDetails.category',
                    },
                    quantity: '$products.quantity',
                },
            },
        ]);

        // const cart = await Cart.find({ userId });
        if (!cart) {
            return res.status(404).json({
                message: 'Cart not found.',
            });
        }

        return res.status(200).json({
            cart,
        });
    } catch (error) {
        console.error('Error in getMyCart:', error);
        return res.status(500).json({
            message: 'Server error occurred while fetching cart.',
            error: error.message,
        });
    }
}

export const updateCartProductQuantity = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const userId = req.user.id;

        if (!productId || quantity < 1) {
            return res.status(400).json({
                message: 'Product ID and valid quantity are required.',
            });
        }

        const cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).json({
                message: 'Cart not found.',
            });
        }

        const productIndex = cart.products.findIndex(
            (p) => p.productId.toString() === productId
        );

        if (productIndex === -1) {
            return res.status(404).json({
                message: 'Product not found in the cart.',
            });
        }

        cart.products[productIndex].quantity = quantity;

        await cart.save();

        return res.status(200).json({
            message: 'Product quantity updated successfully.',
        });
    } catch (error) {
        console.error('Error in updateProductQuantity:', error);
        return res.status(500).json({
            message: 'Server error occurred while updating product quantity.',
            error: error.message,
        });
    }
};

export const removeFromCart = async (req, res) => {
    try {
        const { productId } = req.body;
        const userId = req.user.id;

        if (!productId) {
            return res.status(400).json({
                message: 'Product ID is required.',
            });
        }

        const cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).json({
                message: 'Cart not found.',
            });
        }

        const productIndex = cart.products.findIndex(
            (p) => p.productId.toString() === productId
        );

        if (productIndex === -1) {
            return res.status(404).json({
                message: 'Product not found in the cart.',
            });
        }

        cart.products.splice(productIndex, 1);

        await cart.save();

        return res.status(200).json({
            message: 'Product removed from cart successfully.',
        });
    } catch (error) {
        console.error('Error in removeFromCart:', error);
        return res.status(500).json({
            message: 'Server error occurred while removing product from cart.',
            error: error.message,
        });
    }
};

export const clearCart = async (req, res) => {
    try {
        const userId = req.user.id;

        const cart = await Cart.findOneAndDelete({ userId });

        if (!cart) {
            return res.status(404).json({
                message: 'Cart not found.',
            });
        }

        return res.status(200).json({
            message: 'Cart cleared successfully.',
        });
    } catch (error) {
        console.error('Error in clearCart:', error);
        return res.status(500).json({
            message: 'Server error occurred while clearing cart.',
            error: error.message,
        });
    }
}