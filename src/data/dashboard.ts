import type { Lead, Project } from "@/types";
export const leads:Lead[]=[
{id:"l1",name:"Ravi Teja",propertyId:"p1",phone:"9876500011",status:"New"},
{id:"l2",name:"Anjali Rao",propertyId:"p2",phone:"9876500022",status:"Contacted"},
{id:"l3",name:"Imran Khan",propertyId:"p3",phone:"9876500033",status:"Visit scheduled"},
{id:"l4",name:"Sneha Reddy",propertyId:"p4",phone:"9876500044",status:"New"},
{id:"l5",name:"Karthik Varma",propertyId:"p6",phone:"9876500055",status:"Closed"}];
export const projects:Project[]=[
{id:"j1",name:"Skyline Crest",location:"Gachibowli",units:240,sold:168},
{id:"j2",name:"The Aurum Estate",location:"Kokapet",units:48,sold:21},
{id:"j3",name:"Tellapur Greens",location:"Tellapur",units:120,sold:96}];
export const monthly=[{m:"Jun",v:12},{m:"Jul",v:18},{m:"Aug",v:15},{m:"Sep",v:26},{m:"Oct",v:31}];
import type { VisitRow } from "@/types";
export const visits:VisitRow[]=[
{id:"v1",name:"Ravi Teja",propertyId:"p1",date:"2026-11-03",time:"10:00 AM",status:"Confirmed"},
{id:"v2",name:"Imran Khan",propertyId:"p3",date:"2026-11-05",time:"3:00 PM",status:"Pending"},
{id:"v3",name:"Sneha Reddy",propertyId:"p4",date:"2026-10-28",time:"12:00 PM",status:"Completed"}];
export const inventory=[{unit:"A-402",type:"3 BHK",area:1850,status:"Available"},{unit:"B-1105",type:"2 BHK",area:1250,status:"Sold"},{unit:"C-203",type:"3 BHK",area:1950,status:"Reserved"},{unit:"A-1201",type:"4 BHK",area:2600,status:"Available"}];
import type { Inquiry } from "@/types";
export const inquiries:Inquiry[]=[
{id:"q1",propertyId:"p1",name:"Ravi Teja",email:"ravi@example.com",phone:"9876500011",message:"Is the price negotiable, and is parking included?",createdAt:"2026-10-30"},
{id:"q2",propertyId:"p2",name:"Anjali Rao",email:"anjali@example.com",phone:"9876500022",message:"Can we visit this weekend with my parents?",createdAt:"2026-10-29"},
{id:"q3",propertyId:"p6",name:"Karthik Varma",email:"karthik@example.com",phone:"9876500055",message:"Please share the floor plan and payment schedule.",createdAt:"2026-10-27"}];
