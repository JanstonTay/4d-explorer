import {useState} from "react";
import type {ReactNode} from "react";
import {perms} from "../lib/data";
const PZ:[string,number][]=[["1st",1],["2nd",1],["3rd",1],["Starter",10],["Consolation",10]],BIG=[2000,1000,490,250,60],SMALL=[3000,2000,800,0,0],
IB:Record<number,number[]>={24:[83,41,20,10,3],12:[166,83,40,20,6],6:[335,168,85,41,10],4:[500,250,127,62,15]};
const err=(m:string)=><p style={{color:"var(--hot)"}}>{m}</p>;
export default function Bets(){
 const [num,setNum]=useState(""),[ty,setTy]=useState("ord"),[sz,setSz]=useState("big"),[st,setSt]=useState(1);
 const v=num.toUpperCase().replace(/[^0-9R]/g,"").slice(0,4),k=Math.max(1,st||1);
 const calc=():ReactNode=>{
  if(v.length<4)return <p className="mut">Enter a number. For 4D Roll, use R for the open digit (e.g. R234).</p>;
  const rs=(v.match(/R/g)||[]).length;let cov:number,cost:number,n=1;
  if(ty==="roll"){if(rs!==1)return err("4D Roll needs exactly one R.");cov=10;cost=10*k}
  else{if(rs)return err("Use R only with 4D Roll.");n=perms(v).length;
   if(ty==="ord"){cov=1;cost=k}else if(ty==="sys"){cov=n;cost=n*k}
   else{if(n<2)return err("iBet needs at least 2 different orders (not 1111).");if(sz==="small")return err("Small iBet payouts aren't included yet. Use Big.");cov=n;cost=k}}
  const pay=ty==="ibet"?IB[n]:sz==="big"?BIG:SMALL,ev=PZ.reduce((a,z,i)=>a+z[1]*pay[i],0)*(ty==="ibet"?n:1)/10000;
  return <><div className="grid"><div className="stat"><b>${cost.toLocaleString()}</b>total cost</div><div className="stat"><b>{cov}</b>number{cov>1?"s":""} covered</div>
   <div className="stat"><b>{(cov*(sz==="big"?23:3)/100).toFixed(2)}%</b>chance of any prize per draw</div><div className="stat"><b>{Math.round(ev*100)}¢</b>average return per $1</div></div>
   <div className="scroll"><table><thead><tr><th>If a covered number wins</th><th>Prize</th></tr></thead><tbody>{PZ.map((z,i)=>pay[i]?<tr key={z[0]}><td>{z[0]}{z[1]>1?` (${z[1]} numbers)`:""}</td><td>${(pay[i]*k).toLocaleString()}</td></tr>:null)}</tbody></table></div>
   <p className="mut sm">{ty==="ibet"?"iBet splits one stake across all orders, so each prize is smaller. 1st Prize and Starter iBet figures come from a third-party source; check the official rules.":"Each covered number pays the full prize."} Standard Singapore Pools prize table.</p></>;
 };
 return <div className="card"><h2>Bet calculator</h2><div className="row">
  <input className="big" style={{fontSize:34,maxWidth:230}} maxLength={4} placeholder="1234" aria-label="Number (use R for 4D Roll)" value={v} onChange={e=>setNum(e.target.value)}/>
  <select aria-label="Bet type" value={ty} onChange={e=>setTy(e.target.value)}><option value="ord">Ordinary</option><option value="sys">System Entry</option><option value="ibet">iBet</option><option value="roll">4D Roll (one R)</option></select>
  <select aria-label="Big or Small" value={sz} onChange={e=>setSz(e.target.value)}><option value="big">Big</option><option value="small">Small</option></select>
  <label className="sm">Stake $ <input type="number" min={1} value={st} style={{width:70}} onChange={e=>setSt(+e.target.value)}/></label></div>{calc()}</div>;
}
