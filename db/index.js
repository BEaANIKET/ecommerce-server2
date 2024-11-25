import mongoose from "mongoose";

const MAX_RETRIES = 3;
const RETRY_DELAY = 3000;

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const dbConnect = async () => {
    let attempts = 0;

    while (attempts < MAX_RETRIES) {
        try {
            await mongoose.connect(process.env.MONGODB_URI);
            break;
        } catch (error) {
            attempts += 1;
            console.error(`Error connecting to MongoDB (Attempt ${attempts}/${MAX_RETRIES}):`, error.message);

            if (attempts < MAX_RETRIES) {
                console.log(`Retrying in ${RETRY_DELAY / 1000} seconds...`);
                await sleep(RETRY_DELAY);
            } else {
                console.error("Failed to connect to MongoDB after maximum retries.");
            }
        }
    }
};
