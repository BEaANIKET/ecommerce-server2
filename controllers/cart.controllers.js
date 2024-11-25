import { Product } from "../model/product.model.js";
import { Cart } from '../model/cart.model.js'

// Add product to the cart
export const addToProduct = async (req, res) => {
    try {
        const { productId, quantity } = req.body;

        // Validate input
        if (!productId || !quantity || quantity <= 0) {
            return res.status(400).json({
                message: 'Product ID and valid quantity are required.',
            });
        }

        const userId = req.user.id;

        const product = await Product.findById(productId).select('price').lean();
        if (!product) {
            return res.status(404).json({
                message: 'Product not found.',
            });
        }

        const existingCart = await Cart.findOne({ userId });
        if (existingCart) {
            const existingProduct = existingCart.products.find(
                (p) => p.productId.toString() === productId
            );

            if (existingProduct) {
                return res.status(400).json({
                    message: 'Product already exists in the cart.',
                });
            }

            existingCart.products.push({ productId, quantity });
            await existingCart.save();
        } else {
            const newCart = new Cart({
                userId,
                products: [{ productId, quantity }],
            });

            await newCart.save();
        }

        return res.status(200).json({
            message: 'Product added to cart successfully.',
        });
    } catch (error) {
        console.error('Error in addToProduct:', error);
        return res.status(500).json({
            message: 'Server error occurred while adding product to cart.',
            error: error.message,
        });
    }
};

export const updateProductQuantity = async (req, res) => {
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
