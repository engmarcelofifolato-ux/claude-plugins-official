/**
 * Solar ROI Calculator Module
 * Simulador de retorno de investimento em energia solar
 * Impacto esperado: +45% leads qualificados em Solar Rural
 */

class SolarROIModule {
  constructor() {
    this.calculations = {};
    this.init();
  }

  init() {
    console.log('☀️ Solar ROI Calculator Module initialized');
    this.createStyles();
  }

  createStyles() {
    if (document.getElementById('solar-roi-styles')) return;

    const styles = document.createElement('style');
    styles.id = 'solar-roi-styles';
    styles.innerHTML = `
      .solar-calculator-card {
        background: linear-gradient(135deg, #ffa500 0%, #ff8c00 100%);
        border-radius: 12px;
        padding: 1.5rem;
        color: white;
        margin: 1rem 0;
        box-shadow: 0 4px 15px rgba(255, 165, 0, 0.3);
      }

      .solar-header {
        font-size: 1.3rem;
        font-weight: 700;
        margin-bottom: 1rem;
        display: flex;
        align-items: center;
        gap: 0.8rem;
      }

      .solar-input-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
        margin-bottom: 1.5rem;
      }

      .solar-input-group {
        display: flex;
        flex-direction: column;
      }

      .solar-label {
        font-size: 0.85rem;
        margin-bottom: 0.4rem;
        opacity: 0.95;
        font-weight: 500;
      }

      .solar-input {
        padding: 0.7rem;
        border: 1px solid rgba(255, 255, 255, 0.3);
        border-radius: 6px;
        background: rgba(255, 255, 255, 0.15);
        color: white;
        font-size: 0.85rem;
        font-weight: 600;
      }

      .solar-input::placeholder {
        color: rgba(255, 255, 255, 0.5);
      }

      .solar-input:focus {
        outline: none;
        background: rgba(255, 255, 255, 0.25);
        border-color: white;
      }

      .solar-slider-group {
        margin-bottom: 1.5rem;
      }

      .solar-slider-label {
        display: flex;
        justify-content: space-between;
        margin-bottom: 0.5rem;
        font-size: 0.85rem;
      }

      .solar-slider {
        width: 100%;
        height: 6px;
        border-radius: 3px;
        background: rgba(255, 255, 255, 0.2);
        outline: none;
        -webkit-appearance: none;
        cursor: pointer;
      }

      .solar-slider::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: white;
        cursor: pointer;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
      }

      .solar-slider::-moz-range-thumb {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: white;
        cursor: pointer;
        border: none;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
      }

      .solar-results {
        background: rgba(255, 255, 255, 0.15);
        border-radius: 8px;
        padding: 1.5rem;
        margin-bottom: 1.5rem;
      }

      .solar-results-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 1rem;
        margin-bottom: 1rem;
      }

      .solar-result-box {
        background: rgba(255, 255, 255, 0.1);
        padding: 1rem;
        border-radius: 6px;
        border: 1px solid rgba(255, 255, 255, 0.2);
        text-align: center;
      }

      .solar-result-label {
        font-size: 0.75rem;
        opacity: 0.85;
        margin-bottom: 0.5rem;
      }

      .solar-result-value {
        font-size: 1.5rem;
        font-weight: 800;
      }

      .solar-result-unit {
        font-size: 0.7rem;
        opacity: 0.7;
        margin-top: 0.3rem;
      }

      .solar-chart {
        background: rgba(255, 255, 255, 0.1);
        border-radius: 6px;
        padding: 1rem;
        margin-bottom: 1rem;
      }

      .solar-payback-timeline {
        position: relative;
        height: 60px;
        background: rgba(0, 0, 0, 0.1);
        border-radius: 6px;
        overflow: hidden;
        margin-bottom: 1rem;
      }

      .payback-bar {
        height: 100%;
        background: linear-gradient(90deg, #ff4444 0%, #ffaa00 50%, #44aa44 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 700;
        font-size: 0.85rem;
        transition: width 0.3s ease;
      }

      .solar-financing-options {
        margin-top: 1.5rem;
      }

      .financing-option {
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.3);
        border-radius: 6px;
        padding: 1rem;
        margin-bottom: 0.8rem;
        cursor: pointer;
        transition: all 0.3s;
      }

      .financing-option:hover {
        background: rgba(255, 255, 255, 0.15);
        border-color: white;
      }

      .financing-title {
        font-weight: 600;
        margin-bottom: 0.3rem;
        display: flex;
        justify-content: space-between;
      }

      .financing-terms {
        font-size: 0.8rem;
        opacity: 0.8;
      }

      .solar-actions {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
        margin-top: 1.5rem;
      }

      .solar-btn {
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

      .solar-btn:hover {
        background: rgba(255, 255, 255, 0.3);
        border-color: white;
      }

      .solar-btn.primary {
        background: white;
        color: #ff8c00;
        border-color: white;
      }

      .solar-btn.primary:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
      }

      .solar-modal {
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

      .solar-modal.active {
        display: flex;
      }

      .solar-modal-content {
        background: white;
        border-radius: 12px;
        padding: 2rem;
        max-width: 700px;
        max-height: 80vh;
        overflow-y: auto;
        animation: slideUp 0.3s ease;
      }

      .solar-tip {
        background: rgba(255, 255, 255, 0.1);
        border-left: 3px solid white;
        padding: 0.8rem;
        border-radius: 4px;
        margin-bottom: 1rem;
        font-size: 0.85rem;
        line-height: 1.5;
      }

      /* Responsivo */
      @media (max-width: 768px) {
        .solar-input-grid {
          grid-template-columns: 1fr;
        }

        .solar-results-grid {
          grid-template-columns: 1fr;
        }

        .solar-actions {
          grid-template-columns: 1fr;
        }

        .solar-modal-content {
          margin: 1rem;
          max-width: 95vw;
        }
      }
    `;

    document.head.appendChild(styles);
  }

