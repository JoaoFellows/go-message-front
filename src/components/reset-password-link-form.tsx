"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";


export function ResetPasswordLinkForm() {

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Password Reset Link Sent</CardTitle>
        <CardDescription>
          It may take a few seconds for the email to arrive
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center text-sm">
          Changed your password?{" "}
          <Link href="/signin" className="underline">
            Log in
          </Link>
        </div>
        <div className="mt-4 text-center text-sm">
          Didn&apos;t receive an email?{" "}
          <Link href="/forgot-password" className="underline">
            Try again
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
