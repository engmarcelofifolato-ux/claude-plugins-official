/**
 * Credit Scoring Module
 * Módulo de pontuação automática de crédito
 * Impacto esperado: +35% aprovação em crédito rural
 */

class CreditScoringModule {
  constructor() {
    this.activeLeadId = null;
    this.init();
  }

  init() {
    console.log('🏦 Credit Scoring Module initialized');
    this.createStyles();
  }

  createStyles() {
    if (document.getElementById('credit-scoring-styles')) return;

    const styles = document.createElement('style');
    styles.id = 'credit-scoring-styles';
    styles.innerHTML = `
      .credit-score-card {
        background: linear-gradient(135deg, #4a5e2a 0%, #6b7c3a 100%);
        border-radius: 12px;
        padding: 1.5rem;
        color: white;
        margin: 1rem 0;
        box-shadow: 0 4px 15px rgba(74, 94, 42, 0.3);
      }

      .score-display {
        display: flex;
        align-items: center;
        gap: 1.5rem;
        margin-bottom: 1.5rem;
      }

      .score-circle {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.2);
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        font-weight: bold;
      }

      .score-value {
        font-size: 2rem;
        font-weight: 800;
      }

      .score-label {
        font-size: 0.75rem;
        opacity: 0.9;
      }

      .approval-info {
        background: rgba(255, 255, 255, 0.15);
        padding: 1rem;
        border-radius: 8px;
        margin-bottom: 1rem;
      }

      .approval-title {
        font-size: 0.9rem;
        font-weight: 600;
        margin-bottom: 0.5rem;
        opacity: 0.95;
      }

      .approval-bar {
        background: rgba(255, 255, 255, 0.2);
        height: 8px;
        border-radius: 4px;
        overflow: hidden;
        margin-bottom: 0.5rem;
      }

      .approval-fill {
        height: 100%;
        background: #90EE90;
        transition: width 0.5s ease;
        border-radius: 4px;
      }

      .approval-percent {
        font-size: 0.85rem;
        font-weight: 600;
      }

      .score-breakdown {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 1rem;
        margin-top: 1.5rem;
        padding-top: 1.5rem;
        border-top: 1px solid rgba(255, 255, 255, 0.2);
      }

      .breakdown-item {
        background: rgba(255, 255, 255, 0.1);
        padding: 0.8rem;
        border-radius: 6px;
      }

      .breakdown-label {
        font-size: 0.75rem;
        opacity: 0.85;
        margin-bottom: 0.4rem;
      }

      .breakdown-value {
        font-size: 1.2rem;
        font-weight: 700;
      }

      .credit-action-buttons {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 1rem;
        margin-top: 1.5rem;
      }

      .credit-btn {
        background: rgba(255, 255, 255, 0.2);
        border: 1px solid rgba(255, 255, 255, 0.4);
        color: white;
        padding: 0.8rem;
        border-radius: 6px;
        cursor: pointer;
        font-weight: 600;
        font-size: 0.85rem;
        transition: all 0.3s;
      }

      .credit-btn:hover {
        background: rgba(255, 255, 255, 0.3);
        border-color: white;
      }

      .credit-modal {
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        z-index: 2000;
        align-items: center;
        justify-content: center;
      }

      .credit-modal.active {
        display: flex;
      }

      .credit-modal-content {
        background: white;
        border-radius: 12px;
        padding: 2rem;
        max-width: 600px;
        max-height: 80vh;
        overflow-y: auto;
        animation: slideUp 0.3s ease;
      }

      @keyframes slideUp {
        from { transform: translateY(30px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }

      .credit-modal-header {
        font-size: 1.5rem;
        font-weight: 700;
        margin-bottom: 1.5rem;
        display: flex;
        align-items: center;
        gap: 0.8rem;
      }

      .credit-recommendations {
        background: #f0f8ff;
        border-left: 4px solid #4a5e2a;
        padding: 1rem;
        border-radius: 6px;
        margin: 1.5rem 0;
      }

      .recommendation-item {
        margin: 0.8rem 0;
        font-size: 0.9rem;
      }

      .recommendation-item strong {
        color: #4a5e2a;
      }

      .credit-close-btn {
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        float: right;
        color: #666;
      }

      /* Responsivo */
      @media (max-width: 768px) {
        .score-breakdown {
          grid-template-columns: 1fr;
        }

        .credit-action-buttons {
          grid-template-columns: 1fr;
        }

        .credit-modal-content {
          margin: 1rem;
          max-width: 95vw;
        }
      }
    `;

    document.head.appendChild(styles);
  }

