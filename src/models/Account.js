import mongoose from "mongoose";

const AccountSchema = new mongoose.Schema({
  accountId: String,
  accessToken: String,
  refreshToken: String,
  provider: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const Account =
  mongoose.models.Account || mongoose.model("Account", AccountSchema);

export default Account;
