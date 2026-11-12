export default function SectionHead({eyebrow,title,dark=false,className="",as="h2"}:{eyebrow:string;title:string;dark?:boolean;className?:string;as?:"h1"|"h2"}){
 const Tag=as;
 return <div className={className}><p className={`text-xs uppercase tracking-[.3em] ${dark?"text-beige":"text-slate"}`}>{eyebrow}</p>
  <Tag className="mt-3 font-serif text-4xl leading-tight md:text-5xl">{title.split("*").map((t,i)=>i%2?<em key={i} className={`italic ${dark?"text-beige":"text-[#9c7f56]"}`}>{t}</em>:<span key={i}>{t}</span>)}</Tag></div>;}
