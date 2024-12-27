import { Product } from "../model/product.model.js";

export const addProduct = async (req, res) => {
    try {
        const {
            name,
            price,
            discountPrice,
            images,
            category,
            description,
            metaDescription,
            metaTitle,
            pincode,
            address,
            productSku,
            quantity,
            taxPercentage,
        } = req.body;

        console.log(
            name,
            price,
            discountPrice,
            images,
            category,
            description,
            metaDescription,
            metaTitle,
            pincode,
            address,
            productSku,
            quantity,
            taxPercentage,
        )
        
        if (
            !name ||
            !price ||
            !discountPrice ||
            !images ||
            !category ||
            !description ||
            !metaDescription ||
            !metaTitle ||
            !pincode ||
            !address ||
            !productSku ||
            !quantity ||
            !taxPercentage
        ) {
            return res.status(400).json({ message: "All fields are required" });
        }

        
        const newProduct = new Product({
            userId: req.user.id,
            name,
            price,
            discountPrice,
            images,
            category,
            description,
            metaDescription,
            metaTitle,
            pincode,
            address,
            productSku,
            quantity,
            taxPercentage,
        });

        await newProduct.save();

        return res.status(200).json({
            message: "Product added successfully",
            product: newProduct,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error in adding product",
            error: error.message,
        });
    }
};

export const updateProduct = async (req, res) => {
    try {
        const productId = req.query.productId;
        const { data } = req.body;

        if (!productId) {
            return res.status(400).json({
                message: "Product ID is required",
            });
        }

        const updatedProduct = await Product.findOneAndUpdate(
            { userId: req.user.id, _id: productId },
            { $set: { ...data } },
            { new: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        return res.status(200).json({
            message: "Product updated successfully",
            product: updatedProduct,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error in updating product",
            error: error.message,
        });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const productId = req.query.productId;

        if (!productId) {
            return res.status(400).json({ message: "Product ID is required" });
        }

        const deletedProduct = await Product.findByIdAndDelete(productId);

        if (!deletedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        return res.status(200).json({
            message: "Product deleted successfully",
            product: deletedProduct,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error in deleting product",
            error: error.message,
        });
    }
};

export const getSearchProduct = async (req, res) => {
    try {
        const { s } = req.query;

        if (!s || !s.length) {
            return res.status(400).json({
                message: "Search query is required",
            });
        }

        const productDoc = await Product.find({
            name: { $regex: `${s}`, $options: "i" },
        });

        if (!productDoc || productDoc.length === 0) {
            return res.status(404).json({
                message: "No product found.",
            });
        }

        res.status(200).json({
            products: productDoc,
        });
    } catch (error) {
        res.status(400).json({
            message: error.message || "Server error in fetching products",
        });
    }
};

export const getFilterProduct = async (req, res) => {
    const { categories, sort, minPrice, maxPrice, page = 1, limit = 10 } = req.body;

    try {
        let query = {};

        if (categories && categories.length > 0) {
            query.category = { $in: categories };
        }

        if (minPrice) {
            query.discountPrice = { ...query.discountPrice, $gte: Number(minPrice) };
        }
        if (maxPrice) {
            query.discountPrice = { ...query.discountPrice, $lte: Number(maxPrice) };
        }

        let sortCriteria = {};
        if (sort === "new-arrivals") {
            sortCriteria.createdAt = -1;
        } else if (sort === "price-high-to-low") {
            sortCriteria.discountPrice = -1;
        } else if (sort === "price-low-to-high") {
            sortCriteria.discountPrice = 1;
        }

        const skip = (Number(page) - 1) * Number(limit);

        const products = await Product.find(query)
            .sort(sortCriteria)
            .skip(skip)
            .limit(Number(limit))
            .select("-createdAt -updatedAt");

        const total = await Product.countDocuments(query);

        return res.status(200).json({
            products,
            total,
            page: Number(page),
            totalPages: Math.ceil(total / Number(limit)),
        });
    } catch (error) {
        return res.status(500).json({ message: error.message || "Failed to fetch products." });
    }
};

export const getProductDetails = async (req, res) => {
    try {
        const { productId } = req.query;

        if (!productId) {
            return res.status(400).json({ message: "Product ID is required" });
        }

        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        return res.status(200).json({ product });
    } catch (error) {
        return res.status(500).json({ message: "Failed to fetch product details" });
    }
};

export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find({}).select("-createdAt -updatedAt").populate(
            "userId", 
            "firstName lastName role email"
        );

        if (!products || products.length === 0) {
            return res.status(404).json({ message: "No products found" });
        }

        return res.status(200).json({ 
            message: "All  products is successfully fetched",
            data: products 
        });
    } catch (error) {
        return res.status(500).json({ message: "Failed to fetch products" });
    }
}