  // Renderizar card de score de crédito (inline, em lead card)
  renderCreditScoreInline(lead, score, approval) {
    const statusColor = score >= 75 ? '#4a5e2a' : score >= 50 ? '#8c7355' : '#c0504d';
    const statusLabel = score >= 75 ? 'QUENTE' : score >= 50 ? 'MORNO' : 'FRIO';

    return `
      <div class="credit-score-card" style="background: linear-gradient(135deg, ${statusColor} 0%, ${statusColor}99 100%);">
        <div class="score-display">
          <div class="score-circle">
            <div class="score-value">${score}</div>
            <div class="score-label">Pontuação</div>
          </div>
          <div>
            <div style="font-size: 1.3rem; font-weight: 700; margin-bottom: 0.5rem;">${statusLabel}</div>
            <div style="opacity: 0.9; font-size: 0.9rem;">Chance de aprovação</div>
            <div style="font-size: 1.2rem; font-weight: 600; margin-top: 0.3rem;">${Math.round(approval * 100)}%</div>
          </div>
        </div>

        <div class="approval-info">
          <div class="approval-title">Aprovação em Linhas Principais</div>
          <div class="approval-bar">
            <div class="approval-fill" style="width: ${approval * 100}%;"></div>
          </div>
          <div class="approval-percent">${Math.round(approval * 100)}% de chance em PRONAF/PRONAMP</div>
        </div>

        <div class="credit-action-buttons">
          <button class="credit-btn" onclick="creditScoringModule.openDetailModal('${lead.id}')">
            📊 Ver Detalhes
          </button>
          <button class="credit-btn" onclick="creditScoringModule.simulateCredit('${lead.id}')">
            💰 Simular Crédito
          </button>
        </div>
      </div>
    `;
  }

  // Abrir modal detalhado de crédito
  openDetailModal(leadId) {
    const lead = this.findLead(leadId);
    if (!lead) return;

    const scoring = apiManager.calculateCreditScore(lead, {});
    const modalHtml = `
      <div class="credit-modal active" id="credit-modal" onclick="creditScoringModule.closeModal()">
        <div class="credit-modal-content" onclick="event.stopPropagation();">
          <button class="credit-close-btn" onclick="creditScoringModule.closeModal()">✕</button>

          <div class="credit-modal-header">
            📊 Análise de Crédito: ${lead.nome}
          </div>

          <div style="background: #f5f5f5; padding: 1rem; border-radius: 8px; margin-bottom: 1.5rem;">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
              <div>
                <div style="font-size: 0.85rem; color: #666; margin-bottom: 0.3rem;">Área (hectares)</div>
                <div style="font-size: 1.3rem; font-weight: 700;">${lead.area.toFixed(1)} ha</div>
              </div>
              <div>
                <div style="font-size: 0.85rem; color: #666; margin-bottom: 0.3rem;">Score CAR</div>
                <div style="font-size: 1.3rem; font-weight: 700;">${lead.carStatus === 'validado' ? '✅ Validado' : '⏳ Pendente'}</div>
              </div>
              <div>
                <div style="font-size: 0.85rem; color: #666; margin-bottom: 0.3rem;">Região</div>
                <div style="font-size: 1.3rem; font-weight: 700;">${lead.local}</div>
              </div>
              <div>
                <div style="font-size: 0.85rem; color: #666; margin-bottom: 0.3rem;">Atividade</div>
                <div style="font-size: 1.3rem; font-weight: 700;">${lead.atividade || 'Múltiplas'}</div>
              </div>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-bottom: 1.5rem;">
            <div style="background: #4a5e2a; color: white; padding: 1rem; border-radius: 8px; text-align: center;">
              <div style="font-size: 0.85rem; opacity: 0.9; margin-bottom: 0.5rem;">Crédito Estimado</div>
              <div style="font-size: 1.4rem; font-weight: 700;">R$ ${(lead.area * 8000).toLocaleString('pt-BR')}</div>
            </div>
            <div style="background: #6b7c3a; color: white; padding: 1rem; border-radius: 8px; text-align: center;">
              <div style="font-size: 0.85rem; opacity: 0.9; margin-bottom: 0.5rem;">Taxa Estimada</div>
              <div style="font-size: 1.4rem; font-weight: 700;">4.81% a.a.</div>
            </div>
            <div style="background: #8c7355; color: white; padding: 1rem; border-radius: 8px; text-align: center;">
              <div style="font-size: 0.85rem; opacity: 0.9; margin-bottom: 0.5rem;">Prazo</div>
              <div style="font-size: 1.4rem; font-weight: 700;">até 84 meses</div>
            </div>
          </div>

          <div class="credit-recommendations">
            <strong style="color: #1c2016; display: block; margin-bottom: 0.8rem;">✅ Recomendações para aumentar aprovação:</strong>
            <div class="recommendation-item">1. <strong>Validar CAR</strong> → Desconto de 0.5% em juros</div>
            <div class="recommendation-item">2. <strong>Atualizar CNPJ</strong> → Melhora score de credibilidade</div>
            <div class="recommendation-item">3. <strong>Apresentar histórico</strong> → Comprovação de experiência</div>
            ${lead.area < 200 ? '<div class="recommendation-item">4. <strong>Solicitar PRONAF</strong> → Taxas reduzidas para pequenos</div>' : ''}
          </div>

          <div style="background: #fff3cd; border: 1px solid #ffc107; border-radius: 8px; padding: 1rem; margin-bottom: 1.5rem;">
            <strong style="color: #664d03; display: block; margin-bottom: 0.5rem;">⚠️ Próximas etapas</strong>
            <ol style="color: #664d03; font-size: 0.9rem; margin-left: 1.5rem; margin-top: 0.5rem;">
              <li>Clicar em "Simular Crédito" para ver opções</li>
              <li>Enviar para WhatsApp com propostas</li>
              <li>Acompanhar na CRM até aprovação</li>
            </ol>
          </div>

          <button class="btn-primary" onclick="creditScoringModule.shareToWhatsApp('${leadId}')" style="width: 100%;">
            💬 Enviar Propostas via WhatsApp
          </button>
        </div>
      </div>
    `;

    // Adicionar modal ao DOM
    const existingModal = document.getElementById('credit-modal');
    if (existingModal) existingModal.remove();

    const container = document.createElement('div');
    container.innerHTML = modalHtml;
    document.body.appendChild(container.firstElementChild);
  }

