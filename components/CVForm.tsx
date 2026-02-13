
import React, { useState, useRef } from 'react';

interface CVFormProps {
  onSubmit: (cv: string, jd: string) => void;
  isLoading: boolean;
}

const CVForm: React.FC<CVFormProps> = ({ onSubmit, isLoading }) => {
  const [cvText, setCvText] = useState('');
  const [fileName, setFileName] = useState('');
  const [jd, setJd] = useState('');
  const [jdType, setJdType] = useState<'text' | 'url'>('text');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const extractTextFromPDF = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const typedarray = new Uint8Array(reader.result as ArrayBuffer);
          // @ts-ignore (using script from index.html)
          const pdf = await pdfjsLib.getDocument({ data: typedarray }).promise;
          let fullText = "";
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            fullText += textContent.items.map((item: any) => item.str).join(" ") + "\n";
          }
          resolve(fullText);
        } catch (e) {
          reject(e);
        }
      };
      reader.readAsArrayBuffer(file);
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    if (file.type === 'application/pdf') {
      try {
        const text = await extractTextFromPDF(file);
        setCvText(text);
      } catch (err) {
        alert("Erreur lors de la lecture du PDF. Veuillez essayer de copier-coller le texte.");
      }
    } else if (file.type === 'text/plain') {
      const text = await file.text();
      setCvText(text);
    } else {
      alert("Format non supporté. Veuillez utiliser un fichier PDF ou TXT.");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cvText.trim() && jd.trim()) {
      onSubmit(cvText, jd);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* CV Upload Section */}
        <div className="space-y-4">
          <label className="block text-sm font-semibold text-slate-700">
            Votre CV (PDF ou TXT)
            <span className="block font-normal text-xs text-slate-500 mt-1">Téléchargez votre CV pour qu'il soit analysé par l'IA.</span>
          </label>
          <div 
            onClick={() => fileInputRef.current?.click()}
            className={`
              w-full h-[300px] border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-6 cursor-pointer transition-all
              ${fileName ? 'border-indigo-400 bg-indigo-50' : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50'}
            `}
          >
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".pdf,.txt"
              className="hidden" 
            />
            {fileName ? (
              <div className="text-center">
                <span className="text-4xl mb-2 block">📄</span>
                <p className="font-semibold text-indigo-700">{fileName}</p>
                <p className="text-xs text-slate-500 mt-2">Cliquez pour modifier le fichier</p>
              </div>
            ) : (
              <div className="text-center">
                <span className="text-4xl mb-4 block text-slate-300">📤</span>
                <p className="text-slate-600 font-medium">Glissez votre fichier ici ou cliquez pour parcourir</p>
                <p className="text-xs text-slate-400 mt-2">PDF ou TXT uniquement</p>
              </div>
            )}
          </div>
          {cvText && (
            <div className="p-3 bg-emerald-50 text-emerald-700 rounded-lg text-xs flex items-center gap-2">
              <span className="text-sm">✓</span> Texte extrait avec succès ({cvText.length} caractères)
            </div>
          )}
        </div>

        {/* Job Description Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-semibold text-slate-700">
              Offre d'Emploi Ciblée
            </label>
            <div className="flex bg-slate-100 p-1 rounded-lg text-[10px] font-bold uppercase">
              <button 
                type="button"
                onClick={() => setJdType('text')}
                className={`px-3 py-1 rounded-md transition-all ${jdType === 'text' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400'}`}
              >
                Texte
              </button>
              <button 
                type="button"
                onClick={() => setJdType('url')}
                className={`px-3 py-1 rounded-md transition-all ${jdType === 'url' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400'}`}
              >
                Lien
              </button>
            </div>
          </div>
          <span className="block font-normal text-xs text-slate-500 -mt-2">
            {jdType === 'text' ? "Copiez le texte de l'offre d'emploi." : "Collez l'URL vers l'annonce (LinkedIn, Indeed, etc.)"}
          </span>
          {jdType === 'text' ? (
            <textarea
              required
              value={jd}
              onChange={(e) => setJd(e.target.value)}
              className="w-full h-[300px] p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none bg-white shadow-sm transition-all text-sm leading-relaxed"
              placeholder="Nous recherchons un collaborateur passionné..."
            />
          ) : (
            <input
              type="url"
              required
              value={jd}
              onChange={(e) => setJd(e.target.value)}
              className="w-full p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white shadow-sm transition-all text-sm"
              placeholder="https://www.linkedin.com/jobs/view/..."
            />
          )}
          <div className="p-3 bg-amber-50 text-amber-700 rounded-lg text-xs">
            💡 Astuce: L'IA analysera l'offre pour en extraire les mots-clés ATS vitaux.
          </div>
        </div>
      </div>

      <div className="flex justify-center pt-4">
        <button
          type="submit"
          disabled={isLoading || !cvText.trim() || !jd.trim()}
          className={`
            px-8 py-4 rounded-full font-bold text-lg shadow-xl transition-all flex items-center gap-3
            ${isLoading 
              ? 'bg-slate-300 cursor-not-allowed' 
              : 'bg-indigo-600 hover:bg-indigo-700 text-white transform hover:-translate-y-1 active:scale-95'
            }
          `}
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Analyse en cours...
            </>
          ) : 'Optimiser mon CV maintenant'}
        </button>
      </div>
    </form>
  );
};

export default CVForm;
