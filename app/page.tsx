"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function Home() {
  const { data: session } = useSession();
  const [profile, setProfile] = useState<any>(null);
  const [pages, setPages] = useState<any[]>([]);
  const [selectedPage, setSelectedPage] = useState<string>("");

  useEffect(() => {
    //@ts-ignore
    if (session?.accessToken) {
      // Fetch user profile
       //@ts-ignore
      fetch(`https://graph.facebook.com/me?fields=id,name,picture&access_token=${session.accessToken}`)
        .then((res) => res.json())
        .then((data) => setProfile(data));

      // Fetch managed pages
       //@ts-ignore
      fetch(`https://graph.facebook.com/me/accounts?access_token=${session.accessToken}`)
        .then((res) => res.json())
        .then((data) => setPages(data.data || []));
    }
  }, [session]);

  return (
    <div>
      <h1>Welcome to My App</h1>
      {session ? (
        <>
          {profile && (
            <div>
              <img src={profile.picture.data.url} alt="Profile Pic" width={100} />
              <p>Signed in as {profile.name}</p>
            </div>
          )}

          {/* Page Selection Dropdown */}
          {pages.length > 0 && (
            <div>
              <label>Select a Page:</label>
              <select onChange={(e) => setSelectedPage(e.target.value)} value={selectedPage}>
                <option value="">Select a page</option>
                {pages.map((page) => (
                  <option key={page.id} value={page.id}>{page.name}</option>
                ))}
              </select>
            </div>
          )}
        </>
      ) : (
        <p>Please sign in.</p>
      )}
    </div>
  );
}
