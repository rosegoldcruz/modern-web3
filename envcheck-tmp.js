const fs = require("fs");
const txt = fs.readFileSync(process.cwd() + "/.env.local", "utf8");
const lines = txt.split(/\r?\n/);
function val(key) {
  const l = lines.find((x) => x.startsWith(key + "="));
  if (!l) return undefined;
  return l.slice(key.length + 1).trim().replace(/^["']|["']$/g, "");
}
const srv = val("SUPABASE_URL");
const pub = val("NEXT_PUBLIC_SUPABASE_URL");
const norm = (u) => (u || "").replace(/^https?:\/\//, "").replace(/\/+$/, "");
console.log("SUPABASE_URL defined:", !!srv, "len:", srv ? srv.length : 0, "validScheme:", srv ? /^https?:\/\//.test(srv) : false);
console.log("NEXT_PUBLIC_SUPABASE_URL defined:", !!pub, "len:", pub ? pub.length : 0, "validScheme:", pub ? /^https?:\/\//.test(pub) : false);
console.log("hosts equal (after scheme):", norm(srv) === norm(pub));
console.log("host equal:", norm(srv).split("/")[0] === norm(pub).split("/")[0]);
console.log("pub contains supabase.co:", pub ? pub.includes("supabase.co") : false);
// is NEXT_PUBLIC_SUPABASE_ANON_KEY present?
console.log("NEXT_PUBLIC_SUPABASE_ANON_KEY present:", lines.some((x) => x.startsWith("NEXT_PUBLIC_SUPABASE_ANON_KEY=")));
