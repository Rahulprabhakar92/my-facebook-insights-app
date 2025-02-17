import { FacebookPage } from "@/types/types";
import { useEffect, useState } from "react";
import axios from 'axios'
  

export default function Dropdown({pages}:{pages:FacebookPage[]}){
  

    const [selectedPage, setSelectedPage] = useState<string>("");
    const [pageInsights, setPageInsights] = useState<Record<string, { value: number }[]>>({});

   
    const fetchInsigtpage=async(selectedPage:string)=>{
      const pageToken = pages.find(page => page.id === selectedPage)?.access_token;
      console.log("Pages Data:", pages);
      console.log("Selected Page:", selectedPage);


if (!pageToken) {
    console.error("Error: No Page Access Token found for selected page");
    return;
}

console.log("Using Page Token:", pageToken);
       
    const since = Math.floor(new Date('2025-02-16').getTime() / 1000);
    const until = Math.floor(new Date().getTime() / 1000);
    // const until =  Math.floor(new Date('2025-02-16').getTime() / 1000);

    const metrics = "page_fans,page_impressions,page_post_engagements,page_actions_post_reactions_like_total";
    const period = "day";

    axios.get(`https://graph.facebook.com/${selectedPage}/insights`, {
      params: {
        access_token: pageToken,
        metric: metrics,
        since: since,
        until: until,
        period:period
      }
    })
    .then(response => {
      if (response.data && response.data.data) {
        console.log(response.data.data)
        const insights: Record<string, { value: number }[]> = {};

        // @ts-expect-error This is needed because TypeScript fails to infer the correct type
        response.data.data.forEach((item) => {
          insights[item.name] = item.values;
        });
        setPageInsights(insights);
        
      } else {
        console.error('No data returned from Facebook API:', response);
        setPageInsights({});
      }
    })
    .catch(error => {
      console.error('Error fetching page insights:', error);
    });

  };
  useEffect(()=>{
    if(selectedPage){
        fetchInsigtpage(selectedPage)
      }
    },[selectedPage,fetchInsigtpage])


   return( 
    <div className="flex flex-col items-center w-full space-y-4">
  {/* Dropdown Section */}
  {pages.length > 0 && (
    <div className="w-full max-w-sm">
      <select 
        onChange={(e) => setSelectedPage(e.target.value)} 
        value={selectedPage} 
        className="w-full p-2 border rounded-md"
      >
        <option value="">Select a page</option>
        {pages.map((page) => (
          <option key={page.id} value={page.id}>{page.name}</option>
        ))}
      </select>
    </div>
  )}

  {/* Insights Section - Horizontal Layout */}
  <div className="flex flex-wrap justify-start gap-4 w-full">
    {Object.keys(pageInsights).length > 0 ? (
      Object.entries(pageInsights).map(([metric, values]) => (
        <div key={metric} className="bg-white shadow-md rounded-lg p-4 w-64">
          <h3 className="text-lg font-semibold capitalize">{metric.replace(/_/g, ' ')}</h3>
          <p className="text-gray-700 text-sm">
            {Array.isArray(values) && values.length > 0
              ? values[values.length - 1].value
              : "No data available"}
          </p>
        </div>
      ))
    ) : (
      <p className="text-gray-500 text-center w-full">No insights available</p>
    )}
  </div>
</div>

    )
}