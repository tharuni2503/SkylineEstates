const q=(v:string)=>`"${v.replace(/"/g,'""')}"`;
export function downloadCsv(filename:string,rows:string[][]){
 const blob=new Blob([rows.map(r=>r.map(q).join(",")).join("\n")],{type:"text/csv;charset=utf-8"});
 const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download=filename;a.click();URL.revokeObjectURL(url);
}