  closeModal() {
    const modal = document.getElementById('credit-modal');
    if (modal) modal.remove();
  }

  // Simulador de crédito
  simulateCredit(leadId) {
    const lead = this.findLead(leadId);
    if (!lead) return;

    const creditAmount = lead.area * 8000; // R$ 8k por hectare
    const rates = {
      pronaf: 0.0481,
      pronamp: 0.0688,
      creditGreen: 0.0381
    };

    const simulations = {
      pronaf: this.calculateInstallment(creditAmount, rates.pronaf, 60),
      pronamp: this.calculateInstallment(creditAmount, rates.pronamp, 84),
      green: this.calculateInstallment(creditAmount, rates.creditGreen, 60)
    };

    alert(
      `💰 SIMULAÇÕES DE CRÉDITO - ${lead.nome}\n\n` +
      `Valor Total: R$ ${creditAmount.toLocaleString('pt-BR')}\n\n` +
      `PRONAF (4.81% a.a., 60 meses)\n` +
      `├ Parcela: R$ ${simulations.pronaf.toLocaleString('pt-BR')}\n` +
      `└ Total: R$ ${(simulations.pronaf * 60).toLocaleString('pt-BR')}\n\n` +
      `PRONAMP (6.88% a.a., 84 meses)\n` +
      `├ Parcela: R$ ${simulations.pronamp.toLocaleString('pt-BR')}\n` +
      `└ Total: R$ ${(simulations.pronamp * 84).toLocaleString('pt-BR')}\n\n` +
      `CRÉDITO VERDE (3.81% a.a., 60 meses)\n` +
      `├ Parcela: R$ ${simulations.green.toLocaleString('pt-BR')}\n` +
      `└ Total: R$ ${(simulations.green * 60).toLocaleString('pt-BR')}\n\n` +
      `✨ Melhor opção: CRÉDITO VERDE (economia de R$ ${((simulations.pronaf * 60) - (simulations.green * 60)).toLocaleString('pt-BR')})`
    );
  }

  // Calcular parcela mensal
  calculateInstallment(principal, monthlyRate, months) {
    const rate = monthlyRate / 12;
    const payment = principal * (rate * Math.pow(1 + rate, months)) / (Math.pow(1 + rate, months) - 1);
    return Math.round(payment);
  }

  // Compartilhar para WhatsApp
  shareToWhatsApp(leadId) {
    const lead = this.findLead(leadId);
    if (!lead) return;

    const scoring = apiManager.calculateCreditScore(lead, {});
    const creditAmount = lead.area * 8000;

    const message = encodeURIComponent(
      `🏦 *Proposta de Crédito Rural* 🏦\n\n` +
      `*${lead.nome}*\n` +
      `📍 ${lead.local}\n` +
      `🌾 Área: ${lead.area.toFixed(1)} ha\n` +
      `⭐ Score de Crédito: ${scoring.score}/100 (${Math.round(scoring.approval * 100)}% aprovação)\n\n` +
      `*Opções de financiamento disponíveis:*\n` +
      `• PRONAF: R$ ${creditAmount.toLocaleString('pt-BR')} @ 4.81%\n` +
      `• CRÉDITO VERDE: R$ ${creditAmount.toLocaleString('pt-BR')} @ 3.81% ✨\n` +
      `• PRONAMP: R$ ${creditAmount.toLocaleString('pt-BR')} @ 6.88%\n\n` +
      `Vamos agendar uma call? 📞`
    );

    window.open(`https://wa.me/5516993784631?text=${message}`, '_blank');
  }

  // Encontrar lead no módulo atual
  findLead(leadId) {
    const moduloAtivo = window.moduloAtivo || 'fundiario';
    const leads = window.leadsDataByModulo[moduloAtivo] || [];
    return leads.find(l => l.id === leadId);
  }
}

// Global instance
const creditScoringModule = new CreditScoringModule();
