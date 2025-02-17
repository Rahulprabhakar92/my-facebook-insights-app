"use client";

import {
    Card,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import { FacebookPage } from "@/types/types";
import { FacebookProfile } from "next-auth/providers/facebook";
import {  signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Dropdown from "./components/Dropdown";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";


export default function Home() {
  const { data: session } = useSession();
  const [profile, setProfile] = useState<FacebookProfile>();
  const [pages, setPages] = useState<FacebookPage[]>([]);
  useEffect(() => {
    // @ts-expect-error This is needed because TypeScript fails to infer the correct type
    if (session?.accessToken) {

      // @ts-expect-error This is needed because TypeScript fails to infer the correct type
      fetch(`https://graph.facebook.com/me?fields=id,name,picture&access_token=${session.accessToken}`)
        .then((res) => res.json())
        .then((data) => setProfile(data));




      // @ts-expect-error This is needed because TypeScript fails to infer the correct type
       fetch(`https://graph.facebook.com/me/accounts?access_token=${session.accessToken}`)
       .then((res) => res.json())
       .then((data) => {
         if (data && Array.isArray(data.data)) {
           setPages(
             data.data.map((page:FacebookPage) => ({
               id: page.id,
               name: page.name,
               access_token: page.access_token, 
             }))
           );
         } else {
           console.error("Error: No pages found or invalid response format", data);
           setPages([]); 
         }
       })
       .catch((error) => console.error("Error fetching Facebook pages:", error));
    }
  }, [session]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
    <Card className="w-auto min-w max-w-md shadow-lg">
      <CardHeader>
        <h2 className="text-xl font-bold text-center">Facebook Account</h2>
      </CardHeader>

      {session ? (
        <div className="flex flex-col items-center p-4 space-y-6">
          {profile && (
            <div className="flex flex-col items-center gap-4 w-f">
              <Image
                src={profile.picture.data.url}
                alt="Profile Pic"
                width={160}
                height={160}
                className="rounded-full"
              />
              <CardTitle className="text-3xl font-semibold">
                {profile.name}
              </CardTitle>
            </div>
          )}
          <Dropdown pages={pages} />
          <Button  color="secondary" onClick={() => signOut()}>
                Sign Out
              </Button>
        </div>
      ) : (
        <div className="flex flex-col items-center space-y-4 p-4">
          <p className="text-center text-gray-700">Please sign in</p>
          <Link href="/auth/sign-in">
            <Button>Sign In</Button>
          </Link>
        </div>
      )}
    </Card>
  </div>
  );
}
