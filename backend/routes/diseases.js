const express = require('express'); // Add this line
const router = express.Router()
const Disease = require('../models/dieseaeModel')

// const requireAuth = require('../middleware/requireAuth')
// router.use(requireAuth);

router.get('/details/', async (req, res) => {
    // console.log("🟡 /api/diseases/details route hit!");
    const idName = req.query.name;
    // console.log("🔍 Looking for disease with name:", idName);
    try {
        const disease = await Disease.findOne({idName: idName});
        
        if (!disease) {
            // console.log("❌ Disease not found for:", idName);
            return res.status(404).json({ message: 'Disease not found' });
        }

        res.status(200).json(disease);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
})

module.exports = router