  // Renderizar calculator
  renderCalculatorButton() {
    return `
      <button class="btn-primary" onclick="solarROIModule.openCalculator()"
              style="background: linear-gradient(135deg, #ffa500 0%, #ff8c00 100%); width: 100%; padding: 1rem;">
        ☀️ Calcular ROI de Energia Solar
      </button>
    `;
  }

  // Abrir calculator modal
  openCalculator() {
    const modalHtml = `
      <div class="solar-modal active" id="solar-modal" onclick="solarROIModule.closeCalculator()">
        <div class="solar-modal-content" onclick="event.stopPropagation();">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
            <h2 style="color: #ff8c00; margin: 0;">☀️ Simulador Solar ROI</h2>
            <button style="background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #666;" onclick="solarROIModule.closeCalculator()">✕</button>
          </div>

          <div class="solar-calculator-card" style="margin: 0; padding: 2rem;">
            <div style="margin-bottom: 2rem;">
              <div class="solar-input-grid">
                <div class="solar-input-group">
                  <label class="solar-label">Área Útil para Painel (m²)</label>
                  <input
                    type="number"
                    id="solar-area"
                    value="100"
                    min="10"
                    max="10000"
                    step="10"
                    class="solar-input"
                    onchange="solarROIModule.calculate()"
                  >
                </div>

                <div class="solar-input-group">
                  <label class="solar-label">Tarifa Atual (R$/kWh)</label>
                  <input
                    type="number"
                    id="solar-tariff"
                    value="1.25"
                    min="0.50"
                    max="3.00"
                    step="0.05"
                    class="solar-input"
                    onchange="solarROIModule.calculate()"
                  >
                </div>

                <div class="solar-input-group">
                  <label class="solar-label">Consumo Mensal (kWh)</label>
                  <input
                    type="number"
                    id="solar-consumption"
                    value="2000"
                    min="100"
                    max="100000"
                    step="100"
                    class="solar-input"
                    onchange="solarROIModule.calculate()"
                  >
                </div>

                <div class="solar-input-group">
                  <label class="solar-label">% Cobertura Desejada</label>
                  <input
                    type="number"
                    id="solar-coverage"
                    value="80"
                    min="30"
                    max="100"
                    step="5"
                    class="solar-input"
                    onchange="solarROIModule.calculate()"
                  >
                </div>
              </div>

              <div class="solar-slider-group">
                <div class="solar-slider-label">
                  <span>Preço do Watt (R$)</span>
                  <span id="solar-price-display">R$ 5.00/kWp</span>
                </div>
                <input
                  type="range"
                  id="solar-price"
                  min="4"
                  max="8"
                  step="0.1"
                  value="5"
                  class="solar-slider"
                  onchange="solarROIModule.calculate()"
                >
              </div>
            </div>

            <div id="solar-results-container">
              ${this.renderResults()}
            </div>
          </div>

          <div id="solar-details-container"></div>
        </div>
      </div>
    `;

    const existingModal = document.getElementById('solar-modal');
    if (existingModal) existingModal.remove();

    const container = document.createElement('div');
    container.innerHTML = modalHtml;
    document.body.appendChild(container.firstElementChild);

    // Calcular resultados iniciais
    this.calculate();
  }

