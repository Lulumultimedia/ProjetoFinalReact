import React, { useState, useEffect } from "react"; 
import "./App.css"
import ChatBot from "react-chatbotify";
import LlmConnector from "@rcb-plugins/llm-connector";
import { GeminiProvider } from "@rcb-plugins/llm-connector";
import { TextField, Button } from "@mui/material";
import { db } from "./firebase";
import Todo from "./components/Todo"; 
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from "firebase/firestore";

function App() { 
  // ✅ TODOS os states e funções DENTRO do componente
  const [movies, setMovies] = useState([
    { id: 0, title: '“Prometeu viral, entregou 3 likes”', votes: 0 },
    { id: 1, title: '"Briefing mais confuso do ano"', votes: 0 },
    { id: 2, title: '"Design aprovado na sexta às 18h"', votes: 0 },
    { id: 3, title: '"Urgente há 3 semanas"', votes: 0 },
    { id: 4, title: '"Versão final_v7_agoraVai"', votes: 0 },
    { id: 5, title: '"Ideia copiada com orgulho"', votes: 0 },
  ]);
  
  const [history, setHistory] = useState([]);
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState("");

  const handleVote = (id) => {
    setMovies(prev => prev.map(m => m.id === id ? { ...m, votes: m.votes + 1 } : m));
    setHistory(prev => [...prev, id]);
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    const lastId = history[history.length - 1];
    setMovies(prev => prev.map(m => m.id === lastId ? { ...m, votes: Math.max(0, m.votes - 1) } : m));
    setHistory(prev => prev.slice(0, -1));
  };

  const handleReset = () => {
    if (window.confirm("Tem certeza que deseja zerar todos os votos?")) {
      setMovies(movies.map(m => ({ ...m, votes: 0 })));
      setHistory([]);
    }
  };

  const totalVotes = movies.reduce((a, b) => a + b.votes, 0);
  const winner = [...movies].sort((a, b) => b.votes - a.votes)[0];

  // Firebase
  const q = query(collection(db, 'tm16projetofinal'), orderBy('timestamp', 'desc'));

  useEffect(() => {
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setTodos(snapshot.docs.map(doc => ({
        id: doc.id,
        item: doc.data()
      })));
    });
    return () => unsubscribe();
  }, []);

  const addTodo = (e) => {
    e.preventDefault();
    addDoc(collection(db, "tm16projetofinal"), {
      todo: input,
      timestamp: serverTimestamp()
    });
    setInput('');
  };

  const MyChatBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const apiKey = "AIzaSyAIWl6L8OTwAuO67Ji7xLZvyXrI4bXJCMI";
  
    const toggleChat = () => {
      setIsOpen(!isOpen);
    };
  
    const settings = {
      general: { embedded: true },
      header: { 
        title: isOpen ? "💬 Lulu Responde" : "💬 Clique para abrir", 
        avatar: "https://ibb.co/4nW2tnxz",
        height: 60
      },
      chatHistory: { storageKey: "lulu_toggle" },
    };
  
    const plugins = [LlmConnector()];
    const flow = {   
      start: { 
        message: "Oi! Sou a Lulu! Como posso te ajudar? 😊",
        path: "gemini",
      },
      gemini: {
        llmConnector: {
          provider: new GeminiProvider({
            mode: 'direct',
            model: 'gemini-2.5-flash',
            apiKey: apiKey,
          }),
          outputType: 'character',
        },
      },
    };
  
    const themes = [{ id: "midnight_black", version: "0.1.0" }];
  
    return (
      <div style={{ 
        position: 'fixed', 
        bottom: 20, 
        right: 20, 
        width: 400, 
        zIndex: 1000,
        borderRadius: 16,
        overflow: 'hidden',
        boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
        transition: 'all 0.3s ease'
      }}>
        {/* ✅ HEADER SEMPRE VISÍVEL (minimizado) */}
        <div 
          style={{
            height: 60,
            background: '#1a1a1a',
            display: 'flex',
            alignItems: 'center',
            padding: '0 20px',
            cursor: 'pointer',
            borderRadius: '16px 16px 0 0',
            color: '#fff',
            fontWeight: 'bold',
            border: '1px solid #333',
            justifyContent: 'space-between'
          }}
          onClick={toggleChat}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <img src="https://ibb.co/4nW2tnxz" alt="Lulu" style={{ width: 40, height: 40, borderRadius: '50%' }} />
            <span>{isOpen ? "💬 Lulu Responde" : "💬 Fale com Lulu"}</span>
          </div>
          <span style={{ fontSize: '20px' }}>
            {isOpen ? '−' : '▲'}
          </span>
        </div>
  
        {/* ✅ CONTEÚDO DO CHAT (só quando aberto) */}
        {isOpen && (
          <div style={{ 
            height: 440, 
            background: '#111', 
            border: '1px solid #333',
            borderTop: 'none',
            borderRadius: '0 0 16px 16px',
            overflow: 'hidden'
          }}>
            <ChatBot 
              themes={themes} 
              settings={settings} 
              flow={flow} 
              plugins={plugins} 
            />
          </div>
        )}
      </div>
    );
  };

  // ✅ TODO O JSX ORIGINAL AQUI
  return (
    <div style={styles.page}>
      <nav style={styles.navbar}>
        <div style={styles.logo}>Mudou tudo depois do aprovado <span style={{fontWeight: '300', color: '#ffcc00'}}>🤣</span></div>
        <div style={styles.stats}>
          Votos Totais: <strong style={{ color: '#ffffff', fontSize: '1.2rem' }}>{totalVotes}</strong>
        </div>
      </nav>
    
      <MyChatBot/>
      <header style={styles.hero}>
        <h1 style={styles.heroTitle}>Prêmio: "Esta reunião poderia ser um e-mail" </h1>
        <p style={styles.heroSub}>Vote na sua frase favorita</p>
      </header>

      <figure className="diff aspect-16/9 max-w-md mx-auto" tabIndex={0}>
        <div className="diff-item-1" role="img" tabIndex={0}>
          <img alt="" src="https://ibb.co/MyxJpZzH" />
        </div>
        <div className="diff-item-2" role="img">
          <img alt="" src="https://ibb.co/HTvqc2ML" />
        </div>
        <div className="diff-resizer"></div>
      </figure>

      <main style={styles.mainContainer}>
        <div style={styles.grid}>
          {movies.map(movie => (
            <div key={movie.id} style={styles.card} onClick={() => handleVote(movie.id)}>
              <div style={styles.cardContent}>
                <h2 style={styles.phraseText}>{movie.title}</h2>
                <div style={styles.voteBox}>
                  <span style={styles.voteNumber}>{movie.votes}</span>
                </div>
                <button style={styles.cardBtn}>VOTAR</button>
              </div>
            </div>
          ))}
        </div>

        <div style={styles.buttonGroup}>
          <button 
            onClick={handleUndo} 
            disabled={history.length === 0}
            style={{...styles.undoBtn, opacity: history.length > 0 ? 1 : 0.2}}
          >
            ↩ Desfazer último voto
          </button>

          <button 
            onClick={handleReset} 
            disabled={totalVotes === 0}
            style={{...styles.resetBtn, opacity: totalVotes > 0 ? 1 : 0.2}}
          >
            🗑️ Zerar Votação
          </button>
        </div>
      </main>
      
      <section style={styles.winnerSection}>
        <div style={styles.winnerCard}>
          <p style={styles.winnerLabel}>🏆 A MAIS VOTADA ATÉ AGORA</p>
          <h2 style={styles.winnerTitle}>
            {totalVotes > 0 ? winner.title : "Aguardando votos..."}
          </h2>
          {totalVotes > 0 && (
            <p style={styles.winnerVotes}>{winner.votes} votos conquistados</p>
          )}
        </div>
        <br/><br/>

        <div className="App">
          <h2>Deixe sua sugestão de frases para a próxima Premiação</h2>
          <form onSubmit={addTodo}>
            <TextField 
               id="outlined-basic" 
               label="Escreva aqui" 
               variant="outlined" 
               sx={{ 
                 margin: "0px 5px",
                 '& .MuiOutlinedInput-root': {
                   '& fieldset': {
                     borderColor: '#ffcc00',
                   },
                   '&:hover fieldset': {
                     borderColor: '#ffcc00',
                   },
                   '&.Mui-focused fieldset': {
                     borderColor: 'darkyellow',
                   },
                 },
               }}
               size="small" 
               value={input}
               onChange={e => setInput(e.target.value)} 
            />
            <Button type="submit" variant="contained" 
  sx={{
    backgroundColor: '#ffcc00', color: '#000000',boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
  '&:hover': {backgroundColor: '#fdd835', boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
    },
  }}
>
  Enter
</Button>
          </form>
          <ul>
            {todos.map(item => <Todo key={item.id} arr={item} />)}
          </ul>
        </div>
      </section>

      <footer style={styles.footer}>
        <p>© 2026 Pérolas Brasileiras - Nem sempre é meme!!</p>
      </footer>
    </div>
  );
}

