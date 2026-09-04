/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ConsularDocument } from '../data/consularServices';

/**
 * Generates an official printable consular document and triggers browser print/download.
 */
export function generateAndDownloadConsularDocument(doc: ConsularDocument): void {
  const currentDate = new Date().toLocaleDateString('pt-PT', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    // If popup is blocked, create a text/html downloadable file
    const htmlBlob = new Blob([getDocHtml(doc, currentDate)], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(htmlBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = doc.downloadFileName.replace(/\.pdf$/, '.html');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    return;
  }

  printWindow.document.open();
  printWindow.document.write(getDocHtml(doc, currentDate));
  printWindow.document.close();

  // Trigger print after rendering
  printWindow.onload = () => {
    printWindow.focus();
    printWindow.print();
  };
}

function getDocHtml(doc: ConsularDocument, dateStr: string): string {
  const requirementsList = doc.requirements
    .map((r) => `<li style="margin-bottom: 6px;">${r}</li>`)
    .join('');

  return `<!DOCTYPE html>
<html lang="pt">
<head>
  <meta charset="UTF-8">
  <title>${doc.code} - ${doc.title}</title>
  <style>
    @page { size: A4 portrait; margin: 18mm; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #111;
      line-height: 1.5;
      font-size: 11pt;
      margin: 0;
      padding: 20px;
    }
    .header {
      text-align: center;
      border-bottom: 2px solid #d9251d;
      padding-bottom: 12px;
      margin-bottom: 24px;
    }
    .header h1 {
      font-size: 15pt;
      margin: 0;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #111;
    }
    .header h2 {
      font-size: 12pt;
      margin: 4px 0;
      font-weight: 600;
      color: #444;
    }
    .header h3 {
      font-size: 10pt;
      margin: 0;
      font-weight: normal;
      color: #777;
    }
    .badge {
      display: inline-block;
      background: #f4f5f7;
      border: 1px solid #ddd;
      padding: 3px 10px;
      border-radius: 4px;
      font-size: 9pt;
      font-weight: bold;
      margin-top: 8px;
    }
    .doc-title-box {
      background: #fafafa;
      border: 1px solid #e0e0e0;
      padding: 14px;
      border-radius: 6px;
      margin-bottom: 20px;
    }
    .doc-title-box h3 {
      margin: 0 0 6px 0;
      font-size: 13pt;
      color: #d9251d;
    }
    .doc-title-box p {
      margin: 0;
      font-size: 10pt;
      color: #555;
    }
    .section-title {
      font-size: 11pt;
      font-weight: bold;
      text-transform: uppercase;
      border-bottom: 1px solid #ccc;
      padding-bottom: 4px;
      margin-top: 20px;
      margin-bottom: 10px;
      color: #222;
    }
    .field-row {
      display: flex;
      gap: 16px;
      margin-bottom: 12px;
    }
    .field-group {
      flex: 1;
    }
    .field-label {
      font-size: 9pt;
      font-weight: bold;
      color: #555;
      text-transform: uppercase;
      margin-bottom: 3px;
    }
    .field-line {
      border-bottom: 1px dotted #666;
      height: 22px;
    }
    .field-box {
      border: 1px solid #bbb;
      height: 26px;
      border-radius: 3px;
      background: #fff;
    }
    .field-textarea {
      border: 1px solid #bbb;
      height: 70px;
      border-radius: 3px;
      background: #fff;
    }
    .requirements-box {
      background: #fff8f8;
      border: 1px solid #ffd0d0;
      padding: 12px;
      border-radius: 6px;
      margin-top: 15px;
      font-size: 9.5pt;
    }
    .requirements-box ul {
      margin: 6px 0 0 18px;
      padding: 0;
    }
    .footer-signatures {
      margin-top: 35px;
      display: flex;
      justify-content: space-between;
      gap: 40px;
    }
    .sign-box {
      flex: 1;
      text-align: center;
      border-top: 1px solid #333;
      padding-top: 8px;
      font-size: 10pt;
    }
    .instructions-notice {
      margin-top: 25px;
      font-size: 8.5pt;
      color: #666;
      text-align: center;
      border-top: 1px solid #eee;
      padding-top: 10px;
    }
    @media print {
      body { padding: 0; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>

  <div class="no-print" style="background: #eef4ff; border: 1px solid #b3d1ff; padding: 12px; margin-bottom: 20px; border-radius: 6px; font-size: 10pt; text-align: center;">
    <strong>Instrução:</strong> Esta é a visualização oficial do modelo da Embaixada. Utilize a opção de impressão do seu navegador para <strong>Guardar como PDF</strong> ou imprimir em papel A4.
  </div>

  <div class="header">
    <h1>REPÚBLICA DE ANGOLA</h1>
    <h2>EMBAIXADA NO REINO DE ESPANHA</h2>
    <h3>SECÇÃO CONSULAR • MADRID</h3>
    <div class="badge">DOCUMENTO OFICIAL • CÓDIGO: ${doc.code}</div>
  </div>

  <div class="doc-title-box">
    <h3>${doc.title}</h3>
    <p>${doc.description}</p>
  </div>

  <div class="section-title">1. DADOS DE IDENTIFICAÇÃO DO REQUERENTE</div>
  <div class="field-row">
    <div class="field-group" style="flex: 2;">
      <div class="field-label">Nome Completo:</div>
      <div class="field-box"></div>
    </div>
    <div class="field-group">
      <div class="field-label">Data de Nascimento (DD/MM/AAAA):</div>
      <div class="field-box"></div>
    </div>
  </div>

  <div class="field-row">
    <div class="field-group">
      <div class="field-label">Nacionalidade Atual:</div>
      <div class="field-box"></div>
    </div>
    <div class="field-group">
      <div class="field-label">Nº de Passaporte / BI:</div>
      <div class="field-box"></div>
    </div>
    <div class="field-group">
      <div class="field-label">Data de Validade:</div>
      <div class="field-box"></div>
    </div>
  </div>

  <div class="field-row">
    <div class="field-group" style="flex: 2;">
      <div class="field-label">Endereço de Residência em Espanha:</div>
      <div class="field-box"></div>
    </div>
    <div class="field-group">
      <div class="field-label">Código Postal e Cidade:</div>
      <div class="field-box"></div>
    </div>
  </div>

  <div class="field-row">
    <div class="field-group">
      <div class="field-label">Telefone de Contacto:</div>
      <div class="field-box"></div>
    </div>
    <div class="field-group" style="flex: 2;">
      <div class="field-label">Correio Eletrónico (E-mail):</div>
      <div class="field-box"></div>
    </div>
  </div>

  <div class="section-title">2. FINALIDADE E ESPECIFICAÇÃO DO PEDIDO</div>
  <div class="field-row">
    <div class="field-group">
      <div class="field-label">Tipo de Ato / Serviço Requerido:</div>
      <div class="field-box" style="padding: 4px 8px; font-size: 10pt; font-weight: 600; color: #333;">${doc.title}</div>
    </div>
  </div>
  <div class="field-row">
    <div class="field-group">
      <div class="field-label">Declaração ou Observações Adicionais do Requerente:</div>
      <div class="field-textarea"></div>
    </div>
  </div>

  <div class="requirements-box">
    <strong style="color: #a1140f;">DOCUMENTAÇÃO OBRIGATÓRIA A ANEXAR A ESTE REQUERIMENTO:</strong>
    <ul>
      ${requirementsList}
    </ul>
  </div>

  <div style="margin-top: 25px; font-size: 10pt; color: #333;">
    Madrid, aos ____________ de ___________________________ de 202_____.
  </div>

  <div class="footer-signatures">
    <div class="sign-box">
      <strong>Assinatura do Requerente</strong><br>
      <span style="font-size: 8pt; color: #666;">(Conforme documento de identificação)</span>
    </div>
    <div class="sign-box">
      <strong>Reservado aos Serviços Consulares</strong><br>
      <span style="font-size: 8pt; color: #666;">(Carimbo, Rubrica e Data de Entrada)</span>
    </div>
  </div>

  <div class="instructions-notice">
    <strong>Embaixada da República de Angola em Espanha • Secção Consular</strong><br>
    Calle Serrano, 64, 2º Andar, 28001 Madrid | Tel: (+34) 914 356 166 | E-mail: servicos.consulares@embaixadadeangola.es
  </div>

</body>
</html>`;
}
