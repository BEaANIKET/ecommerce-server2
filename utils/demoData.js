export const demoData= () => {
    const sellers= [
        {
            id: '234567',
            name: 'ajay b.v',
        },
        {
            id: '456554',
            name: 'vikas Raj',
        },
        {
            id: '567383',
            name: 'murli yadav',
        }
    ]

    const amount= [
        {
            sellerId: '234567',
            amount: '$456.12'
        },
        {
            sellerId: '567383',
            amount: '$256.02'
        },
        {
            sellerId: '456554',
            amount: '$335.25'
        }
    ]

    const products= [
        {
            productId: '234',
            sellerId: '456554',
            status: 'delivered'
        },
        {
            productId: '345',
            sellerId: '567383',
            status: 'not delivered'
        },
        {
            productId: '234',
            sellerId: '567383',
            status: 'delivered'
        }
    ]

    return({
        sellers,
        amount,
        products
    });
}