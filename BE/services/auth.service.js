const crypto = require("node:crypto");
const User = require("../models/user.model");
const { createTokenPair, verifyJWT } = require("../utils/auth.util");
const { getInfoData } = require("../utils/getInfoData");
const KeyTokenService = require("./keyToken.service");
const {
  BadRequestError,
  ForbiddenError,
  AuthFailureError,
} = require("../core/error.response");

const encryptPassword = (password) => {
  return new Promise((resolve, reject) => {
    const iv = crypto.randomBytes(16); // IV ngẫu nhiên 16 byte
    const key = crypto.scryptSync("mypassword", "salt", 16); // Tạo khóa từ passphrase (mypassword) - Khóa phải có độ dài 16 byte cho AES-128
    const cipher = crypto.createCipheriv("aes-128-cbc", key, iv); // Tạo cipher với IV và key

    let encrypted = cipher.update(password, "utf8", "hex");
    encrypted += cipher.final("hex");

    resolve(`${iv.toString("hex")}:${encrypted}`);
  });
};

const decryptPassword = (encryptedPassword) => {
  return new Promise((resolve, reject) => {
    // Tách IV và mật khẩu mã hóa
    const [ivHex, encryptedData] = encryptedPassword.split(":");
    const iv = Buffer.from(ivHex, "hex");

    // Tạo khóa từ passphrase sử dụng scryptSync (đảm bảo độ dài 16 byte cho AES-128)
    const key = crypto.scryptSync("mypassword", "salt", 16);

    // Tạo đối tượng Decipher
    const decipher = crypto.createDecipheriv("aes-128-cbc", key, iv);

    let decrypted = decipher.update(encryptedData, "hex", "utf8");
    decrypted += decipher.final("utf8"); // Hoàn tất quá trình giải mã

    resolve(decrypted); // Trả về mật khẩu đã giải mã
  });
};

class AuthService {
  static signUp = async ({ username, email, password }) => {
    // Check mail and user name exist ??
    const checkEmail = await User.findOne({ email }).lean();
    const checkUserName = await User.findOne({ username }).lean();

    if (checkUserName) {
      throw new Error("Username đã tồn tại");
    }

    if (checkEmail) {
      throw new Error("Email đã tồn tại");
    }

    const hashedPassword = await encryptPassword(password);

    console.log(hashedPassword);

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    if (newUser) {
      // Create private and public key
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

      // create token
      const tokens = await createTokenPair(
        { userId: newUser._id, email },
        publicKey,
        privateKey
      );

      return {
        code: 201,
        metadata: {
          user: getInfoData({
            fileds: ["_id", "username", "email"],
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

  /*
    1 - Check email in dbs
    2 - Match password
    3 - Create AT and RT, save it
    4 - Generates tokens and save into keyStore
    5 - Get data return login
  */
  static signIn = async ({ email, password }) => {
    const user = await User.findOne({ email });

    if (!user) {
      throw new Error("Email chưa đăng ký tài khoản");
    }

    const encryptedPassword = user.password;
    const decPassword = await decryptPassword(encryptedPassword);
    if (password !== decPassword) throw new Error("Sai mật khẩu");

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
      throw new Error("keyStore eror");
    }

    return {
      code: 200,
      metadata: {
        user: getInfoData({
          fileds: ["_id", "username", "email"],
          object: user,
        }),
        tokens,
      },
    };
  };

  static logOut = async (userId) => {
    const keyStore = await KeyTokenService.findByUserId(userId);
    if (!keyStore) throw new BadRequestError("Not found keyStore with userId");

    const delKey = await KeyTokenService.removeKeyById(keyStore._id);
    console.log(delKey);
    return delKey;
  };

  static handleRefreshToken = async (refreshToken) => {
    // 1. Check who is this and delete
    const foundToken = await KeyTokenService.findByRefreshTokenUsed(
      refreshToken
    );
    if (foundToken) {
      const { userId, email } = await verifyJWT(
        refreshToken,
        foundToken.privateKey
      );

      await KeyTokenService.deleteKeyByUserId(userId);
      throw new ForbiddenError("Some thing went wrong !! Pls login again");
    }

    // 2. Verify
    const holderToken = await KeyTokenService.findByRefreshToken(refreshToken);
    if (!holderToken) throw new AuthFailureError("Invalid refreshToken");

    const { userId, email } = await verifyJWT(
      refreshToken,
      holderToken.privateKey
    );

    // 3.Allocation new token
    const foundUser = await User.findOne({ email }).lean();
    if (!foundUser) throw new AuthFailureError("User not registered");

    const tokens = await createTokenPair(
      { userId, email },
      holderToken.publicKey,
      holderToken.privateKey
    );

    // 4. Update keyStore: save new refreshToken and add refreshTokenUsed
    await holderToken.updateOne({
      $set: {
        refreshToken: tokens.refreshToken,
      },
      $addToSet: {
        refreshTokenUsed: refreshToken,
      },
    });

    return {
      user: getInfoData({
        fileds: ["_id", "username", "email"],
        object: foundUser,
      }),
      tokens,
    };
  };
}

module.exports = AuthService;
