import {K,PL,PR,HL} from "./lib/data";
import type {Heat,Key} from "./lib/data";
import {useApp} from "./store";
export const PrizePick=()=>{const {k,setK}=useApp();return <div className="row sm"><label><b>Prize type</b> <select value={k} onChange={e=>setK(e.target.value as Key)}>{K.map(x=><option key={x} value={x}>{PL[x]}</option>)}</select></label><span className="mut">A “win” means appearing as this prize.</span></div>};
export const Legend=({k}:{k?:Key})=>{const mu=k?10000/PR[k]:0;return <div className="sm" style={{margin:"8px 0"}}>{(["g","y","a","r"] as Heat[]).map((c,i)=><span key={c} className={"chip "+c}>{HL[c]}: {["under ½","½ to 1×","1 to 2×","over 2×"][i]}</span>)}<span className="mut">of the average wait for {k?PL[k]:"that prize type"}{k?` (about ${Math.round(mu).toLocaleString()} draws, ${(mu/156).toFixed(1)} years)`:""}. Colours describe history only; they don’t change anyone’s odds.</span></div>};
