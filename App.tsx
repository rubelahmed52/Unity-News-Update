import {useEffect,useState} from 'react';
import {Routes,Route,Link,useNavigate,useParams} from 'react-router-dom';
import {Search, Menu, X, Clock, ChevronRight, LogIn, Plus, Trash2, Pencil} from 'lucide-react';
import {supabase} from './supabase';

type News={id:string;title:string;slug:string;excerpt?:string;content:string;image_url?:string;category?:string;author?:string;published_at:string;is_published:boolean;is_breaking:boolean;is_featured:boolean};
const demo:News[]=[
{id:'1',title:'ইউনিটি নিউজ আপডেটের যাত্রা শুরু',slug:'unity-news-update-launch',excerpt:'এটি একটি ডেমো সংবাদ। বাস্তব সংবাদ প্রকাশের আগে তথ্য যাচাই করুন।',content:'এটি ডেমো কনটেন্ট। Supabase সংযুক্ত হলে Admin Panel থেকে প্রকৃত সংবাদ প্রকাশ করতে পারবেন।',image_url:'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1200&q=80',category:'সর্বশেষ',author:'ইউনিটি নিউজ',published_at:new Date().toISOString(),is_published:true,is_breaking:true,is_featured:true}
];

function Layout({children}:{children:React.ReactNode}){const [open,setOpen]=useState(false);const cats=['সর্বশেষ','জাতীয়','আন্তর্জাতিক','রাজনীতি','খেলাধুলা','প্রযুক্তি','বিনোদন','অর্থনীতি','শিক্ষা','স্বাস্থ্য','ধর্ম','স্থানীয়'];return <><header><div className="top"><button className="icon" onClick={()=>setOpen(!open)}>{open?<X/>:<Menu/>}</button><Link to="/" className="brand"><b>ইউনিটি</b> নিউজ আপডেট</Link><Link to="/search" className="icon"><Search/></Link></div><nav className={open?'show':''}>{cats.map(c=><Link onClick={()=>setOpen(false)} key={c} to={c==='সর্বশেষ'?'/':`/category/${encodeURIComponent(c)}`}>{c}</Link>)}</nav></header><div className="breaking"><b>🚨 ব্রেকিং</b><div>সর্বশেষ সংবাদ জানতে ইউনিটি নিউজ আপডেটের সঙ্গে থাকুন</div></div>{children}<footer><b>ইউনিটি নিউজ আপডেট</b><p>সত্য, তথ্যভিত্তিক ও দায়িত্বশীল সংবাদ প্রকাশের প্রত্যয়।</p><div><Link to="/about">আমাদের সম্পর্কে</Link> · <Link to="/contact">যোগাযোগ</Link> · <Link to="/privacy">Privacy</Link></div><small>© 2026 ইউনিটি নিউজ আপডেট. All Rights Reserved.</small></footer></>}

function Card({n}:{n:News}){return <Link className="card" to={`/news/${n.slug}`}><img src={n.image_url||'https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=800&q=80'}/><div><span>{n.category||'সর্বশেষ'}</span><h3>{n.title}</h3><p>{n.excerpt}</p><small><Clock size={14}/> {new Date(n.published_at).toLocaleString('bn-BD')}</small></div></Link>}

function Home(){const [news,setNews]=useState<News[]>(demo);useEffect(()=>{(async()=>{if(!supabase)return;const {data}=await supabase.from('news').select('*').eq('is_published',true).order('published_at',{ascending:false});if(data?.length)setNews(data)})()},[]);return <Layout><main><section className="hero"><div><span className="tag">সর্বশেষ সংবাদ</span><h1>{news[0].title}</h1><p>{news[0].excerpt}</p><Link className="btn" to={`/news/${news[0].slug}`}>বিস্তারিত পড়ুন <ChevronRight/></Link></div><img src={news[0].image_url!}/></section><Ad/><h2>সর্বশেষ সংবাদ</h2><section className="grid">{news.map(n=><Card key={n.id} n={n}/>)}</section></main></Layout>}

function Ad(){return <div className="ad">বিজ্ঞাপনের স্থান — এখানে আপনার Adsterra Banner Code বসবে</div>}

