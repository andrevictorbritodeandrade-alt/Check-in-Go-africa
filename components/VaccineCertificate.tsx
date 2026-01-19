import React from 'react';
import { Syringe, ShieldCheck, FileText } from 'lucide-react';

const VaccineCertificate: React.FC = () => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="p-8 bg-white rounded-[32px] text-slate-800 text-center shadow-xl border border-slate-100 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-yellow-400 via-orange-500 to-yellow-400"></div>
        
        <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-amber-100">
          <Syringe className="w-10 h-10 text-amber-600" />
        </div>

        <h2 className="text-2xl font-display font-black mb-3 text-slate-800 uppercase leading-tight">
          Vacina Febre Amarela <span className="text-amber-600">(CIVP)</span>
        </h2>
        
        <p className="mb-8 text-slate-500 font-medium leading-relaxed">
          O Certificado Internacional de Vacinação ou Profilaxia é <strong className="text-slate-800">obrigatório</strong> para brasileiros entrando na África do Sul.
        </p>

        <div className="bg-amber-50 p-6 rounded-2xl border-2 border-amber-200/50 text-sm text-amber-900 text-left relative">
           <ShieldCheck className="w-6 h-6 text-amber-600 mb-2" />
           <p className="font-bold mb-1">Documento Obrigatório</p>
           <p className="leading-relaxed opacity-80">
             Tenha sempre em mãos o documento físico original (papel amarelo) ou o PDF validado pelo ConecteSUS impresso.
           </p>
        </div>
      </div>

      <div className="bg-slate-50 p-6 rounded-[24px] border border-slate-200">
         <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-500" />
            Checklist Rápido
         </h3>
         <ul className="space-y-3">
            <li className="flex items-start gap-3 text-sm text-slate-600">
                <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-green-600 text-xs font-bold">1</span>
                </div>
                <span>Vacina tomada pelo menos <strong>10 dias antes</strong> da viagem.</span>
            </li>
            <li className="flex items-start gap-3 text-sm text-slate-600">
                <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-green-600 text-xs font-bold">2</span>
                </div>
                <span>Certificado <strong>Internacional</strong> (não serve o do posto de saúde).</span>
            </li>
            <li className="flex items-start gap-3 text-sm text-slate-600">
                <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-green-600 text-xs font-bold">3</span>
                </div>
                <span>O nome no certificado deve ser igual ao do passaporte.</span>
            </li>
         </ul>
      </div>
    </div>
  );
};

export default VaccineCertificate;