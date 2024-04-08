"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { toast } from "sonner";

import { signIn } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import axios from "axios";

export function LoginForm() {
  const [activeTab, setActiveTab] = useState("login");

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const authSubmissionHandler = async () => {
    if (activeTab === "login") {
      console.log("Login form submitted");
      console.log(password, email);

      await signIn("credentials", {
        password,
        email,
      });
    } else {
      console.log("Signup form submitted");
      console.log(username, password, email);

      const { data } = await axios.post(`/api/profile/signup`, {
        username,
        email,
        password,
      });

      console.log(data);

      toast(`User created Successfully, Kindly Login`);
      setActiveTab("login");
    }
  };

  const accountLinkHandler = async (provider) => {
    await signIn(provider);
  };

  return (
    <Card className="mx-auto max-w-sm">
      <Tabs
        defaultValue="login"
        className=""
        onValueChange={(change) => {
          setActiveTab(change);
        }}
        value={activeTab}
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="signup">Signup</TabsTrigger>
        </TabsList>
        <TabsContent value="login">
          <CardHeader>
            <CardTitle className="text-2xl">Login</CardTitle>
            <CardDescription>
              Enter your email below to login to your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    href="#"
                    className="ml-auto inline-block text-sm underline"
                  >
                    Forgot your password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <Button
                type="submit"
                className="w-full"
                onClick={authSubmissionHandler}
              >
                Login
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  accountLinkHandler("github");
                }}
              >
                Connect Github Account
              </Button>
            </div>
          </CardContent>
        </TabsContent>
        <TabsContent value="signup">
          <CardHeader>
            <CardTitle className="text-2xl">Signup</CardTitle>
            <CardDescription>
              Enter your email below to create your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="m@example.com"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <Button
                type="submit"
                className="w-full"
                onClick={authSubmissionHandler}
              >
                Signup
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  accountLinkHandler("github");
                }}
              >
                Connect Github Account
              </Button>
            </div>
          </CardContent>
        </TabsContent>
      </Tabs>
    </Card>
  );
}

export default LoginForm;