// ✅ Styles no final (fora da função)
const styles = {
  page: { 
    backgroundColor: '#0a0a0a', 
    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)), url('https://images.unsplash.com/photo-1516306580123-e6e52b1b7b5f?q=80&w=2126&auto=format&fit=crop')`, 
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed', 
    color: '#fff', 
    minHeight: '100vh', 
    width: '100vw', 
    margin: 0, 
    fontFamily: 'system-ui, sans-serif', 
    overflowX: 'hidden' 
  },
  navbar: { 
    display: 'flex', justifyContent: 'space-between', padding: '0 40px', height: '70px', 
    alignItems: 'center', backgroundColor: '#000', borderBottom: '1px solid #222', boxSizing: 'border-box' 
  },
  logo: { fontSize: '1.1rem', fontWeight: 'bold' },
  stats: { fontSize: '0.9rem' }, // ✅ ADICIONADO
  hero: { padding: '60px 40px 20px', textAlign: 'center' },
  heroTitle: { fontSize: 'clamp(1.2rem, 4vw, 2.2rem)', fontWeight: '900', margin: 0, letterSpacing: '1px' },
  heroSub: { color: '#666', fontSize: '1rem', marginTop: '10px' },
  mainContainer: { padding: '40px', width: '100%', boxSizing: 'border-box' },
  grid: { 
    display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
    gap: '20px', width: '100%' 
  },
  card: { 
    backgroundColor: '#111', borderRadius: '20px', border: '1px solid #222', 
    cursor: 'pointer', transition: '0.2s ease' 
  },
  cardContent: { padding: '40px 30px', textAlign: 'center' },
  phraseText: { 
    fontSize: '1.4rem', minHeight: '80px', margin: 0, display: 'flex', 
    alignItems: 'center', justifyContent: 'center', color: '#ffcc00', fontWeight: '800' 
  },
  voteBox: { margin: '20px 0' },
  voteNumber: { fontSize: '2.5rem', fontWeight: 'bold', display: 'block' },
  cardBtn: { 
    width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #333', 
    backgroundColor: 'transparent', color: '#fff', fontWeight: 'bold', pointerEvents: 'none' 
  },
  buttonGroup: { 
    display: 'flex', 
    justifyContent: 'center', 
    gap: '15px', 
    marginTop: '40px',
    flexWrap: 'wrap' 
  },
  undoBtn: { 
    backgroundColor: '#1a1a1a', 
    color: '#FFCB00', 
    border: '1px solid #FFCB00', 
    padding: '12px 25px', 
    borderRadius: '30px', 
    cursor: 'pointer',
    fontSize: '0.9rem',
    transition: '0.3s'
  },
  resetBtn: { 
    backgroundColor: 'transparent', 
    color: '#FFCB00', 
    border: '1px solid #FFCB00', 
    padding: '12px 25px', 
    borderRadius: '30px', 
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: 'bold',
    transition: '0.3s'
  },
  winnerSection: { padding: '60px 40px', textAlign: 'center' },
  winnerCard: { 
    padding: '50px 20px', border: '1px solid #ffd700', borderRadius: '30px', 
    backgroundColor: 'rgba(255, 215, 0, 0.02)' 
  },
  winnerLabel: { color: '#ffd700', fontWeight: 'bold' },
  winnerTitle: { fontSize: 'clamp(1.5rem, 5vw, 2.5rem)', margin: '15px 0' },
  winnerVotes: { color: '#666' },
  footer: { padding: '40px', textAlign: 'center', color: '#333' }
};

export default App;
