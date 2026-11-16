// Shared: fills the 業務預報表 template. Used by the page and by the node test.
function fullContent(x) {
  const who = `${x.person || ""}${x.title || ""}`;
  return who ? `前往拜訪${who}，${x.content}` : x.content;
}
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
      const blank = (v) => (!v || v === "無" || v === "空白") ? null : v;
      ws.getCell(`C${row}`).value = x ? blank(x.location) : null;
      ws.getCell(`D${row}`).value = x ? blank(x.client) : null;
      let text = x ? fullContent(x).replace(/\s*\n\s*/g, "；") : null;
      if (x && r === 7 && items.length > 8) {
        const extra = items.slice(8).map((y) => `${y.client}：${fullContent(y).replace(/\s*\n\s*/g, "；")}`);
        text += "；" + extra.join("；");
        overflow.push(ymd(d));
      }
      const ec = ws.getCell(`E${row}`);
      ec.value = text;
      if (text === "特休" || text === "連假") ec.style = { ...ec.style, alignment: { ...(ec.style.alignment || {}), horizontal: "center", vertical: "middle" } };
      if (x && x.followup) notes.push(`${x.client}：${x.followup}${x.done ? "(已完成)" : ""}`);
    }
    ws.getCell(`F${top}`).value = notes.length ? notes.join("\n") : null;
    const fc = ws.getCell(`F${top}`);
    if (notes.length) fc.style = { ...fc.style, alignment: { ...(fc.style.alignment || {}), wrapText: true, vertical: "top" } };
  }
  return overflow;
}

if (typeof module !== "undefined") module.exports = { fillTemplate, fullContent, zhNum };