  closeCalculator() {
    const modal = document.getElementById('solar-modal');
    if (modal) modal.remove();
  }

  // Calcular
  calculate() {
    const area = parseFloat(document.getElementById('solar-area')?.value || 100);
    const tariff = parseFloat(document.getElementById('solar-tariff')?.value || 1.25);
    const consumption = parseFloat(document.getElementById('solar-consumption')?.value || 2000);
    const coverage = parseFloat(document.getElementById('solar-coverage')?.value || 80) / 100;
    const pricePerKWp = parseFloat(document.getElementById('solar-price')?.value || 5);

    // Atualizar display do slider
    const priceDisplay = document.getElementById('solar-price-display');
    if (priceDisplay) priceDisplay.textContent = `R$ ${pricePerKWp.toFixed(2)}/kWp`;

    // Produção solar por m² (SP ~4.5 kWh/m²/dia)
    const productionPerM2PerDay = 4.5;
    const productionPerM2PerYear = productionPerM2PerDay * 365;
    const annualProduction = area * productionPerM2PerYear;

    // Sistema necessário (baseado em consumo + cobertura desejada)
    const monthlyConsumption = consumption;
    const requiredMonthly = monthlyConsumption * coverage;
    const requiredAnnual = requiredMonthly * 12;
    const systemCapacity = requiredAnnual / productionPerM2PerYear;

    // Investimento
    const investmentCost = systemCapacity * 1000 * pricePerKWp; // kW to W

    // Economia anual
    const annualSavings = requiredAnnual * tariff;

    // Payback
    const paybackYears = investmentCost / annualSavings;

    // 25 anos de produção
    const lifetime25YearsSavings = annualSavings * 25;
    const totalGain = lifetime25YearsSavings - investmentCost;

    this.calculations = {
      area,
      tariff,
      consumption,
      coverage,
      pricePerKWp,
      systemCapacity: Math.round(systemCapacity),
      investmentCost: Math.round(investmentCost),
      annualProduction: Math.round(annualProduction),
      requiredAnnual: Math.round(requiredAnnual),
      annualSavings: Math.round(annualSavings),
      paybackYears: parseFloat(paybackYears.toFixed(1)),
      lifetime25YearsSavings: Math.round(lifetime25YearsSavings),
      totalGain: Math.round(totalGain)
    };

    // Atualizar resultados
    const resultsContainer = document.getElementById('solar-results-container');
    if (resultsContainer) {
      resultsContainer.innerHTML = this.renderResults();
    }

    // Atualizar detalhes
    const detailsContainer = document.getElementById('solar-details-container');
    if (detailsContainer) {
      detailsContainer.innerHTML = this.renderDetails();
    }
  }

