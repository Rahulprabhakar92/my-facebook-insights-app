"use client";

import {
    Card,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import { FacebookPage } from "@/types/types";
import { FacebookProfile } from "next-auth/providers/facebook";
import {  useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Dropdown from "./components/Dropdown";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";


export default function Home() {
  const { data: session } = useSession();
  const [profile, setProfile] = useState<FacebookProfile>();
  const [pages, setPages] = useState<FacebookPage[]>([]);

  const token = (session as unknown as { accessToken: string })?.accessToken;


  
  

  useEffect(() => {
    // @ts-expect-error This is needed because TypeScript fails to infer the correct type
    if (session?.accessToken) {
      // Fetch user profile
      // @ts-expect-error This is needed because TypeScript fails to infer the correct type
      fetch(`https://graph.facebook.com/me?fields=id,name,picture&access_token=${session.accessToken}`)
        .then((res) => res.json())
        .then((data) => setProfile(data));



      // Fetch managed pages
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
    <div>
      <Card>
  <CardHeader>Facebook Account</CardHeader>

      {session ? (
        <div>
        <div className="flex flex-col justify-center items-center ">
          {profile && (
            <div className="flex flex-col gap-10">
              <Image src={profile.picture.data.url} alt="Profile Pic" width={100} height={100} className="w-40 h-40"/>

              <CardTitle className="text-3xl mb-4">{profile.name}</CardTitle>
            </div>
          )}
          <Dropdown pages={pages} />
        </div>
        <div>
            
        </div>
    </div>
      ) : (
        <div>
        <p>Please sign in</p>
        
<Link href="/auth/sign-in">
  <Button>Sign In</Button>
</Link>
        </div>
      )}
         </Card>
    </div>
  );
}
