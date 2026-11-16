// Shared: fills the 業務預報表 template. Used by the page and by the node test.
function zhNum(n) {
  const d = ["零","一","二","三","四","五","六","七","八","九"];
  if (n < 10) return d[n];
  if (n < 20) return "十" + (n % 10 ? d[n % 10] : "");
  return d[Math.floor(n / 10)] + "十" + (n % 10 ? d[n % 10] : "");
}
function fillTemplate(ws, opts) {
  // opts: {monday: Date, week: number, staff: string, entries: [{date:'YYYY-MM-DD', time, location, client, content, followup, done}]}
  const pad = (n) => String(n).padStart(2, "0");
  const ymd = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const DOW = ["一","二","三","四","五"];
  ws.getCell("A2").value = `週期:第${zhNum(opts.week)}週`;
  ws.getCell("E2").value = opts.staff;
  const overflow = [];
  for (let i = 0; i < 5; i++) {
    const d = new Date(opts.monday.getFullYear(), opts.monday.getMonth(), opts.monday.getDate() + i);
    const top = 4 + i * 8;
    ws.getCell(`A${top}`).value = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    ws.getCell(`B${top}`).value = DOW[i];
    const items = opts.entries.filter((x) => x.date === ymd(d));
    const notes = [];
    for (let r = 0; r < 8; r++) {
      const row = top + r;
      const x = items[r];
      ws.getCell(`C${row}`).value = x ? (x.location || "") : null;
      ws.getCell(`D${row}`).value = x ? x.client : null;
      let text = x ? x.content.replace(/\s*\n\s*/g, "；") : null;
      if (x && r === 7 && items.length > 8) {
        const extra = items.slice(8).map((y) => `${y.client}：${y.content.replace(/\s*\n\s*/g, "；")}`);
        text += "；" + extra.join("；");
        overflow.push(ymd(d));
      }
      ws.getCell(`E${row}`).value = text;
      if (x && x.followup) notes.push(`${x.client}：${x.followup}${x.done ? "(已完成)" : ""}`);
    }
    ws.getCell(`F${top}`).value = notes.length ? notes.join("\n") : null;
    if (notes.length) ws.getCell(`F${top}`).alignment = { ...(ws.getCell(`F${top}`).alignment || {}), wrapText: true, vertical: "top" };
  }
  return overflow;
}
if (typeof module !== "undefined") module.exports = { fillTemplate, zhNum };
