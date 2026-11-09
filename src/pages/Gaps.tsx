import {PL,PR} from "../lib/data";
import {useApp} from "../store";
import {PrizePick} from "../ui";
export default function Gaps(){
 const {d,k}=useApp(),D=d!,g:number[]=[];
 D.H[k].forEach(h=>{for(let i=1;i<h.length;i++)g.push(h[i]-h[i-1])});g.sort((a,b)=>a-b);
 if(!g.length)return <div className="card"><PrizePick/><p>No repeat wins for {PL[k]} yet.</p></div>;
 const m=g.reduce((a,b)=>a+b,0)/g.length,md=g[g.length>>1],p=PR[k]/10000,mu=1/p,Z=1-Math.pow(1-p,D.span-1);
 const E=[1,...[.1,.25,.5,.75,1,1.5,2,3].map(x=>Math.round(x*mu)+1),Infinity];
 return <div className="card"><h2>Time between wins</h2><PrizePick/>
  <div className="grid"><div className="stat"><b>{Math.round(m)}</b>mean draws between wins<br/><span className="mut sm">≈ {(m/156).toFixed(1)} years</span></div>
  <div className="stat"><b>{md}</b>median<br/><span className="mut sm">≈ {(md/156).toFixed(1)} years</span></div>
  <div className="stat"><b>{g.filter(x=>x===1).length}</b>wins in back-to-back draws</div></div>
  <p className="mut sm">“Expected” is what pure chance gives ({(p*100).toFixed(2)}% per draw per number). When the columns match, a long wait doesn’t make a number more likely to win.</p>
  <div className="scroll"><table><thead><tr><th>Draws between wins</th><th>Actual</th><th>Expected</th></tr></thead><tbody>
  {E.slice(0,-1).map((a,i)=>{const b=E[i+1],o=g.filter(x=>x>=a&&x<b).length/g.length,e=Math.max(0,Math.pow(1-p,a-1)-Math.pow(1-p,Math.min(b,D.span)-1))/Z;
   return <tr key={a}><td>{a}–{b===Infinity?"more":b-1}</td><td className="bar" style={{"--w":`${(o*220).toFixed(0)}%`} as React.CSSProperties}>{(o*100).toFixed(1)}%</td><td className="ex">{(e*100).toFixed(1)}%</td></tr>})}</tbody></table></div></div>;
}
