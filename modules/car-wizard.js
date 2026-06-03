/**
 * CAR Wizard Module
 * Módulo de validação e renovação automática de CAR
 * Impacto esperado: +60% conversão em regularização fundiária
 */

class CARWizardModule {
  constructor() {
    this.currentStep = 1;
    this.wizardData = {};
    this.init();
  }

  init() {
    console.log('🗺️ CAR Wizard Module initialized');
    this.createStyles();
  }

  createStyles() {
    if (document.getElementById('car-wizard-styles')) return;

    const styles = document.createElement('style');
    styles.id = 'car-wizard-styles';
    styles.innerHTML = `
      .car-wizard-container {
        background: linear-gradient(135deg, #4a5e2a 0%, #6b7c3a 100%);
        border-radius: 12px;
        padding: 2rem;
        color: white;
        margin: 1rem 0;
      }

      .wizard-header {
        font-size: 1.3rem;
        font-weight: 700;
        margin-bottom: 1.5rem;
        display: flex;
        align-items: center;
        gap: 0.8rem;
      }

      .wizard-steps {
        display: flex;
        gap: 1rem;
        margin-bottom: 2rem;
        align-items: center;
      }

      .wizard-step {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.85rem;
      }

      .step-number {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.2);
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 700;
        border: 2px solid rgba(255, 255, 255, 0.4);
      }

      .step-number.active {
        background: white;
        color: #4a5e2a;
        border-color: white;
        font-weight: 800;
      }

      .step-number.completed {
        background: #90EE90;
        color: #4a5e2a;
        border-color: #90EE90;
      }

      .step-label {
        opacity: 0.7;
      }

      .step-label.active,
      .step-label.completed {
        opacity: 1;
        font-weight: 600;
      }

      .wizard-content {
        background: rgba(255, 255, 255, 0.1);
        border-radius: 8px;
        padding: 1.5rem;
        margin-bottom: 1.5rem;
      }

      .wizard-input-group {
        margin-bottom: 1rem;
      }

      .wizard-label {
        display: block;
        font-size: 0.9rem;
        margin-bottom: 0.5rem;
        opacity: 0.95;
      }

      .wizard-input {
        width: 100%;
        padding: 0.8rem;
        border: 1px solid rgba(255, 255, 255, 0.3);
        border-radius: 6px;
        background: rgba(255, 255, 255, 0.15);
        color: white;
        font-size: 0.9rem;
      }

      .wizard-input::placeholder {
        color: rgba(255, 255, 255, 0.5);
      }

      .wizard-input:focus {
        outline: none;
        background: rgba(255, 255, 255, 0.2);
        border-color: white;
      }

      .car-result {
        background: rgba(144, 238, 144, 0.2);
        border: 1px solid rgba(144, 238, 144, 0.5);
        border-radius: 8px;
        padding: 1.5rem;
        margin-bottom: 1.5rem;
      }

      .car-result-item {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
        margin-bottom: 1rem;
      }

      .car-result-label {
        opacity: 0.85;
        font-size: 0.85rem;
      }

      .car-result-value {
        font-size: 1rem;
        font-weight: 600;
      }

      .car-status-badge {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        background: rgba(144, 238, 144, 0.3);
        border: 1px solid rgba(144, 238, 144, 0.6);
        padding: 0.5rem 1rem;
        border-radius: 20px;
        font-size: 0.85rem;
        font-weight: 600;
      }

      .car-status-badge.warning {
        background: rgba(255, 193, 7, 0.3);
        border-color: rgba(255, 193, 7, 0.6);
      }

      .wizard-actions {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
      }

      .wizard-btn {
        background: rgba(255, 255, 255, 0.2);
        border: 1px solid rgba(255, 255, 255, 0.4);
        color: white;
        padding: 0.8rem 1.5rem;
        border-radius: 6px;
        cursor: pointer;
        font-weight: 600;
        font-size: 0.85rem;
        transition: all 0.3s;
      }

      .wizard-btn:hover {
        background: rgba(255, 255, 255, 0.3);
        border-color: white;
      }

      .wizard-btn.primary {
        background: white;
        color: #4a5e2a;
        border-color: white;
      }

      .wizard-btn.primary:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
      }

      .wizard-loading {
        text-align: center;
        padding: 2rem;
      }

      .spinner {
        display: inline-block;
        width: 40px;
        height: 40px;
        border: 4px solid rgba(255, 255, 255, 0.3);
        border-top-color: white;
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }

      @keyframes spin {
        to { transform: rotate(360deg); }
      }

      .modal-overlay-car {
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

      .modal-overlay-car.active {
        display: flex;
      }

      .modal-content-car {
        background: white;
        border-radius: 12px;
        padding: 2rem;
        max-width: 700px;
        max-height: 80vh;
        overflow-y: auto;
        animation: slideUp 0.3s ease;
      }

      /* Responsivo */
      @media (max-width: 768px) {
        .wizard-steps {
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .car-wizard-container {
          padding: 1.5rem;
        }

        .wizard-actions {
          grid-template-columns: 1fr;
        }

        .modal-content-car {
          margin: 1rem;
          max-width: 95vw;
        }
      }
    `;

    document.head.appendChild(styles);
  }

