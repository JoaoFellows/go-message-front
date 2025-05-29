"use client";
import Link from "next/link";
import { useState, useRef } from "react";
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
import { uploadToCloudinary } from "@/utils/cloudinaryService";
import Image, { StaticImageData } from "next/image";
import { ProfileIcon } from "@/assets";
import { signup } from "@/services/auth";
import { useRouter } from 'next/navigation';


export function SignupForm() {

  const [profilePicture, setProfilePicture] = useState<string | StaticImageData | null>(ProfileIcon);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const passwordsMatch = password === confirmPassword;

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileInput = () => {
    fileInputRef.current?.click();
  }

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const imageUrl = await uploadToCloudinary(file);
    setProfilePicture(imageUrl);
  };

  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    if (!passwordsMatch) return;
    try {
      const response = await signup({
        name,
        email,
        password,
        photo_url: profilePicture as string,
      });

      console.log(response);
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setProfilePicture(ProfileIcon);
      router.push("/signin");
    } catch (error) {
      console.error(error);
      alert("An error occurred. Please try again.");
    }finally{
      setLoading(false);
    }
  };


  return (
    <Card className=" max-w-lg w-full p-6">
      <CardHeader>
        <CardTitle className="text-2xl">Sign Up</CardTitle>
        <CardDescription>Create an account to join our community</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="grid gap-4" onSubmit={handleSubmit}>
          <div className="grid gap-2">
            <Label htmlFor="profile_picture">Profile Picture</Label>
            <Input
              ref={fileInputRef}
              id="profile_picture"
              type="file"
              accept="image/*"
              onChange={handleUpload}
              className="cursor-pointer hidden" />
            {profilePicture && <Image src={profilePicture} width={90} height={0} alt="Profile Picture" onClick={handleFileInput} className="rounded-full mx-auto border-2 border-primary cursor-pointer hover:opacity-60" />}
            <div className="grid gap-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password *</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="grid gap-2 mb-4">
              <Label htmlFor="confirm_password">Confirm Password *</Label>
              <Input
                id="confirm_password"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={!passwordsMatch ? "border-red-500" : ""}
              />
              {!passwordsMatch && (
                <p className="text-red-500 text-sm">Passwords do not match</p>
              )}
            </div>
            <Button
              type="submit"
              className="w-full "
              disabled={!passwordsMatch || !name || !email || !password || !confirmPassword}
            >
              {loading ? (
                <svg
                  className="animate-spin h-5 w-5 text-white mx-auto"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                "Sign Up"
              )}
            </Button>
          </div>
        </form>
        <div className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link href="/signin" className="underline">
            Log in
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
