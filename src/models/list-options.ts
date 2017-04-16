export class ListOptions {
   public criteria: {} = {};
   public page: number =0;
   public limit: number =30;

   public constructor(criteria: any, page: number, limit: number){
       this.criteria = criteria;
       this.page = page;
       this.limit = limit;
   }
}