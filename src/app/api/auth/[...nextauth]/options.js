import { connectDB } from "@/lib/db";
import Account from "@/models/Account";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";

export const authOptions = {
  secret: process.env.NEXTAUTH_JWT_SECRET,
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
          email: user.email,
        };
      },
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID ?? "",
      clientSecret: process.env.GITHUB_SECRET ?? "",
    }),
  ],
  callbacks: {
    // Enhanced jwt callback
    jwt: async ({ token, user, account }) => {
      // Enhanced jwt callback
      if (account && account.provider !== "credentials") {
        await connectDB();
        const appAccount = await Account.findOne({
          provider: account.provider,
          accountId: account.providerAccountId,
        });

        const dbUser = await User.findById(appAccount.userId).select("email");

        if (appAccount) {
          token.id = appAccount.userId;
          token.email = dbUser.email;
        }
      } else if (user) {
        token.id = user.id;
        token.email = user.email;
        // Add more fields as necessary
      }
      return token;
    },
    session: async ({ session, token }) => {
      session.user.id = token.id;
      session.user.email = token.email;
      // Add additional fields to the session as necessary
      return session;
    },

    signIn: async ({ user, account, profile }) => {
      console.log("signIn");
      await connectDB();
      if (account.provider === "credentials") return true;

      const sess = await getServerSession(authOptions);
      if (!sess || !sess.user) {
        return false;
      } else {
        const uid = sess.user.id;

        const dbaccount = await Account.findOne({
          uid: uid,
          provider: account.provider,
        });

        if (!dbaccount) {
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
