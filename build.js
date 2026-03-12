const fs = require('fs');

const SUPABASE_URL  = process.env.SUPABASE_URL;
const SUPABASE_ANON = process.env.SUPABASE_ANON;

if (!SUPABASE_URL || !SUPABASE_ANON) {
  console.error('❌ Missing env vars: SUPABASE_URL and/or SUPABASE_ANON');
  console.error('   Set them in Vercel → Project Settings → Environment Variables');
  process.exit(1);
}

// Inject into contact.html
let html = fs.readFileSync('contact.html', 'utf8');
html = html.replace('%%SUPABASE_URL%%',  SUPABASE_URL);
html = html.replace('%%SUPABASE_ANON%%', SUPABASE_ANON);
fs.writeFileSync('contact.html', html);
console.log('✅ Injected into contact.html');

// Inject into test.html
let test = fs.readFileSync('test.html', 'utf8');
test = test.replace('%%SUPABASE_URL%%',  SUPABASE_URL);
test = test.replace('%%SUPABASE_ANON%%', SUPABASE_ANON);
fs.writeFileSync('test.html', test);
console.log('✅ Injected into test.html');
