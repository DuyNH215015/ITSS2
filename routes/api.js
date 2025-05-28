require("express-router-group");
const express = require("express");
const middlewares = require("kernels/middlewares");
const { validate } = require("kernels/validations");
const exampleController = require("modules/examples/controllers/exampleController");
const videoCallController = require("../modules/videoCall/controllers/videoController")
const matchController = require("../modules/videoCall/controllers/matchController")
const searchPartnerController = require("../modules/searchPartner/controllers/searchController")
const router = express.Router({ mergeParams: true });
const userController = require("../modules/user/controllers/userControllers"); 

// ===== EXAMPLE Request, make this commented =====
// router.group("/posts",middlewares([authenticated, role("owner")]),(router) => {
//   router.post("/create",validate([createPostRequest]),postsController.create);
//   router.put("/update/:postId",validate([updatePostRequest]),postsController.update);
//   router.delete("/delete/:postId", postsController.destroy);
// }
// );

router.group("/example", validate([]), (router) => {
  router.get('/', exampleController.exampleRequest)
})

// tạo phòng gọi
router.post('/videocall/create-room', videoCallController.createRoom);  // bỏ 

router.post("/videocall/join-room/:videosession_id", videoCallController.joinRoom);  // bỏ 

// tìm kiếm partner theo nhiều yếu tố

router.post("/search-partner/:userId", searchPartnerController.searchPartner);   // bỏ
router.get("/search-partner/:userId", searchPartnerController.resultSearchPartner); // bỏ

router.post('/match-or-join', matchController.matchOrJoin);   // dùng duy nhất 1 api này để thực hiện gọi

router.post('/users/register', userController.createUser); 

module.exports = router;