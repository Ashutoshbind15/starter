import { connectDB } from "@/lib/db";
import Account from "@/models/Account";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";

export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    jwt: true,
  },
  providers: [
    Credentials({
      async authorize(credentials) {
        await connectDB();

        const { email, password } = credentials;
        const user = await User.findOne({ email: email });
        if (!user) return null;

        const plaintextPassword = password;
        const userSalt = user.salt;

        const hashedPassword = await bcrypt.hash(
          plaintextPassword,
          userSalt ?? ""
        );

        const isAuth = hashedPassword === user.password;

        if (!isAuth) return null;

        return {
          id: user._id,
        };
      },
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID ?? "",
      clientSecret: process.env.GITHUB_SECRET ?? "",
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      authorization: {},
    }),
  ],
  callbacks: {
    // Enhanced jwt callback
    jwt: async ({ token, user, account }) => {
      if (account && account.provider !== "credentials") {
        const appAccount = await Account.findOne({
          provider: account.provider,
          accountId: account.providerAccountId,
        });

        console.log(appAccount, "appAccount");

        if (appAccount) {
          token.id = appAccount.userId;
        }
      } else if (user) {
        token.id = user.id;
      }
      return token;
    },
    session: async ({ session, token }) => {
      session.id = token.id;
      return session;
    },
    signIn: async ({ user, account, profile }) => {
      if (account.provider === "credentials") return true;

      const sess = await getServerSession(authOptions);
      if (!sess || !sess.user) {
        return false;
      } else {
        const uid = sess.user.id;
        const account = await Account.findOne({
          uid: uid,
          provider: account.provider,
        });

        if (!account) {
          const newAccount = new Account({
            userId: uid,
            provider: account.provider,
            accountId: profile.id,
          });
          await newAccount.save();

          const user = await User.findById(uid);
          user.accounts.push(newAccount._id);
          await user.save();
        }

        return true;
      }
    },
  },
};
