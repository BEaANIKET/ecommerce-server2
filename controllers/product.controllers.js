
export const addProduct = async (req, res) => {
    try {

    } catch (error) {
        return res.status(500).json(
            {
                message: 'Error in adding product',
                error: error.message,
            }
        )
    }
}