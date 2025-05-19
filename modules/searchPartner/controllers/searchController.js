const searchPartnerService = require('../services/searchPartnerService');

// Controller để tìm kiếm partner theo nhiều yếu tố (trả về danh sách user thô)
const searchPartner = async (req, res) => {
    const { userId } = req.params;
    const searchParams = req.body;

    try {
        // userId từ params là string, cần chuyển về số cho đúng với model
        const result = await searchPartnerService.searchPartner(Number(userId), searchParams);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Controller trả về danh sách partner đã format (chỉ trả về thông tin cần thiết)
const resultSearchPartner = async (req, res) => {
    const { userId } = req.params;
    const searchParams = req.body;

    try {
        // userId từ params là string, cần chuyển về số cho đúng với model
        const result = await searchPartnerService.resultSearchPartner(Number(userId), searchParams);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = {
    searchPartner,
    resultSearchPartner
};
