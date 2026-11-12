import ContactForm from "@/components/forms/ContactForm";
import { PHONE } from "@/lib/contact";
const NEARBY:Record<string,string[]>={Gachibowli:["Indian School of Business, 3 km","Gachibowli metro corridor, 2 km","Hospitals, 3.5 km","Shopping mall, 6 km"],Kokapet:["International schools, 2 km","Financial District, 5 km","Neopolis open spaces, 1 km","Multi-speciality hospital, 6 km"],Narsingi:["Outer Ring Road exit, 1 km","Lakeside walking trails, 2 km","Schools, 1.5 km","Hospital, 4 km"],"Financial District":["Office towers, 1 km","Food courts and cafes, 1.5 km","Schools, 3 km","Hospital, 4 km"]};
const FALLBACK=["International school, 1.5 km","Multi-speciality hospital, 3 km","Metro or shuttle stop, 2 km","Shopping mall, 4 km"];
export default function Extras({location,propertyId,propertyTitle,children}:{location:string;propertyId?:string;propertyTitle?:string;children?:React.ReactNode}){
 const area=location.split(",")[0];
 return <>
  {children}
  <h2 className="mt-14 border-t border-line pt-6 font-serif text-3xl">Location</h2>
  <iframe title={`Map of ${area}, Hyderabad`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" src={`https://maps.google.com/maps?q=${encodeURIComponent(area+", Hyderabad")}&output=embed`} className="mt-3 aspect-video w-full border-0"/>
  <p className="mt-1 text-xs text-slate">Map shows the locality, not the exact address.</p>
  <h3 className="mt-6 font-serif text-xl">Nearby</h3>
  <ul className="mt-2 grid gap-2 text-sm sm:grid-cols-2">{(NEARBY[area]??FALLBACK).map(x=><li key={x} className="border-b border-line py-2">{x}</li>)}</ul>
  <h2 className="mt-14 border-t border-line pt-6 font-serif text-3xl">Contact agent &amp; enquire</h2>
  <div className="mt-4 flex items-center gap-4 bg-white p-5"><span className="flex h-14 w-14 items-center justify-center rounded-full bg-matte font-serif text-lg text-ivory" aria-hidden="true">LP</span><div><p className="font-serif text-xl">Lakshmi Prasad</p><p className="text-sm text-slate">Senior advisor, {area}</p>{PHONE&&<a href={`tel:${PHONE}`} className="mt-1 mr-4 inline-block text-sm underline">Call agent</a>}<a href="#contact-agent" className="mt-1 inline-block text-sm underline">Message agent</a></div></div>
  <div id="contact-agent" className="mt-4 scroll-mt-24"><ContactForm propertyId={propertyId} propertyTitle={propertyTitle}/></div></>;}
