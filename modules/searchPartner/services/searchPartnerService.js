const { Language, Queue, Topic, User, UserLanguage, UserTopic } = require('../../../models');
const { Op } = require('sequelize');

// Service tìm kiếm partner theo nhiều yếu tố, có dùng thuật toán
// Thuật toán tìm kiếm gần giống như Tinder
const searchPartner = async (userId, searchParams)  => {
    // Lấy thông tin user hiện tại
    const currentUser = await User.findByPk(userId, {
        include: [
            { model: UserLanguage, include: [{ model: Language }] },
            { model: UserTopic, include: [{ model: Topic }] }
        ]
    });

    if (!currentUser) return [];

    // Lấy danh sách user khác (trừ user hiện tại)
    const users = await User.findAll({
        where: { user_id: { [Op.ne]: userId } },
        include: [
            { model: UserLanguage, include: [{ model: Language }] },
            { model: UserTopic, include: [{ model: Topic }] }
        ]
    });

    // Lọc theo searchParams (ví dụ: language_id, topic_id, gender, age)
    let filteredUsers = users.filter(user => {
        let match = true;
        if (searchParams.language_id) {
            match = match && user.UserLanguages.some(ul => ul.language_id === searchParams.language_id);
        }
        if (searchParams.topic_id) {
            match = match && user.UserTopics.some(ut => ut.topic_id === searchParams.topic_id);
        }
        if (searchParams.gender) {
            match = match && user.gender === searchParams.gender;
        }
        if (searchParams.age) {
            match = match && user.age === searchParams.age;
        }
        return match;
    });

    // Sắp xếp theo độ tương đồng (ví dụ: số lượng ngôn ngữ hoặc chủ đề chung)
    filteredUsers = filteredUsers.sort((a, b) => {
        const commonLanguagesA = a.UserLanguages.filter(ul =>
            currentUser.UserLanguages.some(cul => cul.language_id === ul.language_id)
        ).length;
        const commonTopicsA = a.UserTopics.filter(ut =>
            currentUser.UserTopics.some(cut => cut.topic_id === ut.topic_id)
        ).length;

        const commonLanguagesB = b.UserLanguages.filter(ul =>
            currentUser.UserLanguages.some(cul => cul.language_id === ul.language_id)
        ).length;
        const commonTopicsB = b.UserTopics.filter(ut =>
            currentUser.UserTopics.some(cut => cut.topic_id === ut.topic_id)
        ).length;

        // Ưu tiên số lượng ngôn ngữ chung, sau đó đến chủ đề chung
        if (commonLanguagesB !== commonLanguagesA) {
            return commonLanguagesB - commonLanguagesA;
        }
        return commonTopicsB - commonTopicsA;
    });

    return filteredUsers;
}

const resultSearchPartner = async (userId, searchParams) => {
    // Gọi hàm searchPartner để lấy danh sách partner phù hợp
    const partners = await searchPartner(userId, searchParams);
    // Trả về danh sách partner (có thể thêm thông tin chi tiết nếu cần)
    return partners.map(user => ({
        user_id: user.user_id,
        username: user.username,
        gender: user.gender,
        age: user.age,
        languages: user.UserLanguages.map(ul => ul.Language?.language_name),
        topics: user.UserTopics.map(ut => ut.Topic?.topic_name)
    }));
}

module.exports = {
    searchPartner,
    resultSearchPartner
};
