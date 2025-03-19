const { Types } = require("mongoose");
const keyTokenModel = require("../models/keytoken");

class KeyTokenService {
  static createKeyToken = async ({
    userId,
    publicKey,
    privateKey,
    refreshToken,
  }) => {
    try {
      const filter = { user: userId };
      const update = {
        publicKey,
        privateKey,
        refreshTokensUsed: [],
        refreshToken,
      };
      const options = { upsert: true, new: true };
      const tokens = await keyTokenModel.findOneAndUpdate(
        filter,
        update,
        options
      );
      return tokens ? tokens.publicKey : null;
    } catch (error) {
      return error;
    }
  };

  /**
   * Tìm kiếm key token theo userId.
   * @param {string} userId - ID của người dùng.
   * @returns {Promise<Object|null>} - Key token document dạng plain object hoặc null.
   */
  static findByUserId = async (userId) => {
    return await keyTokenModel
      .findOne({ user: new Types.ObjectId(userId) })
      .lean();
  };

  /**
   * Xóa key token theo id của document.
   * @param {string} id - _id của key token.
   * @returns {Promise<Object|null>} - Document đã bị xóa hoặc null.
   */
  static removeKeyById = async (id) => {
    return await keyTokenModel.findByIdAndDelete(id);
  };

  /**
   * Tìm kiếm key token có chứa refreshToken đã được sử dụng.
   * @param {string} refreshToken - Refresh token cần kiểm tra.
   * @returns {Promise<Object|null>} - Document key token nếu tìm thấy hoặc null.
   */
  static findByRefreshTokenUsed = async (refreshToken) => {
    return await keyTokenModel
      .findOne({ refreshTokensUsed: refreshToken })
      .lean();
  };

  /**
   * Tìm kiếm key token theo refreshToken hiện tại (chưa được sử dụng).
   * @param {string} refreshToken - Refresh token cần tìm.
   * @returns {Promise<Object|null>} - Document key token nếu tìm thấy hoặc null.
   */
  static findByRefreshToken = async (refreshToken) => {
    return await keyTokenModel.findOne({ refreshToken: refreshToken });
  };

  /**
   * Xóa key token theo userId.
   * @param {string} userId - ID của người dùng.
   * @returns {Promise<Object|null>} - Document key token đã bị xóa hoặc null.
   */
  static deleteKeyByUserId = async (userId) => {
    return await keyTokenModel.findOneAndDelete({ user: userId });
  };
}

module.exports = KeyTokenService;
