import { UserRequest } from "../model/request.model.js"
import { User } from "../model/user.model.js";


export const createRequest = async (req, res) => {

    try {

        if (!req.user || !req.user.id) {
            return res.status(400).json({
                message: 'User ID is required to create a Pandit request',
            });
        }

        const { state } = await req.body;

        const createdRequest = new UserRequest(
            {
                userId: req.user.id,
                state
            }
        )

        await createdRequest.save();


        return res.status(201).json({
            message: 'Request created successfully',
            panditRequest: createdRequest,
        });

    } catch (error) {
        return res.status(500).json(
            {
                message: 'Failed to create request try again',
                error: error.message,
            }
        )
    }
}

export const updateRequest = async (req, res) => {
    try {
        const { state, userId } = req.body;

        if (!state) {
            return res.status(400).json({
                message: "State is required to update Pandit request",
            });
        }

        const updatedPandit = await User.findByIdAndUpdate(
            userId,
            { $set: { role: state } },
            { new: true }
        );

        if (!updatedPandit) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        return res.status(200).json({
            message: "Pandit request updated successfully",
            updatedPandit,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Failed to update Pandit request",
            error: error.message,
        });
    }
};

