export const inr=(n:number)=>n>=10000000?`₹${(n/10000000).toFixed(2)} Cr`:n>=100000?`₹${(n/100000).toFixed(1)} L`:`₹${n.toLocaleString("en-IN")}`;

/** Ask Unsplash for a wider rendition so large cards stay sharp. */
export const hiRes=(u:string,w=1920)=>u.includes("images.unsplash.com")?u.replace(/w=\d+/,`w=${w}`):u;
