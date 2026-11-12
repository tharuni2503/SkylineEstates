import type { Property, PropertyQuery, Inquiry, SiteVisit } from "./index";
export interface ApiResponse<T>{data:T;message?:string}
export interface Paginated<T>{items:T[];total:number;page:number;pageSize:number}
export type PropertyListRequest=PropertyQuery&{page?:number;pageSize?:number};
export type PropertyListResponse=ApiResponse<Paginated<Property>>;
export type PropertyResponse=ApiResponse<Property>;
export type CreateInquiryRequest=Omit<Inquiry,"id"|"createdAt">;
export type CreateInquiryResponse=ApiResponse<Inquiry>;
export type CreateSiteVisitRequest=Omit<SiteVisit,"id"|"status">&{email:string;message?:string};
export type CreateSiteVisitResponse=ApiResponse<SiteVisit>;
