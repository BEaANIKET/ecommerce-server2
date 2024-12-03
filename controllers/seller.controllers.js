import { demoData } from "../utils/demoData.js"

export const getSellerInfo= (req, res) => {
    const { id }= req.params;
    const datas= demoData()
    console.log(id);
    console.log(datas);    

    const seller= datas.sellers.find((data) => {
        return data.id==id
    })
    console.log(seller)
    if(seller) {
        const amount= datas.amount.find((data) => {
            return data.sellerId===id
        });
    
        const products= datas.products.filter((data) => {
            return data.sellerId===id
        })
        console.log(seller, amount, products)
        res.json({
            seller, amount, products
        })
    }else{
        res.json({message: 'error'});
    }
}