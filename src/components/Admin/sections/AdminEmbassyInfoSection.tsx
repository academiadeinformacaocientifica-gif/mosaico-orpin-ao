/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Globe, 
  Save, 
  RotateCcw, 
  CheckCircle, 
  ExternalLink,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { EmbassyInfo } from '../../../types';
import { updateEmbassyInfo, resetEmbassyInfoToDefaults } from '../../../lib/embassyService';

interface AdminEmbassyInfoSectionProps {
  embassyInfo: EmbassyInfo;
  onEmbassyInfoChanged: (updated: EmbassyInfo) => void;
  onShowToast: (msg: string) => void;
}

export const AdminEmbassyInfoSection: React.FC<AdminEmbassyInfoSectionProps> = ({
  embassyInfo,
  onEmbassyInfoChanged,
  onShowToast,
}) => {
  const [formData, setFormData] = useState<EmbassyInfo>(embassyInfo);
  const [saving, setSaving] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const handleChange = (field: keyof EmbassyInfo, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setHasUnsavedChanges(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.addressStreet.trim() || !formData.phonePrimary.trim()) {
      onShowToast('Por favor, preencha os campos obrigatórios (Denominação, Endereço e Telefone Principal).');
      return;
    }

    setSaving(true);
    try {
      const updated = await updateEmbassyInfo(formData);
      onEmbassyInfoChanged(updated);
      setFormData(updated);
      setHasUnsavedChanges(false);
      onShowToast('Dados da Embaixada atualizados com sucesso!');
    } catch (err) {
      console.error(err);
      onShowToast('Erro ao guardar os dados da embaixada.');
    } finally {
      setSaving(false);
    }
  };

  const handleResetToDefaults = async () => {
    setResetting(true);
    try {
      const reset = await resetEmbassyInfoToDefaults();
      onEmbassyInfoChanged(reset);
      setFormData(reset);
      setHasUnsavedChanges(false);
      setShowResetConfirm(false);
      onShowToast('Dados restaurados para os valores padrão oficiais!');
    } catch (err) {
      console.error(err);
      onShowToast('Erro ao restaurar dados predefinidos.');
    } finally {
      setResetting(false);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* HEADER BAR */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <span className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Building2 className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Gestão de Dados da Embaixada
            </h2>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Atualize contactos, localização da Chancelaria, horários de atendimento consular e links institucionais exibidos em todo o portal público.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowResetConfirm(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Repor Padrão</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className={`inline-flex items-center gap-2 px-5 py-2 text-xs font-bold rounded-xl text-white shadow-md transition-all ${
              hasUnsavedChanges
                ? 'bg-[#d9251d] hover:bg-[#b01e17] ring-2 ring-red-400 ring-offset-2 dark:ring-offset-gray-900'
                : 'bg-green-600 hover:bg-green-700'
            } disabled:opacity-50`}
          >
            {saving ? (
              <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
            ) : hasUnsavedChanges ? (
              <Save className="w-4 h-4" />
            ) : (
              <CheckCircle className="w-4 h-4" />
            )}
            <span>{saving ? 'A guardar...' : hasUnsavedChanges ? 'Guardar Alterações' : 'Guardado'}</span>
          </button>
        </div>
      </div>

      {/* CONFIRM RESET MODAL */}
      {showResetConfirm && (
        <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 text-xs">
            <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
            <span>
              Tem a certeza de que deseja restaurar as informações para os contactos oficiais predefinidos de Madrid?
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setShowResetConfirm(false)}
              className="px-3 py-1.5 text-xs font-medium rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300"
            >
              Cancelar
            </button>
            <button
              onClick={handleResetToDefaults}
              disabled={resetting}
              className="px-3 py-1.5 text-xs font-bold rounded-lg bg-[#d9251d] text-white hover:bg-red-700 shadow-sm"
            >
              {resetting ? 'A repor...' : 'Confirmar Reposição'}
            </button>
          </div>
        </div>
      )}

      {/* 2-COLUMN LAYOUT: FORM + LIVE PREVIEW */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* FORM FIELDS (8 COLS) */}
        <form onSubmit={handleSave} className="lg:col-span-7 space-y-6">
          {/* SECTION 1: INFORMAÇÃO GERAL */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 space-y-4">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2 border-b border-gray-100 dark:border-gray-700 pb-3">
              <Building2 className="w-4 h-4 text-[#d9251d]" />
              <span>Identificação Institucional</span>
            </h3>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Denominação Oficial da Missão *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#d9251d] focus:border-transparent"
                placeholder="Ex: Embaixada da República de Angola no Reino de Espanha..."
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Título da Chancelaria
                </label>
                <input
                  type="text"
                  value={formData.chanceryTitle}
                  onChange={(e) => handleChange('chanceryTitle', e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#d9251d] focus:border-transparent"
                  placeholder="Chancelaria da Embaixada..."
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Circunscrição & Jurisdição
                </label>
                <input
                  type="text"
                  value={formData.jurisdiction}
                  onChange={(e) => handleChange('jurisdiction', e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#d9251d] focus:border-transparent"
                  placeholder="Reino de Espanha e Principado de Andorra"
                />
              </div>
            </div>
          </div>

          {/* SECTION 2: LOCALIZAÇÃO E ENDEREÇO */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 space-y-4">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2 border-b border-gray-100 dark:border-gray-700 pb-3">
              <MapPin className="w-4 h-4 text-[#d9251d]" />
              <span>Localização e Morada da Chancelaria</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Rua e Número *
                </label>
                <input
                  type="text"
                  value={formData.addressStreet}
                  onChange={(e) => handleChange('addressStreet', e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#d9251d] focus:border-transparent"
                  placeholder="Calle de Lagasca, nº 88"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Andar / Sala / Detalhes
                </label>
                <input
                  type="text"
                  value={formData.addressDetails || ''}
                  onChange={(e) => handleChange('addressDetails', e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#d9251d] focus:border-transparent"
                  placeholder="2ª Planta"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Código Postal
                </label>
                <input
                  type="text"
                  value={formData.postalCode}
                  onChange={(e) => handleChange('postalCode', e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#d9251d] focus:border-transparent"
                  placeholder="28001"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Cidade
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => handleChange('city', e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#d9251d] focus:border-transparent"
                  placeholder="Madrid"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  País
                </label>
                <input
                  type="text"
                  value={formData.country}
                  onChange={(e) => handleChange('country', e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#d9251d] focus:border-transparent"
                  placeholder="Espanha"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Link do Google Maps
              </label>
              <input
                type="url"
                value={formData.googleMapsUrl || ''}
                onChange={(e) => handleChange('googleMapsUrl', e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#d9251d] focus:border-transparent"
                placeholder="https://maps.google.com/?q=..."
              />
            </div>
          </div>

          {/* SECTION 3: TELEFONES & CONTACTOS */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 space-y-4">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2 border-b border-gray-100 dark:border-gray-700 pb-3">
              <Phone className="w-4 h-4 text-[#d9251d]" />
              <span>Telefones Oficiais & Fax</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Telefone Principal *
                </label>
                <input
                  type="text"
                  value={formData.phonePrimary}
                  onChange={(e) => handleChange('phonePrimary', e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#d9251d] focus:border-transparent"
                  placeholder="+34 91 435 61 66"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Telefone Secundário / Alternativo
                </label>
                <input
                  type="text"
                  value={formData.phoneSecondary || ''}
                  onChange={(e) => handleChange('phoneSecondary', e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#d9251d] focus:border-transparent"
                  placeholder="+34 91 435 64 30"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Fax Oficial
              </label>
              <input
                type="text"
                value={formData.fax || ''}
                onChange={(e) => handleChange('fax', e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#d9251d] focus:border-transparent"
                placeholder="+34 91 577 90 10"
              />
            </div>
          </div>

          {/* SECTION 4: CORREIO ELETRÓNICO */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 space-y-4">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2 border-b border-gray-100 dark:border-gray-700 pb-3">
              <Mail className="w-4 h-4 text-[#d9251d]" />
              <span>Correio Eletrónico Institucional</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  E-mail Oficial Principal (MIREX) *
                </label>
                <input
                  type="email"
                  value={formData.emailGeneral}
                  onChange={(e) => handleChange('emailGeneral', e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#d9251d] focus:border-transparent"
                  placeholder="embaixada.espanha@mirex.gov.ao"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Gabinete do Embaixador
                </label>
                <input
                  type="email"
                  value={formData.emailAmbassador || ''}
                  onChange={(e) => handleChange('emailAmbassador', e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#d9251d] focus:border-transparent"
                  placeholder="gabembajador@embajadadeangola.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Sector Consular
                </label>
                <input
                  type="email"
                  value={formData.emailConsular || ''}
                  onChange={(e) => handleChange('emailConsular', e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#d9251d] focus:border-transparent"
                  placeholder="consulado@embajadadeangola.com"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Sector Comercial / Económico
                </label>
                <input
                  type="email"
                  value={formData.emailCommercial || ''}
                  onChange={(e) => handleChange('emailCommercial', e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#d9251d] focus:border-transparent"
                  placeholder="comercial@embajadadeangola.com"
                />
              </div>
            </div>
          </div>

          {/* SECTION 5: HORÁRIOS E ATENDIMENTO */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 space-y-4">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2 border-b border-gray-100 dark:border-gray-700 pb-3">
              <Clock className="w-4 h-4 text-[#d9251d]" />
              <span>Horários de Funcionamento</span>
            </h3>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Horário da Chancelaria *
              </label>
              <input
                type="text"
                value={formData.officeHours}
                onChange={(e) => handleChange('officeHours', e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#d9251d] focus:border-transparent"
                placeholder="Segunda a sexta-feira, das 09:00 às 14:00 (Fuso horário de Madrid)"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Horário de Atendimento Consular ao Público
              </label>
              <input
                type="text"
                value={formData.consularHours || ''}
                onChange={(e) => handleChange('consularHours', e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#d9251d] focus:border-transparent"
                placeholder="Segunda a sexta-feira, das 09:30 às 13:00"
              />
            </div>
          </div>

          {/* SECTION 6: PORTAIS E LINKS OFICIAIS */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 space-y-4">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2 border-b border-gray-100 dark:border-gray-700 pb-3">
              <Globe className="w-4 h-4 text-[#d9251d]" />
              <span>Portais & Ligações Externas</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Portal Institucional do Governo
                </label>
                <input
                  type="url"
                  value={formData.institutionalPortal}
                  onChange={(e) => handleChange('institutionalPortal', e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#d9251d] focus:border-transparent"
                  placeholder="https://www.governo.gov.ao"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Portal do MIREX
                </label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => handleChange('website', e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#d9251d] focus:border-transparent"
                  placeholder="https://www.mirex.gov.ao"
                />
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={saving}
              className="w-full py-3 px-6 rounded-xl bg-[#d9251d] hover:bg-[#b01e17] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {saving ? (
                <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span>{saving ? 'A guardar alterações...' : 'Guardar Dados da Embaixada'}</span>
            </button>
          </div>
        </form>

        {/* LIVE PREVIEW & VISUAL CARDS (5 COLS) */}
        <div className="lg:col-span-5 space-y-6">
          {/* BANNER PREVIEW MATCHING USER ATTACHMENT */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100 dark:border-gray-700">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Pré-visualização do Banner
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-950/60 text-[#d9251d] font-bold">
                Design Oficial
              </span>
            </div>

            {/* RED HERO BANNER (REPRODUCING THE USER IMAGE) */}
            <div className="rounded-xl overflow-hidden bg-gradient-to-r from-[#b01e17] via-[#d9251d] to-[#b01e17] text-white p-5 shadow-lg relative">
              <div className="flex flex-col gap-3.5">
                {/* ADDRESS ROW */}
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-full bg-white/20 backdrop-blur-sm shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-white/80 block">
                      Localização
                    </span>
                    <p className="text-xs font-semibold leading-relaxed text-white">
                      {formData.addressStreet}
                      {formData.addressDetails ? `, ${formData.addressDetails}` : ''}
                      {formData.postalCode ? `, ${formData.postalCode}` : ''}{' '}
                      {formData.city}, {formData.country}
                    </p>
                  </div>
                </div>

                {/* PHONE ROW */}
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-full bg-white/20 backdrop-blur-sm shrink-0 mt-0.5">
                    <Phone className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-white/80 block">
                      Telefones Centrais
                    </span>
                    <p className="text-xs font-semibold text-white">
                      {formData.phonePrimary}
                      {formData.phoneSecondary ? ` / ${formData.phoneSecondary}` : ''}
                    </p>
                  </div>
                </div>

                {/* EMAIL ROW */}
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-full bg-white/20 backdrop-blur-sm shrink-0 mt-0.5">
                    <Mail className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-white/80 block">
                      Correio Eletrónico
                    </span>
                    <p className="text-xs font-semibold text-white break-all">
                      {formData.emailGeneral}
                    </p>
                  </div>
                </div>
              </div>

              {/* WATERMARK ACCENT */}
              <div className="mt-4 pt-3 border-t border-white/20 flex items-center justify-between text-[11px] text-white/90">
                <span className="font-medium">{formData.jurisdiction}</span>
                <span className="font-bold text-[#ffcc00]">Madrid</span>
              </div>
            </div>
          </div>

          {/* FOOTER LIVE PREVIEW */}
          <div className="bg-[#1c2028] text-white rounded-2xl p-6 shadow-sm border border-gray-700">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-700">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                Exibição no Rodapé Oficial
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold">
                Tempo Real
              </span>
            </div>

            <div className="space-y-3 text-xs text-white/90">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-white shrink-0 mt-0.5" />
                <span>
                  {formData.addressStreet}
                  {formData.addressDetails ? `, ${formData.addressDetails}` : ''}
                  {formData.postalCode ? `, ${formData.postalCode}` : ''} {formData.city}, {formData.country}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-white shrink-0" />
                <span>
                  {formData.phonePrimary}
                  {formData.phoneSecondary ? ` / ${formData.phoneSecondary}` : ''}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-white shrink-0" />
                <span className="break-all">{formData.emailGeneral}</span>
              </div>

              <div className="mt-4 pt-3 border-t border-white/20 flex items-center justify-between">
                <a
                  href={formData.institutionalPortal}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-white hover:text-white/80 font-bold inline-flex items-center gap-1.5 transition-colors underline underline-offset-2"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Portal Institucional</span>
                </a>

                {formData.googleMapsUrl && (
                  <a
                    href={formData.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-amber-300 hover:text-amber-200 inline-flex items-center gap-1"
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Ver no Mapa</span>
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* STATUS INFO */}
          <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 text-xs text-gray-600 dark:text-gray-300 space-y-2">
            <div className="flex items-center gap-2 font-semibold text-gray-800 dark:text-gray-200">
              <ShieldCheck className="w-4 h-4 text-green-600 dark:text-green-400" />
              <span>Persistência e Segurança</span>
            </div>
            <p className="text-[11px] leading-relaxed text-gray-500 dark:text-gray-400">
              As alterações são sincronizadas automaticamente com a tabela <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-[10px]">public.embassy_info</code> no Supabase e mantidas em armazenamento local resiliente em todos os navegadores.
            </p>
            {formData.updatedAt && (
              <p className="text-[10px] text-gray-400 dark:text-gray-500 pt-1 border-t border-gray-200 dark:border-gray-700">
                Última atualização: {new Date(formData.updatedAt).toLocaleString('pt-PT')}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
