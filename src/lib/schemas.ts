import { z } from "zod";
export const visitSchema=z.object({
 name:z.string().min(2,"Enter your full name"),
 email:z.string().email("Enter a valid email address"),
 phone:z.string().regex(/^[6-9]\d{9}$/,"Enter a 10-digit Indian mobile number"),
 propertyId:z.string().min(1,"Choose a property"),
 date:z.string().min(1,"Pick a visit date"),
 time:z.string().min(1,"Pick a time slot"),
 message:z.string().optional(),
});
export type VisitInput=z.infer<typeof visitSchema>;
export const listingSchema=z.object({
 title:z.string().min(3,"Enter a title of at least 3 characters"),
 category:z.enum(["Apartment","Villa","Independent House","Residential Plot","Commercial"]),
 listing:z.enum(["Buy","Rent"]),
 description:z.string().min(20,"Write at least 20 characters"),
 location:z.string().min(2,"Enter a locality, e.g. Kokapet"),
 address:z.string().min(5,"Enter the street address"),
 price:z.string().regex(/^\d+$/,"Enter the price in rupees, digits only"),
 bhk:z.string().regex(/^\d$/,"Enter BHK from 1 to 9, or 0 for plots"),
 bathrooms:z.string().regex(/^\d$/,"Enter number of bathrooms"),
 areaSqft:z.string().regex(/^\d+$/,"Enter the area in sq ft"),
 furnishing:z.enum(["Unfurnished","Semi-furnished","Furnished"]),
 parking:z.enum(["None","1","2","3+"]),
 amenities:z.array(z.string()),
 contactPhone:z.string().regex(/^[6-9]\d{9}$/,"Enter a 10-digit Indian mobile number"),
});
export type ListingInput=z.infer<typeof listingSchema>;
export const contactSchema=z.object({
 name:z.string().min(2,"Enter your full name"),
 email:z.string().email("Enter a valid email address"),
 phone:z.string().regex(/^[6-9]\d{9}$/,"Enter a 10-digit Indian mobile number"),
 message:z.string().min(10,"Tell us a little more (at least 10 characters)"),
});
export type ContactInput=z.infer<typeof contactSchema>;
export const roles=["buyer","seller","agent","builder","admin"] as const;
export type Role=typeof roles[number];
const email=z.string().email("Enter a valid email address");
const password=z.string().min(8,"Use at least 8 characters");
export const authSchemas={
 login:z.object({email,password}),
 register:z.object({name:z.string().min(2,"Enter your full name"),email,password,role:z.enum(roles)}),
 forgot:z.object({email}),
};
export interface AuthInput{name?:string;email:string;password?:string;role?:Role}