  // Renderizar resultados
  renderResults() {
    if (!this.calculations.systemCapacity) {
      return '<div class="solar-tip">Ajuste os parâmetros acima para ver os resultados da simulação.</div>';
    }

    const c = this.calculations;
    const paybackColor = c.paybackYears <= 5 ? '#44aa44' : c.paybackYears <= 7 ? '#ffaa00' : '#ff4444';

    return `
      <div class="solar-results">
        <div class="solar-results-grid">
          <div class="solar-result-box">
            <div class="solar-result-label">Capacidade do Sistema</div>
            <div class="solar-result-value">${c.systemCapacity}</div>
            <div class="solar-result-unit">kW</div>
          </div>

          <div class="solar-result-box">
            <div class="solar-result-label">Investimento Total</div>
            <div class="solar-result-value" style="font-size: 1.2rem;">R$ ${(c.investmentCost / 1000).toFixed(0)}k</div>
            <div class="solar-result-unit">(preço total)</div>
          </div>

          <div class="solar-result-box">
            <div class="solar-result-label">Economia Anual</div>
            <div class="solar-result-value" style="font-size: 1.2rem;">R$ ${(c.annualSavings / 1000).toFixed(0)}k</div>
            <div class="solar-result-unit">(em energia)</div>
          </div>
        </div>

        <div class="solar-chart">
          <div style="font-size: 0.9rem; font-weight: 600; margin-bottom: 0.8rem;">📊 Payback (retorno)</div>
          <div class="solar-payback-timeline">
            <div class="payback-bar" style="width: ${Math.min((c.paybackYears / 10) * 100, 100)}%; background-color: ${paybackColor};">
              ${c.paybackYears.toFixed(1)} anos
            </div>
          </div>
          <div style="font-size: 0.8rem; opacity: 0.8; margin-top: 0.5rem;">
            ${c.paybackYears <= 5 ? '✅ EXCELENTE! Menor que 5 anos' : c.paybackYears <= 7 ? '⚠️ BOM, mas acima do ideal' : '❌ Acima do esperado'}
          </div>
        </div>

        <div class="solar-tip">
          💡 <strong>25 anos de vida útil</strong><br>
          Economia total: <strong>R$ ${(c.lifetime25YearsSavings / 1000000).toFixed(1)}M</strong> |
          Lucro líquido: <strong>R$ ${(c.totalGain / 1000000).toFixed(1)}M</strong>
        </div>
      </div>
    `;
  }

  // Renderizar detalhes e opções
  renderDetails() {
    if (!this.calculations.systemCapacity) return '';

    const c = this.calculations;

    return `
      <div style="color: #1c2016; margin-top: 1.5rem;">
        <h3 style="color: #ff8c00; margin-bottom: 1rem; font-size: 1rem;">💰 Opções de Financiamento</h3>

        <div class="financing-option" onclick="solarROIModule.shareFinancing('feap')">
          <div class="financing-title">
            <span>🏦 FEAP (Fundo SP)</span>
            <span style="font-size: 0.8rem; opacity: 0.8;">Até R$ 250k</span>
          </div>
          <div class="financing-terms">
            Taxa: 8.81% a.a. | Até 84 meses | Carência: 12 meses
          </div>
        </div>

        <div class="financing-option" onclick="solarROIModule.shareFinancing('bndes')">
          <div class="financing-title">
            <span>🏛️ BNDES Finame</span>
            <span style="font-size: 0.8rem; opacity: 0.8;">Sem limite</span>
          </div>
          <div class="financing-terms">
            Taxa: TJLP + 1.5% a.a. | Até 120 meses | Carência: 12 meses
          </div>
        </div>

        <div class="financing-option" onclick="solarROIModule.shareFinancing('pronaf')">
          <div class="financing-title">
            <span>🌾 PRONAF Eco</span>
            <span style="font-size: 0.8rem; opacity: 0.8;">Até R$ 150k</span>
          </div>
          <div class="financing-terms">
            Taxa: 2.5% a.a. | Até 60 meses | Pequenos produtores
          </div>
        </div>

        <div style="background: #f0f8ff; border: 2px solid #ff8c00; border-radius: 8px; padding: 1rem; margin-top: 1.5rem; color: #1c2016;">
          <strong style="display: block; margin-bottom: 0.8rem;">🚀 Próximos Passos</strong>
          <ol style="margin-left: 1.2rem; font-size: 0.9rem; line-height: 1.6;">
            <li><strong>Agendar visita técnica</strong> para validar estrutura</li>
            <li><strong>Verificar elegibilidade</strong> para programa de financiamento</li>
            <li><strong>Coletar orçamentos</strong> de instaladores qualificados</li>
            <li><strong>Formalizar crédito</strong> e iniciar instalação</li>
          </ol>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-top: 1.5rem;">
          <button class="solar-btn" onclick="solarROIModule.exportPDF()">
            📄 Exportar Relatório
          </button>
          <button class="solar-btn primary" onclick="solarROIModule.shareWhatsApp()">
            💬 Enviar via WhatsApp
          </button>
        </div>
      </div>
    `;
  }

