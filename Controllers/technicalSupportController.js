const TechnicalSupport = require('../Models/technicalSupportModel')

// Create a new technical support ticket
exports.createTicket = async (req, res) => {
    try {
        const { clientId, firstname, lastname, batchno, emailId, issuedate, closedate, status } = req.body;
        const newTicket = new TechnicalSupport({
            clientId,
            firstname,
            lastname,
            batchno,
            emailId,
            issuedate: new Date(issuedate), // Ensure the date is stored as Date type
            closedate: new Date(closedate), // Ensure the date is stored as Date type
            status
        });
        await newTicket.save();
        res.status(201).json({
            success:true,
            message:"Ticket created successfully",newTicket});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all technical support tickets
exports.getTickets = async (req, res) => {
    try {
        const tickets = await TechnicalSupport.find();
        res.status(200).json({
            success:true,
            message:"Tickets fetched successfully",tickets});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get a specific technical support ticket by ID
exports.getTicketById = async (req, res) => {
    try {
        const ticket = await TechnicalSupport.findById(req.params.id);
        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }
        res.status(200).json({
            success:true,
            message:"Ticket fetched successfully",ticket});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update a technical support ticket by ID
exports.updateTicket = async (req, res) => {
    try {
        const { clientId, firstname, lastname, batchno, emailId, issuedate, closedate, status } = req.body;
        const ticket = await TechnicalSupport.findByIdAndUpdate(req.params.id, {
            clientId,
            firstname,
            lastname,
            batchno,
            emailId,
            issuedate: new Date(issuedate), // Ensure the date is stored as Date type
            closedate: new Date(closedate), // Ensure the date is stored as Date type
            status
        }, { new: true });
        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }
        res.status(200).json({
            success:true,
            message:"Ticket updated successfully",ticket});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update only the status of a technical support ticket by ID
exports.updateTicketStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const ticket = await TechnicalSupport.findByIdAndUpdate(req.params.id, {
            status
        }, { new: true });
        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }
        res.status(200).json({
            success: true,
            message: "Ticket status updated successfully", ticket
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete a technical support ticket by ID
exports.deleteTicket = async (req, res) => {
    try {
        const ticket = await TechnicalSupport.findByIdAndDelete(req.params.id);
        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }
        res.status(200).json({
            success:true,
            message:"Ticket deleted successfully"});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.closeTicket = async (req, res) =>{
    try {
        const ticket = await TechnicalSupport.findByIdAndUpdate(req.params.id, {
            status: "Closed",
            closedate: new Date()
        }, { new: true });
        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }
        res.status(200).json({
            success:true,
            message:"Ticket closed successfully",ticket});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}