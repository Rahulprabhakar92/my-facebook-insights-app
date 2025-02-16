export interface FacebookProfile {
    id: string;
    name: string;
    picture: {
      data: {
        height: number;
        width: number;
        url: string;
      };
    };
  }
  export interface FacebookPage {
    id: string;
    name: string;
   access_token:string;
  }
  interface PageInsights {
    fans_count: number;
    engagement: number;
    impressions: number;
    reactions: number;
  }
  interface FacebookAPIResponse {
    profile: FacebookProfile;
    pages: FacebookPage[];
    insights: PageInsights;
  }
      