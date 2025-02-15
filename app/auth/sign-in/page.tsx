'use client'

import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";

export default function Signin() {
  return (
    <div className="flex items-center justify-center h-screen">
      <Card className="w-[650px] h-[350px]">
        <CardHeader>
          <CardTitle className="font-bold text-blue-800 text-lg">
            Facebook Login
          </CardTitle>
        </CardHeader>
        <Button
          className="outline m-7"
          onClick={() =>
            signIn("facebook", {
              callbackUrl: `${window.location.origin}`,
            })
          }
        >
          Login
        </Button>
      </Card>
    </div>
  );
}
