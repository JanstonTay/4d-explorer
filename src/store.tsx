import {createContext,useContext,useEffect,useState} from "react";
import type {ReactNode} from "react";
import {build} from "./lib/data";
import type {Data,Key,Raw} from "./lib/data";
interface Ctx{d:Data|null;k:Key;setK:(k:Key)=>void;load:(r:Raw[])=>void;err:string}
const C=createContext<Ctx>(null!);
export const useApp=()=>useContext(C);
export function Provider({children}:{children:ReactNode}){
 const [d,setD]=useState<Data|null>(null),[k,setK]=useState<Key>("any"),[err,setErr]=useState("");
 useEffect(()=>{fetch(`${import.meta.env.BASE_URL}data/draws.json`).then(r=>r.json()).then((r:Raw[])=>setD(build(r))).catch(()=>setErr("Couldn't load data/draws.json. Run npm run data."))},[]);
 return <C.Provider value={{d,k,setK,load:r=>setD(build(r)),err}}>{children}</C.Provider>;
}
