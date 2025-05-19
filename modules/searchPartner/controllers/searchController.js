const searchPartnerService = require('../services/searchPartnerService');

// Controller để tìm kiếm partner theo nhiều yếu tố
const searchPartner = async (req, res) => {
    const { userId } = req.params;
    const searchParams = req.body;

    try {
        const result = await searchPartnerService.searchPartner(userId, searchParams);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const resultSearchPartner = async (req, res) => {
    const { userId } = req.params;
    const searchParams = req.body;

    try {
        const result = await searchPartnerService.resultSearchPartner(userId, searchParams); // Sửa lại dòng này
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = {
    searchPartner,
    resultSearchPartner // Thêm export nếu muốn dùng ngoài router
};
