import {p4} from "../lib/data";
import {useApp} from "../store";
import {PrizePick} from "../ui";
export default function Digits(){
 const {d,k}=useApp(),D=d!,c:number[][]=Array.from({length:5},()=>Array<number>(10).fill(0)),t=[0,0,0,0,0];
 for(let n=0;n<10000;n++){const w=D.H[k][n].length,s=p4(n);for(let p=0;p<4;p++){c[p+1][+s[p]]+=w;c[0][+s[p]]+=w}t[0]+=w*4;for(let p=1;p<5;p++)t[p]+=w}
 const mx=Math.max(...c.flatMap((a,j)=>a.map(v=>v/t[j])));
 return <div className="card"><h2>Digit frequency</h2><PrizePick/>
  <p className="mut sm">Share of winning digits, overall and by position. If draws are fair, every cell sits near 10%.</p>
  <div className="scroll"><table><thead><tr><th>Digit</th><th>Overall</th><th>1st</th><th>2nd</th><th>3rd</th><th>4th</th></tr></thead>
  <tbody>{Array.from({length:10},(_,x)=><tr key={x}><td className="n">{x}</td>{c.map((a,j)=>{const pc=a[x]/t[j];return <td key={j} className="bar" style={{"--w":`${(pc/mx*100).toFixed(0)}%`} as React.CSSProperties}>{(pc*100).toFixed(2)}%</td>})}</tr>)}</tbody></table></div></div>;
}
