import React, { useState, useEffect, useRef } from "react";
import { BrowserRouter, Routes, Route, Link, useNavigate } from "react-router-dom";

// ---------- Mock data ----------
const initialStories = [
  {
    id: 1,
    title: "Diwali — Lights at Home",
    author: "Asha",
    tags: ["Festival", "Family"],
    excerpt:
      "Every year our house would be lit with diyas and the smell of cardamom sweets filled the air...",
    image: "https://images.unsplash.com/photo-1542736667-069246bdbc53?auto=format&fit=crop&w=800&q=60",
    content:
      "Diwali in our family meant visiting elders, preparing sweets together, and telling stories about how our ancestors used to celebrate in the village...",
  },
  {
    id: 2,
    title: "Monsoon Recipes: Grandma's Khichdi",
    author: "Rohit",
    tags: ["Cuisine", "Family"],
    excerpt: "A simple khichdi that chased away the rainy day blues...",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=60",
    content:
      "When the first monsoon drops arrive, my grandma would light the clay stove and make khichdi with jaggery and ghee...",
  },
];

// ---------- Helpers ----------
function saveStories(list) {
  localStorage.setItem("rootprints_stories", JSON.stringify(list));
}
function loadStories() {
  const raw = localStorage.getItem("rootprints_stories");
  if (!raw) return initialStories;
  try {
    const parsed = JSON.parse(raw);
    return parsed.length ? parsed : initialStories;
  } catch (e) {
    return initialStories;
  }
}

