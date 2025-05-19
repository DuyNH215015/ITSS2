const { Language, Queue, Topic, User, UserLanguage, UserTopic } = require('../../../models');

// Service tìm kiếm partner theo nhiều yếu tố, có dùng thuật toán
// Thuật toán tìm kiếm gần giống như Tinder
const searchPartner = async (userId, searchParams)  => {
    // Lấy thông tin user hiện tại
    const currentUser = await User.findByPk(userId, {
        include: [
            { model: UserLanguage, include: [Language] },
            { model: UserTopic, include: [Topic] }
        ]
    });

    if (!currentUser) return [];

    // Lấy danh sách user khác (trừ user hiện tại)
    const users = await User.findAll({
        where: { id: { [require('sequelize').Op.ne]: userId } },
        include: [
            { model: UserLanguage, include: [Language] },
            { model: UserTopic, include: [Topic] }
        ]
    });

    // Lọc theo searchParams (ví dụ: language, topic, gender, age)
    let filteredUsers = users.filter(user => {
        let match = true;
        if (searchParams.language) {
            match = match && user.UserLanguages.some(ul => ul.Language.code === searchParams.language);
        }
        if (searchParams.topic) {
            match = match && user.UserTopics.some(ut => ut.Topic.code === searchParams.topic);
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
            currentUser.UserLanguages.some(cul => cul.LanguageId === ul.LanguageId)
        ).length;
        const commonTopicsA = a.UserTopics.filter(ut =>
            currentUser.UserTopics.some(cut => cut.TopicId === ut.TopicId)
        ).length;

        const commonLanguagesB = b.UserLanguages.filter(ul =>
            currentUser.UserLanguages.some(cul => cul.LanguageId === ul.LanguageId)
        ).length;
        const commonTopicsB = b.UserTopics.filter(ut =>
            currentUser.UserTopics.some(cut => cut.TopicId === ut.TopicId)
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
        id: user.id,
        name: user.name,
        gender: user.gender,
        age: user.age,
        languages: user.UserLanguages.map(ul => ul.Language.name),
        topics: user.UserTopics.map(ut => ut.Topic.name)
    }));
}

module.exports = {
    searchPartner,
    resultSearchPartner
};