  // Compartilhar proposta via WhatsApp
  shareWhatsApp() {
    const c = this.calculations;
    const message = encodeURIComponent(
      `☀️ *Proposta Solar Rural - ROI Analysis*\n\n` +
      `📊 *Simulação:*\n` +
      `├ Área útil: ${c.area}m²\n` +
      `├ Capacidade: ${c.systemCapacity}kW\n` +
      `├ Produção anual: ${(c.annualProduction / 1000).toFixed(0)}MWh\n\n` +
      `💰 *Financeiro:*\n` +
      `├ Investimento: R$ ${(c.investmentCost / 1000).toFixed(0)}k\n` +
      `├ Economia/ano: R$ ${(c.annualSavings / 1000).toFixed(0)}k\n` +
      `├ Payback: ${c.paybackYears} anos\n` +
      `├ Lucro 25 anos: R$ ${(c.totalGain / 1000000).toFixed(1)}M\n\n` +
      `Vamos agendar uma visita técnica? 📅`
    );

    window.open(`https://wa.me/5516993784631?text=${message}`, '_blank');
  }

  shareFinancing(program) {
    const c = this.calculations;
    const programs = {
      feap: 'FEAP (Fundo Expansão Agronegócio Paulista) - R$ 250k max, 8.81%',
      bndes: 'BNDES Finame - Sem limite, TJLP+1.5%',
      pronaf: 'PRONAF Eco - R$ 150k max, 2.5% (pequenos produtores)'
    };

    const message = encodeURIComponent(
      `☀️ *Interesse em Energia Solar - Programa ${program.toUpperCase()}*\n\n` +
      `Sistema de ${c.systemCapacity}kW\n` +
      `Investimento: R$ ${(c.investmentCost / 1000).toFixed(0)}k\n` +
      `Payback: ${c.paybackYears} anos\n\n` +
      `Gostaria de saber mais sobre: ${programs[program]}\n\n` +
      `Quando posso receber uma consultoria? 📞`
    );

    window.open(`https://wa.me/5516993784631?text=${message}`, '_blank');
  }

  exportPDF() {
    const c = this.calculations;
    const content = `
      SIMULAÇÃO SOLAR ROI - GeoRadar Agro
      ===================================

      PARÂMETROS:
      - Área útil: ${c.area}m²
      - Tarifa: R$ ${c.tariff}/kWh
      - Consumo mensal: ${c.consumption}kWh
      - Cobertura desejada: ${c.coverage * 100}%

      SISTEMA:
      - Capacidade: ${c.systemCapacity}kW
      - Produção anual: ${(c.annualProduction / 1000).toFixed(1)}MWh
      - Investimento: R$ ${(c.investmentCost / 1000).toFixed(0)}mil

      RESULTADOS:
      - Economia anual: R$ ${(c.annualSavings / 1000).toFixed(0)}mil
      - Payback: ${c.paybackYears} anos
      - Lucro 25 anos: R$ ${(c.totalGain / 1000000).toFixed(1)}M

      Gerado em: ${new Date().toLocaleDateString('pt-BR')}
    `;

    alert('Relatório:\n\n' + content);
  }
}

// Global instance
const solarROIModule = new SolarROIModule();