// ---------- App ----------
export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white text-gray-800">
        <Nav />
        <main className="max-w-5xl mx-auto p-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/share" element={<Share />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/about" element={<About />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

// ---------- Nav ----------
function Nav() {
  return (
    <header className="bg-white/60 backdrop-blur sticky top-0 z-30 border-b">
      <div className="max-w-5xl mx-auto flex items-center justify-between p-4">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-amber-200 flex items-center justify-center text-amber-800 font-semibold">RP</div>
          <div>
            <h1 className="text-lg font-semibold">Rootprints</h1>
            <p className="text-xs text-gray-500">Keeping culture close to the heart</p>
          </div>
        </Link>
        <nav className="flex items-center gap-3">
          <NavLink to="/explore">Explore</NavLink>
          <NavLink to="/share">Share your story</NavLink>
          <NavLink to="/chat">Cultural Chat</NavLink>
          <NavLink to="/about">About</NavLink>
          <NavLink to="/profile">Profile</NavLink>
        </nav>
      </div>
    </header>
  );
}
function NavLink({ to, children }) {
  return (
    <Link
      to={to}
      className="text-sm px-3 py-2 rounded hover:bg-amber-50 hover:shadow-sm transition"
    >
      {children}
    </Link>
  );
}

// ---------- Home ----------
function Home() {
  const navigate = useNavigate();
  return (
    <section className="py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div>
          <h2 className="text-4xl font-extrabold mb-4">Rootprints</h2>
          <p className="text-gray-700 mb-6 leading-relaxed">
            Preserve and celebrate cultural heritage in a personalized, emotionally resonant
            digital format. Share memories, discover traditions, and connect with community.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/explore')}
              className="px-5 py-3 bg-amber-600 text-white rounded shadow"
            >
              Explore heritage
            </button>
            <button
              onClick={() => navigate('/share')}
              className="px-5 py-3 border rounded"
            >
              Share your story
            </button>
          </div>
        </div>
        <div className="rounded-lg overflow-hidden shadow">
          <img
            src="https://images.unsplash.com/photo-1509099836639-18ba79b1c4b3?auto=format&fit=crop&w=1200&q=60"
            alt="Heritage"
            className="w-full h-64 object-cover"
          />
        </div>
      </div>

      <div className="mt-12">
        <h3 className="text-2xl font-semibold mb-4">Featured stories</h3>
        <ExplorePreview />
      </div>
    </section>
  );
}

function ExplorePreview() {
  const [stories] = useState(() => loadStories());
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {stories.slice(0, 2).map((s) => (
        <article key={s.id} className="bg-white rounded-lg shadow p-4 flex gap-4">
          <img src={s.image} alt="story" className="w-28 h-20 object-cover rounded" />
          <div>
            <h4 className="font-semibold">{s.title}</h4>
            <p className="text-xs text-gray-500">by {s.author}</p>
            <p className="mt-2 text-sm text-gray-600">{s.excerpt}</p>
            <div className="mt-3 flex gap-2">
              <Link to="/explore" className="text-sm text-amber-600">Read more →</Link>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

// ---------- Explore ----------
function Explore() {
  const [stories, setStories] = useState(() => loadStories());
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    saveStories(stories);
  }, [stories]);

  const filtered = stories.filter((s) => {
    const matchesQuery = s.title.toLowerCase().includes(query.toLowerCase()) || s.excerpt.toLowerCase().includes(query.toLowerCase());
    const matchesFilter = filter === "All" || s.tags.includes(filter);
    return matchesQuery && matchesFilter;
  });

  return (
    <section>
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search stories, traditions..." className="px-3 py-2 border rounded w-72" />
          <select value={filter} onChange={(e) => setFilter(e.target.value)} className="px-3 py-2 border rounded">
            <option>All</option>
            <option>Festival</option>
            <option>Cuisine</option>
            <option>Folklore</option>
            <option>Family</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {filtered.map((s) => (
          <StoryCard key={s.id} story={s} onDelete={() => setStories((prev) => prev.filter((p) => p.id !== s.id))} />
        ))}
      </div>

      {filtered.length === 0 && <p className="mt-6 text-gray-500">No stories found. Try adjusting your search.</p>}
    </section>
  );
}

function StoryCard({ story, onDelete }) {
  const [open, setOpen] = useState(false);
  return (
    <article className="bg-white rounded-lg shadow overflow-hidden">
      <img src={story.image} alt={story.title} className="w-full h-44 object-cover" />
      <div className="p-4">
        <h4 className="font-semibold text-lg">{story.title}</h4>
        <p className="text-xs text-gray-500">by {story.author}</p>
        <p className="mt-2 text-sm text-gray-600">{story.excerpt}</p>
        <div className="mt-3 flex items-center gap-3">
          <button onClick={() => setOpen(true)} className="text-sm text-amber-600">Read more</button>
          <button onClick={onDelete} className="text-sm text-red-500">Delete</button>
        </div>
      </div>

      {open && (
        <div className="p-4 border-t bg-amber-50">
          <p className="text-sm text-gray-800">{story.content}</p>
          <div className="mt-3">
            <button onClick={() => setOpen(false)} className="text-sm">Close</button>
          </div>
        </div>
      )}
    </article>
  );
}

// ---------- Share ----------
function Share() {
  const [stories, setStories] = useState(() => loadStories());
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [tags, setTags] = useState("");
  const [desc, setDesc] = useState("");
  const [image, setImage] = useState(null);

  useEffect(() => saveStories(stories), [stories]);

  function handleImage(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImage(reader.result);
    reader.readAsDataURL(file);
  }

  function submit(e) {
    e.preventDefault();
    const newStory = {
      id: Date.now(),
      title: title || "Untitled memory",
      author: author || "Anonymous",
      tags: tags ? tags.split(",").map(t => t.trim()) : ["Uncategorized"],
      excerpt: desc.slice(0, 120) + (desc.length > 120 ? "..." : ""),
      image: image || "https://images.unsplash.com/photo-1504198266285-165f5e2f3d0d?auto=format&fit=crop&w=800&q=60",
      content: desc || "",
    };
    const updated = [newStory, ...stories];
    setStories(updated);
    saveStories(updated);
    // reset
    setTitle(""); setAuthor(""); setTags(""); setDesc(""); setImage(null);
    alert("Story submitted! It will appear in Explore.");
  }

  return (
    <section>
      <h2 className="text-2xl font-semibold mb-4">Share your roots</h2>
      <form onSubmit={submit} className="bg-white rounded-lg shadow p-6 grid grid-cols-1 gap-4">
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" className="px-3 py-2 border rounded" />
        <input value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Your name (optional)" className="px-3 py-2 border rounded" />
        <input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="Tags (comma separated)" className="px-3 py-2 border rounded" />
        <textarea value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Tell your story..." rows={6} className="px-3 py-2 border rounded" />

        <label className="flex items-center gap-3">
          <input type="file" accept="image/*,audio/*,video/*" onChange={handleImage} />
          <span className="text-sm text-gray-500">Upload image, audio or short video (optional)</span>
        </label>

        {image && <img src={image} alt="preview" className="w-48 h-32 object-cover rounded" />}

        <div className="flex gap-3">
          <button type="submit" className="px-4 py-2 bg-amber-600 text-white rounded">Submit</button>
          <button type="button" onClick={() => { setTitle(""); setAuthor(""); setTags(""); setDesc(""); setImage(null); }} className="px-4 py-2 border rounded">Reset</button>
        </div>
      </form>

      <p className="mt-4 text-sm text-gray-500">Your story will be saved locally for the prototype. For production we can connect Supabase or another backend.</p>
    </section>
  );
}

// ---------- Chat (AI Companion) ----------
function Chat() {
  const [messages, setMessages] = useState(() => [{ id: 1, sender: 'bot', text: 'Hi — I am Root, your cultural companion. Tell me what you want to explore or share!' }]);
  const [input, setInput] = useState('');
  const ref = useRef(null);

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  function send() {
    if (!input.trim()) return;
    const userMsg = { id: Date.now(), sender: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    // simple simulated bot reply
    setTimeout(() => {
      const reply = generateReply(userMsg.text);
      setMessages(prev => [...prev, { id: Date.now()+1, sender: 'bot', text: reply }]);
    }, 700 + Math.random() * 800);
  }

  return (
    <section>
      <h2 className="text-2xl font-semibold mb-4">Cultural Chat — Root</h2>
      <div className="bg-white rounded-lg shadow p-4 h-96 flex flex-col">
        <div className="flex-1 overflow-auto mb-3">
          {messages.map(m => (
            <div key={m.id} className={`mb-3 max-w-[85%] ${m.sender === 'bot' ? 'text-left' : 'ml-auto text-right'}`}>
              <div className={`inline-block px-3 py-2 rounded ${m.sender === 'bot' ? 'bg-amber-50' : 'bg-amber-600 text-white'}`}>
                {m.text}
              </div>
            </div>
          ))}
          <div ref={ref} />
        </div>

        <div className="flex items-center gap-3">
          <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask Root about a festival, tradition, or how to share your story..." className="flex-1 px-3 py-2 border rounded" />
          <button onClick={send} className="px-4 py-2 bg-amber-600 text-white rounded">Send</button>
        </div>
      </div>
    </section>
  );
}

function generateReply(input) {
  const q = input.toLowerCase();
  if (q.includes('how') && q.includes('share')) return "You can share a story by visiting Share → filling title, description, and uploading an image or audio. Start with a memory that matters to you.";
  if (q.includes('festival') || q.includes('diwali') || q.includes('pongal')) return "Festivals connect families — tell me which festival you'd like to explore and I can show related stories or suggest questions to ask elders.";
  if (q.includes('recipe') || q.includes('food') || q.includes('khichdi')) return "Food is a living memory — write down the recipe and who used to cook it. We can store it as a 'monsoon recipe' memory.";
  if (q.includes('hello') || q.includes('hi')) return "Hi! Tell me about a tradition from your hometown — I'll help you turn it into a shareable story.";
  return "That's beautiful — can you tell me a detail or a memory? For example: 'I remember my grandmother's song' or 'We used to...'";
}

// ---------- About ----------
function About() {
  return (
    <section>
      <h2 className="text-2xl font-semibold mb-4">About Rootprints</h2>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="mb-4">Rootprints preserves cultural heritage by giving people a safe, warm place to store family memories, traditions, rituals, and recipes. We believe every story, however small, helps keep culture alive.</p>
        <p className="mb-2">Mission: Keep culture close to the heart — one story at a time.</p>
        <p className="text-sm text-gray-500">Prototype note: This interactive prototype saves data locally in your browser. For production we recommend Supabase (auth + storage) or any managed backend.</p>
      </div>
    </section>
  );
}

// ---------- Profile ----------
function Profile() {
  const [stories] = useState(() => loadStories());
  return (
    <section>
      <h2 className="text-2xl font-semibold mb-4">Your Profile</h2>
      <p className="text-sm text-gray-600 mb-4">Mock profile view — stories you created or saved will appear below.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {stories.map(s => (
          <div key={s.id} className="bg-white rounded-lg shadow p-4">
            <h4 className="font-semibold">{s.title}</h4>
            <p className="text-xs text-gray-500">by {s.author}</p>
            <p className="mt-2 text-sm text-gray-600">{s.excerpt}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