  // Renderizar wizard (botão de início)
  renderWizardButton() {
    return `
      <button class="btn-primary" onclick="carWizardModule.openWizard()"
              style="background: linear-gradient(135deg, #4a5e2a 0%, #6b7c3a 100%); width: 100%; padding: 1rem;">
        🗺️ Buscar CAR & Validar Propriedade
      </button>
    `;
  }

  // Abrir wizard modal
  openWizard() {
    this.currentStep = 1;
    this.wizardData = {};

    const modalHtml = `
      <div class="modal-overlay-car active" id="car-modal" onclick="carWizardModule.closeWizard()">
        <div class="modal-content-car" onclick="event.stopPropagation();">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
            <h2 style="color: #4a5e2a; margin: 0;">🗺️ CAR Wizard - Validação Fundiária</h2>
            <button style="background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #666;" onclick="carWizardModule.closeWizard()">✕</button>
          </div>

          <div id="car-wizard-body">
            ${this.renderStep1()}
          </div>
        </div>
      </div>
    `;

    const existingModal = document.getElementById('car-modal');
    if (existingModal) existingModal.remove();

    const container = document.createElement('div');
    container.innerHTML = modalHtml;
    document.body.appendChild(container.firstElementChild);
  }

  closeWizard() {
    const modal = document.getElementById('car-modal');
    if (modal) modal.remove();
  }

  // STEP 1: Input de CNPJ/CPF
  renderStep1() {
    return `
      <div class="wizard-container">
        <div class="wizard-steps">
          <div class="wizard-step">
            <div class="step-number active">1</div>
            <div class="step-label active">Identificação</div>
          </div>
          <div class="wizard-step">
            <div class="step-number">2</div>
            <div class="step-label">Validação</div>
          </div>
          <div class="wizard-step">
            <div class="step-number">3</div>
            <div class="step-label">Resultado</div>
          </div>
        </div>

        <div class="wizard-content">
          <div class="wizard-input-group">
            <label class="wizard-label" style="color: #1c2016;">CNPJ ou CPF da Propriedade</label>
            <input
              type="text"
              id="car-input-cnpj"
              placeholder="00.000.000/0001-00 ou 000.000.000-00"
              style="color: #1c2016; background: white;"
              onkeyup="carWizardModule.formatCNPJ(this)"
            >
          </div>

          <div class="wizard-input-group">
            <label class="wizard-label" style="color: #1c2016;">Município (opcional)</label>
            <input
              type="text"
              id="car-input-municipio"
              placeholder="ex: Ribeirão Preto"
              style="color: #1c2016; background: white;"
            >
          </div>

          <p style="color: #666; font-size: 0.85rem; margin: 1rem 0; line-height: 1.5;">
            🔒 <strong>Seus dados são privados</strong>. Consultamos o SICAR (Sistema Oficial do INCRA) para validar CAR e status de regularização.
          </p>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
          <button class="wizard-btn" onclick="carWizardModule.closeWizard()">Cancelar</button>
          <button class="wizard-btn primary" onclick="carWizardModule.nextStep()">Continuar →</button>
        </div>
      </div>
    `;
  }

  // STEP 2: Loading + Validation
  renderStep2() {
    return `
      <div class="wizard-container">
        <div class="wizard-steps">
          <div class="wizard-step">
            <div class="step-number completed">✓</div>
            <div class="step-label completed">Identificação</div>
          </div>
          <div class="wizard-step">
            <div class="step-number active">2</div>
            <div class="step-label active">Validação</div>
          </div>
          <div class="wizard-step">
            <div class="step-number">3</div>
            <div class="step-label">Resultado</div>
          </div>
        </div>

        <div class="wizard-content">
          <div class="wizard-loading">
            <div class="spinner"></div>
            <p style="margin-top: 1rem; color: #1c2016;">Consultando SICAR... ⏳</p>
          </div>
        </div>
      </div>
    `;
  }

