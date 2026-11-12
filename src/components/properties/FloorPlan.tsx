export default function FloorPlan({bhk,areaSqft}:{bhk:number;areaSqft:number}){
 if(!bhk)return null;
 const beds=Math.max(1,Math.min(bhk,4));
 const room=(label:string,cls:string)=><div className={`flex items-center justify-center border border-beige/70 bg-beige/10 text-xs text-ivory ${cls}`}>{label}</div>;
 return <div><h2 className="mt-14 border-t border-line pt-6 font-serif text-3xl">Floor plan</h2>
  <div role="img" aria-label={`Indicative ${bhk} BHK floor plan`} className="mt-6 bg-matte p-5"><div className="mx-auto flex h-64 w-full max-w-xl flex-col gap-1">
   <div className="flex h-1/2 gap-1">{room("Living and dining","w-[55%]")}{room("Kitchen","flex-1")}</div>
   <div className="flex flex-1 gap-1">{Array.from({length:beds},(_,i)=><div key={i} className="flex flex-1">{room(`Bedroom ${i+1}`,"h-full w-full")}</div>)}{room("Bath","w-[16%]")}</div></div></div>
  <p className="mt-2 text-xs text-slate">Indicative layout drawn from the BHK count for a {areaSqft} sq ft home. It is not to scale; the agent shares the approved plan.</p></div>;}
