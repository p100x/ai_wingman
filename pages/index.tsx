import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { useRef, useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import DropDown, { VibeType } from '../components/DropDown';
import Footer from '../components/Footer';
import Header from '../components/Header';
import LoadingDots from '../components/LoadingDots';
import {
  createParser,
  ParsedEvent,
  ReconnectInterval,
} from 'eventsource-parser';
// Import der Toggle-Komponente bleibt, aber wird nicht verwendet
// import Toggle from '../components/Toggle';

const Home: NextPage = () => {
  const [loading, setLoading] = useState(false);
  const [bio, setBio] = useState('');
  const [vibe, setVibe] = useState<VibeType>('Professional');
  const [generatedBios, setGeneratedBios] = useState<String>('');
  // GPT wird standardmäßig verwendet, also wird der Zustand auskommentiert
  // const [isGPT, setIsGPT] = useState(true);

  const bioRef = useRef<null | HTMLDivElement>(null);

  const scrollToBios = () => {
    if (bioRef.current !== null) {
      bioRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const prompt = `Generiere 3 ${
    vibe === 'Casual' ? 'relaxed' : vibe === 'Funny' ? 'silly' : 'Professional'
  } Antworten für einen Chat auf Tinder mit dem obersten Ziel ein Date zu ergattern, gelabeled als "1.", "2.", and "3.". Gib nur diese drei Nachrichten zurück, nichts anderes. ${
    vibe === 'Funny' ? 'Make the text humorous' : ''
  }Nutze dabei diesen Text als Ausgangspunkt der Unterhaltung: ${bio}${
    bio.slice(-1) === '.' ? '' : '.'
  }`;

  const generateBio = async (e: any) => {
    e.preventDefault();
    setGeneratedBios('');
    setLoading(true);
    const response = await fetch('/api/openai', { // Direkt '/api/openai' verwenden
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
      }),
    });

    // Der Rest der Logik zum Parsen und Setzen des generierten Textes bleibt unverändert
  };

  return (
    <div className="flex max-w-5xl mx-auto flex-col items-center justify-center py-2 min-h-screen">
      <Head>
        <title>K.I. Wingman</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />
      <main className="flex flex-1 w-full flex-col items-center justify-center text-center px-4 mt-12 sm:mt-20">
        {/* Schalter auskommentiert, um ihn im Code zu behalten, aber nicht anzuzeigen
        <div className="mt-7">
          <Toggle isGPT={isGPT} setIsGPT={setIsGPT} />
        </div>
        */}
        <p className="border rounded-2xl py-1 px-4 text-slate-500 text-sm mb-5 hover:scale-105 transition duration-300 ease-in-out">
          <b>96,434</b> Dates geklärt
        </p>
        <h1 className="sm:text-6xl text-4xl max-w-[708px] font-bold text-slate-900">
          Dein AI-Wingman klärt jedes Date
        </h1>
        <div className="max-w-xl w-full">
          {/* Rest des Formulars und der UI */}
          {/* Hier folgt der restliche Code für die Benutzeroberfläche, unverändert */}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
