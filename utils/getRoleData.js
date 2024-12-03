export const getRoleData= async(dbModel,id) => {
    try{
        const data= await dbModel.find({userId: id})
        return {
            message: 'successfully fetched.',
            data: data,
            status: 200
        };
    }catch(error){
        return {
            message: 'successfully fetched.',
            data:  error.message || "Server error occurred while fetching verified users.",
            status: 500
        };
    }
}