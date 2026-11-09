import {useState} from "react";
import type {ReactNode} from "react";
import {NavLink,Route,Routes} from "react-router-dom";
import {useApp} from "./store";
import Home from "./pages/Home";import Lookup from "./pages/Lookup";import Numbers from "./pages/Numbers";import Digits from "./pages/Digits";import Gaps from "./pages/Gaps";import Bets from "./pages/Bets";import About from "./pages/About";
const links:[string,string][]=[["/","Home"],["/lookup","Lookup"],["/numbers","All numbers"],["/digits","Digits"],["/gaps","Gaps"],["/bets","Bets"],["/about","How 4D works"]];
export default function App(){
 const {d,err}=useApp(),[,setT]=useState(0);
 const Need=({children}:{children:ReactNode})=>d?<>{children}</>:<p className="mut">{err||"Loading results…"}</p>;
 const toggle=()=>{const e=document.documentElement,c=e.dataset.theme||(matchMedia("(prefers-color-scheme:dark)").matches?"dark":"light");e.dataset.theme=c==="dark"?"light":"dark";setT(x=>x+1)};
 return <>
  <header className="site"><div className="in"><NavLink className="brand" to="/">🎲 4D Explorer</NavLink>
   <nav>{links.map(([to,t])=><NavLink key={to} to={to} end={to==="/"}>{t}</NavLink>)}</nav>
   <button onClick={toggle} aria-label="Toggle light or dark theme">◐</button></div></header>
  <main className="wrap"><Routes>
   <Route path="/" element={<Home/>}/><Route path="/about" element={<About/>}/>
   <Route path="/lookup/:n?" element={<Need><Lookup/></Need>}/><Route path="/numbers" element={<Need><Numbers/></Need>}/>
   <Route path="/digits" element={<Need><Digits/></Need>}/><Route path="/gaps" element={<Need><Gaps/></Need>}/><Route path="/bets" element={<Bets/>}/>
  </Routes></main>
  <footer className="site"><div className="wrap"><p className="mut sm">Data: Singapore Pools results as supplied in a CSV. A win means the number appeared as the prize type selected. If you or someone you know is struggling with gambling, call the National Problem Gambling Helpline: 1800-6-668-668.</p><p className="mut sm">Independent project, not affiliated with Singapore Pools.</p></div></footer></>;
}
