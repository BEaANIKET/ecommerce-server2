

export const asyncHandler = async (fn) => {
    try {
        return await fn();
    } catch (error) {
        console.error(error);
        return {
            status: 500,
            message: 'Server Error',
        };
    }
}
