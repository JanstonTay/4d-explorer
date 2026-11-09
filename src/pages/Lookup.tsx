import type {ReactNode} from "react";
import {useNavigate,useParams} from "react-router-dom";
import {K,PL,HL,cn,heat,p4,perms,stat} from "../lib/data";
import {useApp} from "../store";
import {Legend,PrizePick} from "../ui";
export default function Lookup(){
 const {d,k}=useApp(),D=d!,nav=useNavigate(),{n:param=""}=useParams(),v=param.replace(/\D/g,"").slice(0,4);
 const set=(s:string)=>nav("/lookup/"+s.replace(/\D/g,"").slice(0,4),{replace:true});
 let out:ReactNode=<p className="mut">Enter four digits to see how often it has won and when it last did.</p>;
 if(v.length===4){
  const n=+v,s=stat(D,n,k),ps=perms(v),gp=s.h.slice(1).map((x,i)=>x-s.h[i]),ag=gp.length?Math.round(gp.reduce((a,b)=>a+b,0)/gp.length):null;
  const lab=(dn:number)=>{const x=D.byDn.get(dn)!;return x.ns.map((y,j)=>y===n?cn(x.ns.length,j):"").filter(Boolean).join(" + ")};
  out=<>
   <div className="grid">
    <div className="stat"><b>{s.w}</b>times won ({PL[k]})<br/><span className="mut sm">average number: {D.avg[k].toFixed(1)}</span></div>
    <div className="stat"><b>{s.last}</b>last won</div>
    <div className="stat"><b>{s.since===null?"–":s.since.toLocaleString()}</b>draws since</div>
    <div className="stat"><b>{ag??"–"}</b>avg draws between wins</div>
   </div>
   <h2>By prize type</h2><Legend/>
   <div className="scroll"><table><thead><tr><th>Prize</th><th>Times won</th><th>Last won</th><th>Draws since</th><th>Status</th></tr></thead>
    <tbody>{K.map(x=>{const t=stat(D,n,x),c=heat(D,t.since,x);return <tr key={x} className={c}><td>{PL[x]}</td><td>{t.w}</td><td>{t.last}</td><td>{t.since??"never"}</td><td>{HL[c]}</td></tr>})}</tbody></table></div>
   {ps.length>1&&<><h2 style={{marginTop:14}}>Other orders (covered by System Entry and iBet)</h2>
    <div className="scroll"><table><thead><tr><th>Order</th><th>Wins</th><th>Last won</th></tr></thead>
    <tbody>{ps.map(x=>{const t=stat(D,+x,k);return <tr key={x} className={heat(D,t.since,k)}><td className="n">{x}</td><td>{t.w}</td><td>{t.last}</td></tr>})}</tbody></table></div></>}
   <h2 style={{marginTop:14}}>Win history ({PL[k]})</h2>
   <ul className="d">{s.h.slice().reverse().slice(0,40).map(dn=><li key={dn}>{D.byDn.get(dn)!.dt} (draw {dn}): {lab(dn)}</li>)}</ul>
   {s.w>40&&<p className="mut sm">Showing the latest 40 of {s.w}.</p>}
  </>;
 }
 return <div className="card"><h2>Look up a number</h2><PrizePick/>
  <div className="row"><input className="big" inputMode="numeric" maxLength={4} placeholder="0000" aria-label="4-digit number" value={v} onChange={e=>set(e.target.value)}/>
  <button onClick={()=>set(p4(crypto.getRandomValues(new Uint32Array(1))[0]%10000))}>Random number</button></div>{out}</div>;
}
