const crypto = require("node:crypto");
const bcrypt = require("bcrypt"); // Import bcrypt
const User = require("../models/user.model");
const { createTokenPair, verifyJWT } = require("../utils/auth.util");
const { getInfoData } = require("../utils/getInfoData");
const KeyTokenService = require("./keyToken.service");
const {
  BadRequestError,
  ForbiddenError,
  AuthFailureError,
} = require("../core/error.response");

// Hàm băm mật khẩu sử dụng bcrypt
const hashPassword = async (password) => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

// Hàm so sánh mật khẩu người dùng nhập với hash lưu trong DB
const verifyPassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};

class AuthService {
  /**
   * Đăng ký người dùng mới
   */
  static signUp = async ({ username, email, password }) => {
    // Kiểm tra email và username có tồn tại hay không
    const checkEmail = await User.findOne({ email }).lean();
    const checkUserName = await User.findOne({ username }).lean();

    if (checkUserName) {
      throw new Error("Username đã tồn tại");
    }
    if (checkEmail) {
      throw new Error("Email đã tồn tại");
    }

    // Sử dụng bcrypt để băm mật khẩu
    const hashedPassword = await hashPassword(password);
    console.log("Hashed password:", hashedPassword);

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    if (newUser) {
      // Tạo cặp khóa (private/public) để tạo token
      const privateKey = crypto.randomBytes(64).toString("hex");
      const publicKey = crypto.randomBytes(64).toString("hex");

      const keyStore = await KeyTokenService.createKeyToken({
        userId: newUser._id,
        publicKey,
        privateKey,
      });

      if (!keyStore) {
        throw new Error("Key store error");
      }

      // Tạo token pair
      const tokens = await createTokenPair(
        { userId: newUser._id, email },
        publicKey,
        privateKey
      );

      return {
        code: 201,
        metadata: {
          user: getInfoData({
            fields: ["_id", "username", "email"],
            object: newUser,
          }),
          tokens,
        },
      };
    }

    return {
      code: 200,
      metadata: null,
    };
  };

  /**
   * Đăng nhập
   * 1. Kiểm tra email có tồn tại
   * 2. So sánh mật khẩu bằng bcrypt
   * 3. Tạo token và lưu vào keyStore
   * 4. Trả về thông tin người dùng cùng token
   */
  static signIn = async ({ email, password }) => {
    const user = await User.findOne({ email });
    if (!user) {
      throw new AuthFailureError("Email chưa đăng ký tài khoản");
    }

    // So sánh mật khẩu bằng bcrypt
    const isMatch = await verifyPassword(password, user.password);
    if (!isMatch) {
      throw new AuthFailureError("Sai mật khẩu");
    }

    // Tạo cặp khóa mới cho phiên đăng nhập
    const privateKey = crypto.randomBytes(64).toString("hex");
    const publicKey = crypto.randomBytes(64).toString("hex");
    const { _id: userId } = user;
    const tokens = await createTokenPair(
      { userId, email },
      publicKey,
      privateKey
    );

    const keyStore = await KeyTokenService.createKeyToken({
      userId,
      publicKey,
      privateKey,
      refreshToken: tokens.refreshToken,
    });

    if (!keyStore) {
      throw new Error("Key store error");
    }

    return {
      user: getInfoData({
        fields: ["_id", "username", "email"],
        object: user,
      }),
      tokens,
    };
  };

  /**
   * Đăng xuất
   * Xóa keyStore liên quan đến user
   */
  static logOut = async (userId) => {
    const keyStore = await KeyTokenService.findByUserId(userId);
    if (!keyStore) throw new BadRequestError("Not found keyStore with userId");
    const delKey = await KeyTokenService.removeKeyById(keyStore._id);
    console.log("Deleted keyStore:", delKey);
    return delKey;
  };

  /**
   * Làm mới token (refresh token)
   */
  static handleRefreshToken = async (refreshToken) => {
    // 1. Kiểm tra refreshToken đã được sử dụng chưa
    const foundToken = await KeyTokenService.findByRefreshTokenUsed(
      refreshToken
    );
    if (foundToken) {
      const { userId, email } = await verifyJWT(
        refreshToken,
        foundToken.privateKey
      );
      await KeyTokenService.deleteKeyByUserId(userId);
      throw new ForbiddenError("Something went wrong !! Please login again");
    }

    // 2. Xác thực refreshToken
    const holderToken = await KeyTokenService.findByRefreshToken(refreshToken);
    if (!holderToken) throw new AuthFailureError("Invalid refreshToken");

    const { userId, email } = await verifyJWT(
      refreshToken,
      holderToken.privateKey
    );

    // 3. Tạo token mới
    const foundUser = await User.findOne({ email }).lean();
    if (!foundUser) throw new AuthFailureError("User not registered");

    const tokens = await createTokenPair(
      { userId, email },
      holderToken.publicKey,
      holderToken.privateKey
    );

    // 4. Cập nhật keyStore: lưu refreshToken mới và thêm refreshToken đã dùng
    await holderToken.updateOne({
      $set: { refreshToken: tokens.refreshToken },
      $addToSet: { refreshTokenUsed: refreshToken },
    });

    return {
      user: getInfoData({
        fields: ["_id", "username", "email"],
        object: foundUser,
      }),
      tokens,
    };
  };

  /**
   * Xử lý đăng nhập qua Google
   */
  static async googleCallback(user) {
    if (!user) {
      throw new Error("Đăng nhập Google thất bại");
    }

    // Tạo cặp khóa mới
    const privateKey = crypto.randomBytes(64).toString("hex");
    const publicKey = crypto.randomBytes(64).toString("hex");
    const { _id: userId, email } = user;

    // Tạo token pair
    const tokens = await createTokenPair(
      { userId, email },
      publicKey,
      privateKey
    );

    const keyStore = await KeyTokenService.createKeyToken({
      userId,
      publicKey,
      privateKey,
      refreshToken: tokens.refreshToken,
    });

    if (!keyStore) {
      throw new Error("Key store error");
    }

    return {
      user: getInfoData({
        fields: ["_id", "username", "email"],
        object: user,
      }),
      tokens,
    };
  }
}

module.exports = AuthService;