function Article(){
  const {slug}=useParams();
  const [n,setN]=useState<News|null>(null);

  useEffect(()=>{
    (async()=>{
      if(!supabase)return;
      const {data}=await supabase
        .from('news')
        .select('*')
        .eq('slug',slug)
        .single();

      if(data)setN(data);
    })();
  },[slug]);

  const article=n||demo.find(x=>x.slug===slug)||null;

  if(!article)
    return <Layout><main><h2>সংবাদ পাওয়া যায়নি</h2></main></Layout>;

  return <Layout>
    <main className="article">
      <span className="tag">{article.category}</span>
      <h1>{article.title}</h1>
      <small>
        লেখক: {article.author||'ইউনিটি নিউজ'} · {new Date(article.published_at).toLocaleString('bn-BD')}
      </small>
      <img className="article-img" src={article.image_url}/>
      <Ad/>
      <div className="content">{article.content}</div>
      <Ad/>
    </main>
  </Layout>;
      }
function SearchPage(){const [q,setQ]=useState('');const [res,setRes]=useState<News[]>([]);async function go(){if(supabase){const {data}=await supabase.from('news').select('*').eq('is_published',true).ilike('title',`%${q}%`);setRes(data||[])}else setRes(demo.filter(x=>x.title.includes(q)))}return <Layout><main><h1>সংবাদ খুঁজুন</h1><div className="search"><input value={q} onChange={e=>setQ(e.target.value)} placeholder="সংবাদের শিরোনাম লিখুন..."/><button onClick={go}>খুঁজুন</button></div><section className="grid">{res.map(n=><Card key={n.id} n={n}/>)}</section></main></Layout>}

function Admin(){const nav=useNavigate();const [session,setSession]=useState<any>(null);const [email,setEmail]=useState('');const [password,setPassword]=useState('');const [title,setTitle]=useState('');const [content,setContent]=useState('');const [saving,setSaving]=useState(false);const [items,setItems]=useState<News[]>([]);useEffect(()=>{if(!supabase)return;supabase.auth.getSession().then(({data})=>setSession(data.session));supabase.auth.onAuthStateChange((_e,s)=>setSession(s));},[]);async function login(){if(!supabase)return alert('প্রথমে Supabase সংযোগ করুন।');const {error}=await supabase.auth.signInWithPassword({email,password});if(error)alert(error.message)}async function save(){if(!supabase||!session)return;setSaving(true);const slug=title.toLowerCase().replace(/[^a-z0-9\\s-]/g,'').trim().replace(/\\s+/g,'-')||`news-${Date.now()}`;const {error}=await supabase.from('news').insert({title,slug,content,excerpt:content.slice(0,150),category:'সর্বশেষ',author:session.user.email,is_published:true});setSaving(false);if(error)alert(error.message);else{setTitle('');setContent('');alert('সংবাদ প্রকাশ হয়েছে')}}if(!supabase||!session)return <Layout><main className="admin"><h1>Admin Login</h1><input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)}/><input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)}/><button className="btn" onClick={login}><LogIn/> Login</button><p className="hint">Supabase Auth চালু করে Admin user তৈরি করুন।</p></main></Layout>;return <Layout><main className="admin"><h1>Admin Dashboard</h1><input placeholder="সংবাদের শিরোনাম" value={title} onChange={e=>setTitle(e.target.value)}/><textarea placeholder="সংবাদের বিস্তারিত..." value={content} onChange={e=>setContent(e.target.value)}/><button className="btn" disabled={saving} onClick={save}><Plus/> {saving?'প্রকাশ হচ্ছে...':'সংবাদ প্রকাশ করুন'}</button><button onClick={async()=>{await supabase.auth.signOut();nav('/admin')}}>Logout</button></main></Layout>}

function Static({title,children}:{title:string;children:React.ReactNode}){return <Layout><main><h1>{title}</h1><p>{children}</p></main></Layout>}
export default function App(){return <Routes><Route path="/" element={<Home/>}/><Route path="/news/:slug" element={<Article/>}/><Route path="/search" element={<SearchPage/>}/><Route path="/admin/*" element={<Admin/>}/><Route path="/about" element={<Static title="আমাদের সম্পর্কে">ইউনিটি নিউজ আপডেট একটি অনলাইন সংবাদ প্ল্যাটফর্ম। প্রকাশের আগে তথ্য যাচাই করা আমাদের লক্ষ্য।</Static>}/><Route path="/contact" element={<Static title="যোগাযোগ">আপনার মতামত ও সংবাদ তথ্যের জন্য আমাদের সঙ্গে যোগাযোগ করুন।</Static>}/><Route path="/privacy" element={<Static title="Privacy Policy">আপনার গোপনীয়তা আমাদের কাছে গুরুত্বপূর্ণ।</Static>}/><Route path="/category/:cat" element={<Home/>}/></Routes>}
