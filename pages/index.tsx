import Head from 'next/head';
import type { NextPage } from 'next';
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
const Home: NextPage = () => {
  const [loading, setLoading] = useState(false);
const [hoverEffect, setHoverEffect] = useState(false);
  const [bio, setBio] = useState('');
  const [vibe, setVibe] = useState<VibeType>('Locker');
  const [generatedBios, setGeneratedBios] = useState<String>('');
  const [datesCount, setDatesCount] = useState(96434); // Initialer Wert der Dates
const dateCountRef = useRef<HTMLParagraphElement>(null); // Ref für das Date-Element

  const bioRef = useRef<null | HTMLDivElement>(null);
  const scrollToBios = () => {
    if (bioRef.current !== null) {
      bioRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };
const prompt = `Generiere 3 ${
  vibe === 'Locker' ? 'entspannte' : vibe === 'Lustig' ? 'witzige' : vibe === 'Horny' ? 'sehr aufs äußere bezogene und erotisch betonte' : 'coole'
} Antworten für einen Chat auf einer Dating-App wie ein erfahrener Dating-Coach es seinen Schülern vormachen würde, gelabeled als "1.", "2.", and "3.". Gib nur diese drei Nachrichten zurück, nichts anderes, stets ohne Anführungszeichen. ${
  vibe === 'Lustig' ? 'Mache den Text humorvoll' : ''
}Schreibe wie ein junger Mensch, schreibe Alltagssprache, vermeide hohle Phrasen und Smalltalk um jeden Preis. Nutze Jugendslang wenn angebracht. Nutze dabei diesen Text als Ausgangspunkt der Unterhaltung: ${bio}${
  bio.slice(-1) === '.' ? '' : '.'
}`;
  console.log({ prompt });
  console.log({ generatedBios });
  const generateBio = async (e: any) => {
    e.preventDefault();
    setGeneratedBios('');
    setLoading(true);
    const response = await fetch('/api/openai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
      }),
    });
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    // This data is a ReadableStream
    const data = response.body;
    if (!data) {
      return;
    }
    const onParseGPT = (event: ParsedEvent | ReconnectInterval) => {
      if (event.type === 'event') {
        const data = event.data;
        try {
          const text = JSON.parse(data).text ?? '';
          setGeneratedBios((prev) => prev + text);
        } catch (e) {
          console.error(e);
        }
      }
    };
    const onParse = onParseGPT;
    // https://web.dev/streams/#the-getreader-and-read-methods
    const reader = data.getReader();
    const decoder = new TextDecoder();
    const parser = createParser(onParse);
    let done = false;
    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);
      parser.feed(chunkValue);
    }
    scrollToBios();
    setLoading(false);
  };
  return (
    <div className="flex max-w-5xl mx-auto flex-col items-center justify-center py-2 min-h-screen">
      <Head>
        <title>K.I. Wingman</title>
        <link rel="icon" href="/favicon.ico" />
               {/* Mouseflow Tracking Code */}
        <script type="text/javascript">
          {`window._mfq = window._mfq || [];
            (function() {
              var mf = document.createElement("script");
              mf.type = "text/javascript"; mf.defer = true;
              mf.src = "//cdn.mouseflow.com/projects/6bd134ad-13a2-4655-9832-519adff62bb3.js";
              document.getElementsByTagName("head")[0].appendChild(mf);
            })();`}
        </script>
         {/* Google Adsense Script hinzufügen */}
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6460745798968355"
      crossOrigin="anonymous"></script>
      </Head>
      <Header />
      <main className="flex flex-1 w-full flex-col items-center justify-center text-center px-4 mt-12 sm:mt-20">
        <p className="border rounded-2xl py-1 px-4 text-slate-500 text-sm mb-5 hover:scale-105 transition duration-300 ease-in-out">
          <b>96,434</b> Dates geklärt
        </p>
        <h1 className="sm:text-6xl text-4xl max-w-[708px] font-bold text-slate-900">
          Du hast kein Rizz? Der RizzoMat regelt.
        </h1>
  
        <div className="max-w-xl w-full">
          <div className="flex mt-10 items-center space-x-3">
            <Image
              src="/1-black.png"
              width={30}
              height={30}
              alt="1 icon"
              className="mb-5 sm:mb-0"
            />
            <p className="text-left font-medium">
              Ihre/Seine letzte Nachricht an dich{' '}
              <span className="text-slate-500">(oder leer lassen)</span>.
            </p>
          </div>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={4}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black my-5"
            placeholder={'Kopiere deinen Chatverlauf hier hinein, damit die Künstliche Intelligenz die optimale Antwort finden kann.'}
          />
          <div className="flex mb-5 items-center space-x-3">
            <Image src="/2-black.png" width={30} height={30} alt="1 icon" />
            <p className="text-left font-medium">Wähle deinen Vibe.</p>
          </div>
          <div className="block">
            <DropDown vibe={vibe} setVibe={(newVibe) => setVibe(newVibe)} />
          </div>
          {!loading && (
            <button
              className="bg-black rounded-xl text-white font-medium px-4 py-2 sm:mt-10 mt-8 hover:bg-black/80 w-full"
              onClick={(e) => generateBio(e)}
            >
              Antworten generieren &rarr;
            </button>
          )}
          {loading && (
            <button
              className="bg-black rounded-xl text-white font-medium px-4 py-2 sm:mt-10 mt-8 hover:bg-black/80 w-full"
              disabled
            >
              <LoadingDots color="white" style="large" />
            </button>
          )}
        </div>
        <Toaster
          position="top-center"
          reverseOrder={false}
          toastOptions={{ duration: 2000 }}
        />
        <hr className="h-px bg-gray-700 border-1 dark:bg-gray-700" />
        <div className="space-y-10 my-10">
          {generatedBios && (
            <>
              <div>
                <h2
                  className="sm:text-4xl text-3xl font-bold text-slate-900 mx-auto"
                  ref={bioRef}
                >
                  Deine KI-optimierte Antworten:
                </h2>
              </div>
              <div className="space-y-8 flex flex-col items-center justify-center max-w-xl mx-auto">
                {generatedBios
                  .substring(generatedBios.indexOf('1') + 3)
                  .split(/2\.|3\./)
                  .map((generatedBio) => {
                    return (
                      <div
                        className="bg-white rounded-xl shadow-md p-4 hover:bg-gray-100 transition cursor-copy border"
                        onClick={() => {
                          navigator.clipboard.writeText(generatedBio);
                          toast('Text kopiert', {
                            icon: '✂️',
                          });
                        }}
                        key={generatedBio}
                      >
                        <p>{generatedBio}</p>
                      </div>
                    );
                  })}
              </div>
            </>
          )}
        </div>
      </main>
  <div className="seo-text-section my-10 px-4">
  <h2 className="text-3xl font-bold text-center mb-4">Finde die perfekten Anmachsprüche mit KI-Unterstützung</h2>
  <p className="text-lg text-center max-w-4xl mx-auto mb-6">
    Willkommen beim Rizzomat – deinem ultimativen Tool für innovative und unwiderstehliche Anmachsprüche, die in Deutschland Furore machen. In einer Welt, in der der erste Eindruck zählt, geben wir dir die Geheimwaffe an die Hand, um mit Selbstbewusstsein und Charme ins Gespräch einzusteigen. Ob du nach einem humorvollen Einstieg, einem süßen Kompliment oder etwas Kühnem und Direktem suchst, der Rizzomat nutzt fortschrittliche KI-Technologie, um dir maßgeschneiderte Sprüche zu liefern, die nicht nur Aufmerksamkeit erregen, sondern auch Herzen erobern.
  </p>
  <h3 className="text-2xl font-semibold text-center mb-4">Warum KI-Anmachsprüche?</h3>
  <p className="text-lg text-center max-w-4xl mx-auto mb-6">
    In der heutigen digitalisierten Welt hat sich die Kunst des Flirtens weiterentwickelt. Standardisierte Anmachsprüche aus dem Internet reichen nicht mehr aus, um sich von der Masse abzuheben. Hier kommt der Rizzomat ins Spiel: Unsere KI analysiert eine Vielzahl von Faktoren – von aktuellen Trends bis hin zu psychologischen Nuancen –, um Anmachsprüche zu generieren, die authentisch, kreativ und vor allem effektiv sind.
  </p>
  <h3 className="text-2xl font-semibold text-center mb-4">Individualität, die begeistert</h3>
  <p className="text-lg text-center max-w-4xl mx-auto mb-6">
    Egal, ob du die Dating-Welt auf Tinder, Bumble oder im realen Leben erkundest, der erste Schritt zum Erfolg liegt in der Einzigartigkeit. Mit dem Rizzomat kannst du deine Persönlichkeit durch maßgeschneiderte Sprüche zum Ausdruck bringen, die zu deinem Stil und deiner Stimmung passen. Wähle aus Kategorien wie "locker", "lustig", "erotisch" oder "cool" und finde den Vibe, der am besten zu dir passt.
  </p>
  <h3 className="text-2xl font-semibold text-center mb-4">Dein Erfolg ist unser Ziel</h3>
  <p className="text-lg text-center max-w-4xl mx-auto mb-8">
    Mit bereits über 96.434 erfolgreich geklärten Dates und einer ständig wachsenden Community ist der Rizzomat mehr als nur eine Plattform – es ist ein Beweis dafür, dass die richtigen Worte den Unterschied machen können. Unsere Mission ist es, dir nicht nur beim Start des Gesprächs zu helfen, sondern auch dabei, echte Verbindungen und unvergessliche Momente zu schaffen.
  </p>
  <h3 className="text-2xl font-semibold text-center mb-4">Beginne jetzt deine Erfolgsgeschichte</h3>
  <p className="text-lg text-center max-w-4xl mx-auto">
    Bereit, dein Dating-Spiel auf das nächste Level zu heben? Der Rizzomat ist hier, um dir mit den neuesten KI-generierten Anmachsprüchen auf Deutsch zu Seite zu stehen. Tauche ein in die Welt des modernen Flirtens, wo Innovation auf Charme trifft, und entdecke, wie unsere KI-Anmachsprüche den Unterschied in deinem Liebesleben machen können.
  </p>
</div>
      <Footer />
    </div>
  );
};
export default Home;
