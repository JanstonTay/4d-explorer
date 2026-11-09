export default function About(){
 const rows:[string,string,string][]=[["1st","$2,000","$3,000"],["2nd","$1,000","$2,000"],["3rd","$490","$800"],["Starter","$250","none"],["Consolation","$60","none"]];
 return <div className="prose"><h1>How 4D works</h1>
  <p>You pick a number from 0000 to 9999 and bet Big or Small. Each draw (Wednesday, Saturday, Sunday) produces 23 winning numbers: one 1st, one 2nd, one 3rd, ten Starter and ten Consolation. Ordinary bets must match exactly and in order.</p>
  <div className="card scroll"><table><thead><tr><th>Prize per $1</th><th>Big</th><th>Small</th></tr></thead><tbody>{rows.map(r=><tr key={r[0]}><td>{r[0]}</td><td>{r[1]}</td><td>{r[2]}</td></tr>)}</tbody></table></div>
  <h2>Bet types</h2><ul><li><b>Ordinary:</b> one exact number, $1.</li><li><b>System Entry:</b> every order of your digits, each costing as an ordinary bet (1234 has 24 orders, so $24).</li><li><b>iBet:</b> every order for one fixed price, with the prize shared across the orders.</li><li><b>4D Roll:</b> one digit replaced by R, covering 10 numbers for 10 times the price.</li><li><b>Quick Pick:</b> a random number.</li></ul>
  <h2>The data</h2><p>Results come from a CSV of draws from 31 May 1986. The CSV has no prize column, so prize types are read from row order (1st, 2nd, 3rd, 10 Starter, 10 Consolation), which fits how Singapore Pools lists them. Some early draws had a different prize count. Prize amounts and rules are from the Singapore Pools 4D Game Rules; check the official site for current terms.</p>
  <h2>Gamble responsibly</h2><p>If you or someone you know is struggling with gambling, call the National Problem Gambling Helpline: 1800-6-668-668.</p></div>;
}