  // STEP 3: Results
  renderStep3(carData) {
    const statusColor = carData.status === 'validado' ? '✅ Ativo' : '⚠️ Pendente';
    const renovacaoDias = Math.ceil((new Date(carData.dataProximaRenovacao) - new Date()) / (1000 * 60 * 60 * 24));
    const urgente = renovacaoDias < 90;

    return `
      <div class="wizard-container">
        <div class="wizard-steps">
          <div class="wizard-step">
            <div class="step-number completed">✓</div>
            <div class="step-label completed">Identificação</div>
          </div>
          <div class="wizard-step">
            <div class="step-number completed">✓</div>
            <div class="step-label completed">Validação</div>
          </div>
          <div class="wizard-step">
            <div class="step-number active">3</div>
            <div class="step-label active">Resultado</div>
          </div>
        </div>

        <div class="car-result">
          <h3 style="color: #1c2016; margin-bottom: 1rem;">📋 Dados da Propriedade</h3>

          <div class="car-result-item">
            <div class="car-result-label">CAR ID:</div>
            <div class="car-result-value" style="color: #4a5e2a;">${carData.carId}</div>
          </div>

          <div class="car-result-item">
            <div class="car-result-label">Proprietário:</div>
            <div class="car-result-value" style="color: #4a5e2a;">${carData.proprietario}</div>
          </div>

          <div class="car-result-item">
            <div class="car-result-label">Município:</div>
            <div class="car-result-value" style="color: #4a5e2a;">${carData.municipio}</div>
          </div>

          <div class="car-result-item">
            <div class="car-result-label">Área Total:</div>
            <div class="car-result-value" style="color: #4a5e2a;">${carData.area.toFixed(2)} hectares</div>
          </div>

          <div class="car-result-item">
            <div class="car-result-label">Status:</div>
            <div>
              <div class="car-status-badge ${carData.status === 'validado' ? '' : 'warning'}">
                ${statusColor}
              </div>
            </div>
          </div>

          <div class="car-result-item">
            <div class="car-result-label">Próxima Renovação:</div>
            <div class="car-result-value" style="color: ${urgente ? '#ff5722' : '#4a5e2a'};">
              ${renovacaoDias} dias ${urgente ? '🔴 URGENTE' : ''}
            </div>
          </div>

          <div class="car-result-item">
            <div class="car-result-label">Áreas Preservadas:</div>
            <div class="car-result-value" style="color: #4a5e2a;">${carData.areaPreservada.toFixed(2)} ha (${carData.percentualPreservacao}%)</div>
          </div>

          <div class="car-result-item">
            <div class="car-result-label">Classificação:</div>
            <div class="car-result-value" style="color: #4a5e2a;">Classe ${carData.classeProdutividade}</div>
          </div>
        </div>

        ${urgente ? `
        <div style="background: #fff3cd; border: 2px solid #ffc107; border-radius: 8px; padding: 1rem; margin-bottom: 1rem; color: #664d03;">
          <strong>⚠️ Ação Urgente Recomendada</strong>
          <p style="margin-top: 0.5rem; font-size: 0.9rem;">Esta propriedade precisa renovar CAR em menos de 90 dias! Agendar agora para evitar bloqueios.</p>
        </div>
        ` : ''}

        <div style="background: #e8f5e9; border: 2px solid #4caf50; border-radius: 8px; padding: 1rem; margin-bottom: 1rem; color: #1b5e20;">
          <strong>✅ Benefícios desta Propriedade</strong>
          <ul style="margin-top: 0.5rem; font-size: 0.85rem; margin-left: 1.2rem;">
            <li>✓ CAR validado = -0.5% em taxa de juros</li>
            <li>✓ Acesso a crédito verde (3.81% a.a.)</li>
            <li>✓ Elegível para programas ambientais</li>
            <li>✓ Pode comercializar certificados verdes</li>
          </ul>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
          <button class="wizard-btn" onclick="carWizardModule.closeWizard()">Fechar</button>
          <button class="wizard-btn primary" onclick="carWizardModule.scheduleRenewal('${carData.carId}')">
            📅 Agendar Renovação
          </button>
        </div>
      </div>
    `;
  }

  // Navegar entre steps
  async nextStep() {
    if (this.currentStep === 1) {
      const cnpj = document.getElementById('car-input-cnpj')?.value;
      if (!cnpj) {
        alert('Por favor, insira um CNPJ ou CPF válido');
        return;
      }

      this.wizardData.cnpj = cnpj;
      this.currentStep = 2;

      const bodyEl = document.getElementById('car-wizard-body');
      bodyEl.innerHTML = this.renderStep2();

      // Simular busca (em Phase 2 será real SICAR API)
      await new Promise(resolve => setTimeout(resolve, 1500));

      const carData = await apiManager.searchCAR(cnpj);
      this.wizardData.car = carData;
      this.currentStep = 3;

      bodyEl.innerHTML = this.renderStep3(carData);
    }
  }

  // Agendar renovação (ir para WhatsApp)
  scheduleRenewal(carId) {
    const message = encodeURIComponent(
      `Olá! 👋\n\n` +
      `Gostaria de agendar a renovação do CAR ${carId}\n\n` +
      `Propriedade: ${this.wizardData.car?.proprietario}\n` +
      `Município: ${this.wizardData.car?.municipio}\n` +
      `Área: ${this.wizardData.car?.area} hectares\n\n` +
      `Qual é a melhor data/hora para contato? ⏰`
    );

    window.open(`https://wa.me/5516993784631?text=${message}`, '_blank');
  }

  // Formatar CNPJ/CPF
  formatCNPJ(input) {
    let value = input.value.replace(/\D/g, '');

    if (value.length <= 11) {
      // CPF
      value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    } else {
      // CNPJ
      value = value.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    }

    input.value = value;
  }
}

// Global instance
const carWizardModule = new CARWizardModule();
