# ইউনিটি নিউজ আপডেট — Mobile Upload Version

এই সংস্করণটি মোবাইল দিয়ে GitHub-এ সহজে আপলোড করার জন্য তৈরি করা হয়েছে। কোনো `src` বা `supabase` folder দরকার নেই।

## GitHub upload
একই folder-এর সব ফাইল select করে repository-তে upload করুন। `package.json` অবশ্যই root-এ থাকবে।

## Supabase
`schema.sql` ফাইলটি Supabase SQL Editor-এ চালান।

## Vercel / Cloudflare
Build command: `npm run build`
Output directory: `dist`

Environment variables:
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
