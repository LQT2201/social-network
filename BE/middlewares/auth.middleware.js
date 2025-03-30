const JWT = require("jsonwebtoken");
const { AuthFailureError } = require("../core/error.response");
const KeyTokenService = require("../services/keyToken.service");
const User = require("../models/user.model");

const HEADER = {
  CLIENT_ID: "x-client-id", // Đây là header để lấy userId
  AUTHORIZATION: "authorization", // Header để lấy token
};

const authentication = async (req, res, next) => {
  try {
    // 1. Kiểm tra sự tồn tại của userId trong headers
    const userId = req.headers[HEADER.CLIENT_ID];
    if (!userId) {
      throw new AuthFailureError("Missing userId in request headers");
    }

    // 2. Kiểm tra xem có keyStore cho userId này không
    const keyStore = await KeyTokenService.findByUserId(userId);
    if (!keyStore) {
      throw new AuthFailureError("Not found keyStore for userId");
    }

    // 3. Lấy access token từ headers
    const authHeader = req.headers[HEADER.AUTHORIZATION];

    const accessToken = authHeader.split(" ")[1];

    if (!accessToken) {
      throw new AuthFailureError("Invalid request: no access token provided");
    }

    // 4. Xác minh token với publicKey của keyStore
    const decodedUser = JWT.verify(accessToken, keyStore.publicKey);

    if (!decodedUser) {
      throw new AuthFailureError("Invalid access token");
    }

    // 5. Kiểm tra userId từ token có khớp với userId trong request không
    if (userId !== decodedUser.userId) {
      throw new AuthFailureError("Invalid userId in token");
    }

    // 6. Nếu tất cả đúng, lưu keyStore vào request để sử dụng tiếp
    req.userId = userId;

    // 7. Tiếp tục xử lý request
    return next();
  } catch (error) {
    // Xử lý lỗi và chuyển tiếp tới middleware lỗi
    next(error);
  }
};

module.exports = authentication;
