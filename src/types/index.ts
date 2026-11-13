export type Category="Apartment"|"Villa"|"Independent House"|"Residential Plot"|"Commercial";
export type Listing="Buy"|"Rent";
export interface Property{id:string;title:string;location:string;price:number;listing:Listing;category:Category;bhk:number;areaSqft:number;image:string;amenities:string[];verified:boolean;featured:boolean;postedAt:string;agentId:string;description?:string;bathrooms?:number;furnishing?:string;parking?:string;address?:string;contactPhone?:string;videoUrl?:string}
export interface PropertyQuery{q?:string;listing?:Listing;category?:Category|"All";maxPrice?:number;bhk?:number;amenity?:string;minArea?:number;maxArea?:number;minPrice?:number;verified?:boolean;featured?:boolean;sort?:"latest"|"price-asc"|"price-desc"}
export interface Inquiry{id:string;propertyId:string;name:string;email:string;phone:string;message:string;createdAt:string}
export interface SiteVisit{id:string;propertyId:string;name:string;phone:string;date:string;time:string;status:"Pending"|"Confirmed"|"Completed"}
export interface User{id:string;name:string;role:"buyer"|"seller"|"agent"|"builder"|"admin";email:string}
export type LeadStatus="New"|"Contacted"|"Visit scheduled"|"Closed";
export interface Lead{id:string;name:string;propertyId:string;phone:string;status:LeadStatus}
export interface Project{id:string;name:string;location:string;units:number;sold:number}
export interface VisitRow{id:string;name:string;propertyId:string;date:string;time:string;status:"Pending"|"Confirmed"|"Completed"}
