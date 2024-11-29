import { Product } from "../model/product.model.js";

export const addProduct = async (req, res) => {
    try {
        const { userId, name, price, discountPrice, image, category } = req.body;

        if (!userId || !name || !price || !discountPrice || !image || !category) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const newProduct = await Product({
            userId,
            name,
            price,
            discountPrice,
            image,
            category,
        });

        await newProduct.save()

        if (!newProduct) {
            return res.status(500).json({ message: "Failed to add product" });
        }

        return res.status(200).json({
            message: "Product added successfully",
            product: newProduct,
        })

    } catch (error) {
        return res.status(500).json(
            {
                message: 'Error in adding product',
                error: error.message,
            }
        )
    }
}

export const updateProduct = async (req, res) => {
    try {
        const { data } = req.body;

        const productId = req.query.productId;

        if (!productId) {
            return res.status(400).json({
                message: 'productId is required'
            })
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
        })
    } catch (error) {
        return res.status(500).json({
            message: 'Error in updating product',
            error: error.message,
        })
    }
}

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
        })
    } catch (error) {
        return res.status(500).json({
            message: 'Error in deleting product',
            error: error.message,
        })
    }
}

export const getSearchProduct = async (req, res) => {
    try {
        const { s } = req.query;

        if (!s || !s.length) {
            return res.status(400).json({
                message: 'Search query is required'
            });
        }
        const productDoc = await Product.find(
            { name: { $regex: `${s}`, $options: 'i' } }
        );

        if (productDoc.length < 0) {
            return res.status(404).json({
                message: 'No product found.'
            });
        }

        res.status(200).json({
            products: productDoc
        });
    } catch (error) {
        res.status(400).json({
            message: error.message || "server error in fetching product"
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
            .limit(Number(limit));

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
}

