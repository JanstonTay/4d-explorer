import {useMemo,useState} from "react";
import {HL,heat,p4,stat} from "../lib/data";
import {useApp} from "../store";
import {Legend,PrizePick} from "../ui";
type SK="w"|"since"|"n";
export default function Numbers(){
 const {d,k}=useApp(),D=d!,[sk,setSk]=useState<SK>("w"),[dir,setDir]=useState(-1),[q,setQ]=useState(""),[pg,setPg]=useState(0);
 const all=useMemo(()=>Array.from({length:10000},(_,n)=>({n,...stat(D,n,k)})),[D,k]);
 const rows=useMemo(()=>{const val=(x:typeof all[number])=>sk==="n"?x.n:sk==="w"?x.w:(x.since??1e9);return all.filter(x=>!q||p4(x.n).includes(q)).sort((a,b)=>(val(a)-val(b))*dir||a.n-b.n)},[all,sk,dir,q]);
 const pages=Math.max(1,Math.ceil(rows.length/50)),p=Math.min(pg,pages-1);
 return <div className="card"><h2>All 10,000 numbers</h2><PrizePick/>
  <div className="row"><select aria-label="Sort by" value={sk} onChange={e=>{setSk(e.target.value as SK);setPg(0)}}><option value="w">Most wins</option><option value="since">Longest since last win</option><option value="n">Number</option></select>
  <button onClick={()=>setDir(-dir)}>{dir<0?"High to low":"Low to high"}</button>
  <input inputMode="numeric" placeholder="Contains digits…" style={{width:150}} aria-label="Filter by digits" value={q} onChange={e=>{setQ(e.target.value.replace(/\D/g,""));setPg(0)}}/></div>
  <Legend k={k}/>
  <div className="scroll"><table><thead><tr><th>Number</th><th>Wins</th><th>Last won</th><th>Draws since</th><th>Status</th></tr></thead>
  <tbody>{rows.slice(p*50,p*50+50).map(x=>{const c=heat(D,x.since,k);return <tr key={x.n} className={c}><td className="n">{p4(x.n)}</td><td>{x.w}</td><td>{x.last}</td><td>{x.since??"never"}</td><td>{HL[c]}</td></tr>})}</tbody></table></div>
  <div className="pg"><button onClick={()=>setPg(Math.max(0,p-1))}>Previous</button><span className="mut sm">Page {p+1} of {pages} ({rows.length.toLocaleString()} numbers)</span><button onClick={()=>setPg(Math.min(pages-1,p+1))}>Next</button></div></div>;
}
