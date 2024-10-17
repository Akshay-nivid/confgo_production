
export interface ISource {
    method: string; // HTTP method, e.g., 'POST'
    data: {
      offset: number;
      limit: number;
      filters: any;
    };
    url: string; // API endpoint, e.g., 'coupon/list'
    listName: string; // Name of the list
}