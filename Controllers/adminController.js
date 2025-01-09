const Admin = require('../Models/adminModel');
const bcrypt = require('bcrypt')

exports.createAdmin = async (req,res) =>{
    try {
        const {Name, email, password} = req.body;
        const requiredFields = ["Name", "email", "password"];
        const missingFields = requiredFields.filter(field => !req.body[field]);

        if (missingFields.length > 0) {
            return res.status(400).json({
                success: false,
                message: `${missingFields.join(", ")} is/are required`
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const admin = await Admin.create({Name,email, password:hashedPassword, role:"Admin"})
        res.status(200).json({
            success:true,
            message:"Admin Successfully Created",
            admin
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            success:false,
            message:"Error creating Admin"
        })
    }
}


exports.getAdmin = async(req, res) =>{
    try {
        const admin = await Admin.find();
        if(!admin){
            res.status(404).json({
                success:false
            })
        }
        res.status(200).json({
            success:true,
            message:"Successfully Fetched Admin",
            admin
        })
    } catch (error) {
        
    }
}