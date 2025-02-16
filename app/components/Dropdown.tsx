import { FacebookPage } from "@/types/types";
import { useEffect, useState } from "react";
import axios from 'axios'
  

export default function Dropdown({pages}:{pages:FacebookPage[]}){

    const [selectedPage, setSelectedPage] = useState<string>("");
    const [pageInsights, setPageInsights] = useState({});
    useEffect(()=>{
        if(selectedPage){
            fetchInsigtpage(selectedPage)}
          //@ts-expect-error
    },[selectedPage,pages.accesstoken])

    const fetchInsigtpage=async(selectedPage:string)=>{

      const pageToken = pages.find(pages => pages.id === selectedPage)?.access_token;
      console.log("Pages Data:", pages);
console.log("Selected Page:", selectedPage);

if (!pageToken) {
    console.error("Error: No Page Access Token found for selected page");
    return;
}

console.log("Using Page Token:", pageToken);
       
    const since = Math.floor(new Date('2025-02-10').getTime() / 1000);
    const until = Math.floor(new Date().getTime() / 1000);
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
        const insights = {};
        //@ts-expect-error
        response.data.data.forEach((item) => {
          //@ts-expect-error
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

   return( 
    <div>
    {pages.length > 0 && (
        <div>
           
          <select onChange={(e) => setSelectedPage(e.target.value)} value={selectedPage}>
            <option value="">Select a page</option>
            {pages.map((page) => (
              <option key={page.id} value={page.id}>{page.name}</option>
            ))}
          </select>
        </div>)}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {Object.keys(pageInsights).length > 0 ? (
                    Object.entries(pageInsights).map(([metric, values]) => (
                        <div key={metric} className="bg-white shadow-md rounded-lg p-4">
                            <h3 className="text-lg font-semibold capitalize">{metric.replace(/_/g, ' ')}</h3>
                            <p className="text-gray-700 text-sm">
                                {/* Show latest available value */}
                                {Array.isArray(values) && values.length > 0
                                    ? values[values.length - 1].value
                                    : "No data available"}
                            </p>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500">No insights available</p>
                )}
            </div>
      </div>

    )
}