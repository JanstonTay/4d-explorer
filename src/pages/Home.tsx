import {useState} from "react";
import {Link,useNavigate} from "react-router-dom";
import {parseCsv} from "../lib/data";
import {useApp} from "../store";
export default function Home(){
 const {d,load}=useApp(),nav=useNavigate(),[q,setQ]=useState(""),[msg,setMsg]=useState("");
 const tiles:[string,string,string][]=[["/numbers","All 10,000 numbers","Sort by wins or time since last win, colour-coded by prize type."],["/digits","Digit frequency","How evenly 0-9 appear overall and in each position."],["/gaps","Gaps between wins","Actual waits compared with what pure chance predicts."],["/bets","Bet calculator","Cost, coverage and prizes for Ordinary, System, iBet and Roll."]];
 const file=async(f?:File)=>{if(!f)return;const r=parseCsv(await f.text());if(r.length){load(r);setMsg("")}else setMsg("Couldn't read that file. Expected columns: draw_number, number, date.")};
 return <><div className="hero"><h1>Singapore 4D, by the numbers</h1>
  <p className="lead">Every winning number since 1986: how often each has come out, as which prize, and how long ago.</p>
  <form className="row" onSubmit={e=>{e.preventDefault();nav("/lookup/"+q)}}><input className="big" inputMode="numeric" maxLength={4} placeholder="0000" aria-label="Check a number" value={q} onChange={e=>setQ(e.target.value.replace(/\D/g,""))}/><button className="primary">Check this number</button></form>
  {d&&<div className="mut sm">{d.N.toLocaleString()} draws, {d.draws[0].dt} to {d.draws[d.N-1].dt} (latest draw #{d.last}).{d.missing>0&&<b style={{color:"var(--hot)"}}> {d.missing} draws in this range are missing.</b>}</div>}
  <label className="btn sm" style={{display:"inline-block",marginTop:10}}>Load newer CSV<input type="file" accept=".csv" hidden onChange={e=>file(e.target.files?.[0])}/></label> {msg&&<span style={{color:"var(--hot)"}} className="sm">{msg}</span>}</div>
  <div className="cards">{tiles.map(t=><Link key={t[0]} className="tile" to={t[0]}><h2>{t[1]}</h2><p>{t[2]}</p></Link>)}</div>
  <div className="card warn"><b>History can’t predict the next draw.</b> Each draw is random, so every number from 0000 to 9999 has the same chance each time. On average a $1 Big bet returns about 66¢ and a Small bet about 58¢. Use this site to explore the data, not to find a “due” number.</div></>;
}
