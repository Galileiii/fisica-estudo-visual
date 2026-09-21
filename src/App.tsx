import { useEffect, useState } from 'react';
import { MODULOS } from './content/curriculum';
import { Dashboard } from './pages/Dashboard';
import { ModuloPage } from './pages/Modulo';
import { LicaoPage } from './pages/Licao';
import { DecifrePage } from './pages/Decifre';
import { ResumoPage } from './pages/Resumo';
import { ProgressProvider } from './state/progress';
import { useLocalState } from './lib/hooks';

/* ------------------------------------------------------------------ */
/* Roteador mínimo baseado no #hash (dá para copiar o link de uma lição) */
/* ------------------------------------------------------------------ */

function usarRota() {
  const ler = () => window.location.hash.replace(/^#/, '') || '/';
  const [rota, setRota] = useState(ler);

  useEffect(() => {
    const onHash = () => setRota(ler());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const ir = (path: string) => {
    window.location.hash = path;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return { rota, ir };
}

function Conteudo({ rota, ir }: { rota: string; ir: (p: string) => void }) {
  const partes = rota.split('/').filter(Boolean);

  if (partes[0] === 'm' && partes[1]) return <ModuloPage id={partes[1]} go={ir} />;
  if (partes[0] === 'l' && partes[1] && partes[2]) return <LicaoPage moduloId={partes[1]} licaoId={partes[2]} go={ir} />;
  if (partes[0] === 'decifre') return <DecifrePage />;
  if (partes[0] === 'resumo') return <ResumoPage />;
  return <Dashboard go={ir} />;
}

export default function App() {
  const { rota, ir } = usarRota();
  const [tema, setTema] = useLocalState<'dark' | 'light'>('fisica-visual:tema', 'dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', tema);
  }, [tema]);

  const ativo = (prefixo: string) => rota.startsWith(prefixo);

  return (
    <ProgressProvider>
      <div className="app">
        <nav className="topbar">
          <button className="brand" onClick={() => ir('/')}>
            <span className="brand-mark">🔭</span>
            <span className="brand-name">
              FÍSICA <span>VISUAL</span>
            </span>
          </button>

          <div className="topnav">
            {MODULOS.map((m) => (
              <button key={m.id} className={`navbtn ${ativo(`/m/${m.id}`) || ativo(`/l/${m.id}`) ? 'active' : ''}`} onClick={() => ir(`/m/${m.id}`)}>
                {m.emoji} {m.nome}
              </button>
            ))}
            <button className={`navbtn ${ativo('/decifre') ? 'active' : ''}`} onClick={() => ir('/decifre')}>
              🧩 Decifre
            </button>
            <button className={`navbtn ${ativo('/resumo') ? 'active' : ''}`} onClick={() => ir('/resumo')}>
              🗺️ Fórmulas
            </button>
            <button
              className="iconbtn"
              title={tema === 'dark' ? 'Mudar para tema claro' : 'Mudar para tema escuro'}
              onClick={() => setTema(tema === 'dark' ? 'light' : 'dark')}
            >
              {tema === 'dark' ? '☀️' : '🌙'}
            </button>
          </div>
        </nav>

        <main className="page">
          <Conteudo rota={rota} ir={ir} />
        </main>
      </div>
    </ProgressProvider>
  );
}
