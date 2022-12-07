declare namespace APIResponseNS {

    interface IEachAnalyticsData {
        date: string;
        app_id: string;
        requests: number; 
        responses: number;
        impressions: number;
        clicks: number;
        revenue: number;
    }

    interface IAnalyticsAPIResponseData {
        cache_time : number;  
        data: IEachAnalyticsData[];  
    }

    interface IEachAppData {
        app_id: string;
        app_name: string;
    }

    interface IAppsAPIResponse {
        cache_time : number;  
        data: IEachAppData[];          
    }
}
