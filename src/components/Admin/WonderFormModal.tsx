/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState } from 'react';
import {
  X,
  Upload,
  Loader2,
  Save,
  Compass,
  Plus,
  Trash2,
  Sparkles,
  MapPin,
  CheckCircle2,
  Image as ImageIcon,
} from 'lucide-react';
import { NaturalWonder, WonderFact } from '../../data/wondersData';
import { NaturalWonderInput, uploadWonderImage } from '../../lib/wonderService';

const ANGOLA_PROVINCES = [
  'Bengo',
  'Benguela',
  'Bié',
  'Cabinda',
  'Cuando Cubango',
  'Cuanza Norte',
  'Cuanza Sul',
  'Cunene',
  'Huambo',
  'Huíla',
  'Luanda',
  'Lunda Norte',
  'Lunda Sul',
  'Malanje',
  'Moxico',
  'Namibe',
  'Uíge',
  'Zaire',
];

interface WonderFormModalProps {
  initialWonder: NaturalWonder | null;
  onClose: () => void;
  onSave: (id: string | null, input: NaturalWonderInput) => Promise<void>;
}

export const WonderFormModal: React.FC<WonderFormModalProps> = ({
  initialWonder,
  onClose,
  onSave,
}) => {
  const isEditing = Boolean(initialWonder);

  const [number, setNumber] = useState<number>(initialWonder?.number || 1);
  const [name, setName] = useState(initialWonder?.name || '');
  const [officialTitle, setOfficialTitle] = useState(initialWonder?.officialTitle || '');
  const [province, setProvince] = useState(initialWonder?.province || 'Malanje');
  const [location, setLocation] = useState(initialWonder?.location || '');
  const [tagline, setTagline] = useState(initialWonder?.tagline || '');
  const [summary, setSummary] = useState(initialWonder?.summary || '');
  const [descriptionText, setDescriptionText] = useState(
    initialWonder?.fullDescription?.join('\n\n') || ''
  );
  const [geographyAndNature, setGeographyAndNature] = useState(
    initialWonder?.geographyAndNature || ''
  );
  const [howToVisit, setHowToVisit] = useState(initialWonder?.howToVisit || '');
  const [image, setImage] = useState(initialWonder?.image || '');

  // Highlights
  const [highlights, setHighlights] = useState<string[]>(
    initialWonder?.highlights && initialWonder.highlights.length > 0
      ? initialWonder.highlights
      : ['Paisagem de tirar o fôlego', 'Acesso pavimentado e seguro']
  );
  const [newHighlight, setNewHighlight] = useState('');

  // Facts
  const [facts, setFacts] = useState<WonderFact[]>(
    initialWonder?.facts && initialWonder.facts.length > 0
      ? initialWonder.facts
      : [
          { label: 'Classificação', value: '7 Maravilhas Naturais de Angola' },
          { label: 'Melhor Época', value: 'Todo o ano' },
        ]
  );
  const [newFactLabel, setNewFactLabel] = useState('');
  const [newFactValue, setNewFactValue] = useState('');

  const [isPublished, setIsPublished] = useState(
    initialWonder ? initialWonder.isPublished !== false : true
  );

  const [uploadingImage, setUploadingImage] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMsg('Por favor selecione um ficheiro de imagem válido (JPG, PNG, WebP).');
      return;
    }

    setUploadingImage(true);
    setErrorMsg(null);
    try {
      const url = await uploadWonderImage(file);
      setImage(url);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Erro ao carregar imagem.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleAddHighlight = () => {
    if (!newHighlight.trim()) return;
    setHighlights([...highlights, newHighlight.trim()]);
    setNewHighlight('');
  };

  const handleRemoveHighlight = (index: number) => {
    setHighlights(highlights.filter((_, i) => i !== index));
  };

  const handleAddFact = () => {
    if (!newFactLabel.trim() || !newFactValue.trim()) return;
    setFacts([...facts, { label: newFactLabel.trim(), value: newFactValue.trim() }]);
    setNewFactLabel('');
    setNewFactValue('');
  };

  const handleRemoveFact = (index: number) => {
    setFacts(facts.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('O nome da maravilha natural é obrigatório.');
      return;
    }
    if (!image.trim()) {
      setErrorMsg('A imagem principal da atração é obrigatória.');
      return;
    }

    const fullDescription = descriptionText
      .split('\n\n')
      .map((p) => p.trim())
      .filter(Boolean);

    const input: NaturalWonderInput = {
      number,
      name: name.trim(),
      officialTitle: officialTitle.trim() || name.trim(),
      province: province.trim(),
      location: location.trim(),
      tagline: tagline.trim(),
      summary: summary.trim(),
      fullDescription: fullDescription.length > 0 ? fullDescription : [summary.trim()],
      geographyAndNature: geographyAndNature.trim(),
      howToVisit: howToVisit.trim(),
      image: image.trim(),
      galleryImages: initialWonder?.galleryImages || [],
      highlights,
      facts,
      isPublished,
    };

    setSaving(true);
    setErrorMsg(null);
    try {
      await onSave(initialWonder?.id || null, input);
      onClose();
    } catch (err: any) {
      setErrorMsg(err?.message || 'Erro ao guardar dados da maravilha natural.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl my-8 overflow-hidden flex flex-col max-h-[92vh] border border-gray-100">
        {/* MODAL HEADER */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-stone-900 to-[#1e1b18] text-white">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#d9251d] flex items-center justify-center text-white shadow-sm">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">
                {isEditing ? 'Editar Maravilha Natural' : 'Nova Maravilha Natural de Angola'}
              </h2>
              <p className="text-xs text-stone-300">
                {isEditing
                  ? `Atualizar ficha turística de "${name || 'Maravilha'}"`
                  : 'Registar novo património natural e atração turística oficial'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* MODAL BODY */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {errorMsg && (
            <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-medium">
              {errorMsg}
            </div>
          )}

          {/* 1. INFORMAÇÕES BÁSICAS */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-[#d9251d]" /> Identificação & Província
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Nome da Maravilha *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Quedas de Kalandula"
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#d9251d]/20 focus:border-[#d9251d]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Número / Ordem Oficial
                </label>
                <input
                  type="number"
                  min="1"
                  max="99"
                  value={number}
                  onChange={(e) => setNumber(parseInt(e.target.value) || 1)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#d9251d]/20 focus:border-[#d9251d]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Título Oficial / Descritivo
              </label>
              <input
                type="text"
                value={officialTitle}
                onChange={(e) => setOfficialTitle(e.target.value)}
                placeholder="Ex: Quedas de Kalandula — A Majestade das Águas de Malanje"
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#d9251d]/20 focus:border-[#d9251d]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#d9251d]" /> Província *
                </label>
                <select
                  value={province}
                  onChange={(e) => setProvince(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#d9251d]/20 focus:border-[#d9251d]"
                  required
                >
                  {ANGOLA_PROVINCES.map((prov) => (
                    <option key={prov} value={prov}>
                      {prov}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Localização Detalhada
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Ex: Município de Kalandula, Rio Lucala (a 80 km de Malanje)"
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#d9251d]/20 focus:border-[#d9251d]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Slogan / Tagline de Destaque
              </label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="Ex: A segunda maior queda de água de África e o espetáculo fluvial mais imponente de Angola"
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#d9251d]/20 focus:border-[#d9251d]"
              />
            </div>
          </div>

          {/* 2. IMAGEM PRINCIPAL */}
          <div className="space-y-3 pt-2 border-t border-gray-100">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
              <ImageIcon className="w-3.5 h-3.5 text-[#d9251d]" /> Imagem Principal de Apresentação *
            </h3>

            <div className="flex flex-col sm:flex-row gap-4 items-start">
              {/* Image Preview */}
              <div className="w-full sm:w-48 h-32 rounded-xl border border-gray-200 bg-stone-100 overflow-hidden flex items-center justify-center shrink-0 relative group">
                {image ? (
                  <img
                    src={image}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=600&q=80';
                    }}
                  />
                ) : (
                  <div className="text-center p-3 text-gray-400">
                    <ImageIcon className="w-8 h-8 mx-auto mb-1 text-gray-300" />
                    <span className="text-[11px]">Sem imagem</span>
                  </div>
                )}
                {uploadingImage && (
                  <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white text-xs gap-1.5">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>A enviar...</span>
                  </div>
                )}
              </div>

              {/* Upload & URL Input */}
              <div className="flex-1 space-y-2.5 w-full">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    URL da Imagem (ou envie um ficheiro abaixo)
                  </label>
                  <input
                    type="url"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder="https://exemplo.com/foto-maravilha.jpg"
                    className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#d9251d]/20 focus:border-[#d9251d]"
                  />
                </div>

                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileChange}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingImage}
                    className="inline-flex items-center gap-2 px-3.5 py-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 text-xs font-semibold rounded-xl transition-colors cursor-pointer shadow-xs"
                  >
                    <Upload className="w-3.5 h-3.5 text-[#d9251d]" />
                    {uploadingImage ? 'A carregar ficheiro...' : 'Carregar imagem do computador'}
                  </button>
                  <p className="text-[11px] text-gray-500 mt-1">
                    Recomendado: imagem panorâmica de alta resolução (mínimo 1200x800px).
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 3. RESUMO E DESCRIÇÃO DETALHADA */}
          <div className="space-y-4 pt-2 border-t border-gray-100">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
              <Compass className="w-3.5 h-3.5 text-[#d9251d]" /> Descrição Turística & Informações
            </h3>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Resumo de Apresentação (exibido nos cartões e banners)
              </label>
              <textarea
                rows={2}
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="Breve resumo atraente da maravilha natural..."
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#d9251d]/20 focus:border-[#d9251d]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Descrição Completa (separe parágrafos com uma linha em branco)
              </label>
              <textarea
                rows={4}
                value={descriptionText}
                onChange={(e) => setDescriptionText(e.target.value)}
                placeholder="História, grandiosidade geológica, lendas locais e detalhes turísticos..."
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#d9251d]/20 focus:border-[#d9251d]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Geografia, Biodiversidade & Natureza
                </label>
                <textarea
                  rows={2}
                  value={geographyAndNature}
                  onChange={(e) => setGeographyAndNature(e.target.value)}
                  placeholder="Ex: Bioma de savana arborizada, rio Lucala, espécies de aves..."
                  className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#d9251d]/20 focus:border-[#d9251d]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Como Visitar (Acessos, Distâncias e Dicas)
                </label>
                <textarea
                  rows={2}
                  value={howToVisit}
                  onChange={(e) => setHowToVisit(e.target.value)}
                  placeholder="Ex: Acesso asfaltado pela EN230 (aprox. 380 km de Luanda)..."
                  className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#d9251d]/20 focus:border-[#d9251d]"
                />
              </div>
            </div>
          </div>

          {/* 4. DESTAQUES (HIGHLIGHTS) */}
          <div className="space-y-3 pt-2 border-t border-gray-100">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#d9251d]" /> Destaques & Pontos Fortes
            </h3>

            <div className="flex gap-2">
              <input
                type="text"
                value={newHighlight}
                onChange={(e) => setNewHighlight(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddHighlight();
                  }
                }}
                placeholder="Ex: 105 metros de queda livre de água"
                className="flex-1 px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#d9251d]/20 focus:border-[#d9251d]"
              />
              <button
                type="button"
                onClick={handleAddHighlight}
                className="px-3 py-2 bg-gray-900 text-white hover:bg-black text-xs font-semibold rounded-xl flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Adicionar
              </button>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {highlights.map((hl, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100 text-gray-800 text-xs rounded-full border border-gray-200"
                >
                  <span>{hl}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveHighlight(index)}
                    className="text-gray-400 hover:text-red-600 cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* 5. FATOS & ESTATÍSTICAS RÁPIDAS */}
          <div className="space-y-3 pt-2 border-t border-gray-100">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-[#d9251d]" /> Fatos & Ficha Técnica Rápida
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
              <input
                type="text"
                value={newFactLabel}
                onChange={(e) => setNewFactLabel(e.target.value)}
                placeholder="Rótulo (ex: Altura)"
                className="sm:col-span-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:bg-white focus:outline-none"
              />
              <input
                type="text"
                value={newFactValue}
                onChange={(e) => setNewFactValue(e.target.value)}
                placeholder="Valor (ex: 105 metros)"
                className="sm:col-span-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:bg-white focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddFact}
                className="px-3 py-2 bg-gray-900 text-white hover:bg-black text-xs font-semibold rounded-xl flex items-center justify-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Adicionar
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              {facts.map((fact, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs"
                >
                  <div>
                    <span className="font-semibold text-stone-900">{fact.label}: </span>
                    <span className="text-stone-600">{fact.value}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveFact(index)}
                    className="text-gray-400 hover:text-red-600 p-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* 6. ESTADO DE PUBLICAÇÃO */}
          <div className="pt-2 border-t border-gray-100 flex items-center justify-between bg-stone-50 p-3.5 rounded-xl">
            <div>
              <p className="text-xs font-bold text-gray-800">Publicar no Portal</p>
              <p className="text-[11px] text-gray-500">
                Se desativado, o registo será guardado como rascunho visível apenas no painel admin.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#d9251d]"></div>
            </label>
          </div>
        </form>

        {/* MODAL FOOTER */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-gray-900 bg-white border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={saving}
            className="px-5 py-2 text-xs font-bold text-white bg-[#d9251d] hover:bg-[#b51c15] rounded-xl flex items-center gap-2 transition-colors shadow-sm cursor-pointer disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> A guardar...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                {isEditing ? 'Guardar Alterações' : 'Criar Maravilha Natural'}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
