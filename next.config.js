module.exports={
 images:{remotePatterns:[{protocol:'https',hostname:'images.unsplash.com'}]},
 async headers(){return [{source:'/videos/:path*',headers:[{key:'Cache-Control',value:'public, max-age=604800, stale-while-revalidate=86400'}]}];}
};
