

export const ApiResponse = (status = '', message = '', data = {}) => {
    return {
        status,
        message,
        data,
    };
}