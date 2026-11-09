export type Raw=[number,string,number[]];
export interface Draw{dn:number;dt:string;ns:number[]}
export const K=["any","top3","c0","c1","c2","c3","c4"] as const;
export type Key=typeof K[number];
export const PL:Record<Key,string>={any:"Any prize",top3:"Top 3 (1st-3rd)",c0:"1st prize",c1:"2nd prize",c2:"3rd prize",c3:"Starter",c4:"Consolation"};
export const PR:Record<Key,number>={any:23,top3:3,c0:1,c1:1,c2:1,c3:10,c4:10};
export const p4=(n:number)=>String(n).padStart(4,"0");
export const cn=(len:number,j:number)=>j<3?["1st","2nd","3rd"][j]:len===23?(j<13?"Starter":"Consolation"):"Other";
export const perms=(s:string):string[]=>{const r=new Set<string>();const g=(a:string,b:string):void=>{if(!a){r.add(b);return}for(let i=0;i<a.length;i++)g(a.slice(0,i)+a.slice(i+1),b+a[i])};g(s,"");return[...r].sort()};
export interface Data{draws:Draw[];H:Record<Key,number[][]>;byDn:Map<number,Draw>;N:number;last:number;span:number;avg:Record<Key,number>;missing:number}
export function build(raw:Raw[]):Data{
 const draws:Draw[]=raw.map(r=>({dn:r[0],dt:r[1],ns:r[2]})).sort((a,b)=>a.dn-b.dn);
 const H={} as Record<Key,number[][]>;K.forEach(k=>{H[k]=Array.from({length:10000},()=>[] as number[])});
 const add=(k:Key,n:number,dn:number)=>{const h=H[k][n];if(h[h.length-1]!==dn)h.push(dn)};
 draws.forEach(d=>{const full=d.ns.length===23;d.ns.forEach((n,j)=>{add("any",n,d.dn);const c=j<3?j:full?(j<13?3:4):-1;if(c>=0){add(("c"+c) as Key,n,d.dn);if(c<3)add("top3",n,d.dn)}})});
 const avg={} as Record<Key,number>;K.forEach(k=>{avg[k]=H[k].reduce((a,h)=>a+h.length,0)/10000});
 const last=draws[draws.length-1].dn,span=last-draws[0].dn+1;
 return{draws,H,byDn:new Map(draws.map(d=>[d.dn,d])),N:draws.length,last,span,avg,missing:span-draws.length};
}
export const stat=(d:Data,n:number,k:Key)=>{const h=d.H[k][n],w=h.length;const since:number|null=w?d.last-h[w-1]:null;return{w,h,since,last:w?d.byDn.get(h[w-1])!.dt:"never"}};
export type Heat="g"|"y"|"a"|"r";
export const heat=(d:Data,since:number|null,k:Key):Heat=>{const r=(since??d.span)/(10000/PR[k]);return r<.5?"g":r<1?"y":r<2?"a":"r"};
export const HL:Record<Heat,string>={g:"Recent",y:"Typical",a:"Long wait",r:"Very long"};
export function parseCsv(t:string):Raw[]{const m=new Map<number,Raw>();t.split(/\r?\n/).slice(1).forEach(l=>{const c=l.split(",");if(c.length<3||!/^\d{4}$/.test(c[1].trim()))return;const dn=+c[0];if(!m.has(dn))m.set(dn,[dn,c[2].trim().replace(/\//g,"-"),[]]);m.get(dn)![2].push(+c[1])});return[...m.values()]}
