/**
 * Database initialization and management for GeoRadar Agro
 * Stores leads progressively as APIs are queried
 */

const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const os = require('os');

// Use in-memory database for Railway (no file system issues), local file for development
const DB_PATH = process.env.DB_PATH ||
    (process.env.NODE_ENV === 'production'
        ? ':memory:'  // In-memory database - works reliably on Railway
        : path.join(__dirname, 'leads.db'));

let db = null;

/**
 * Initialize database connection
 */
function initDatabase() {
    return new Promise((resolve, reject) => {
        console.log('📁 Caminho do banco:', DB_PATH);
        console.log('🔧 Ambiente:', process.env.NODE_ENV || 'development');

        db = new sqlite3.Database(DB_PATH, (err) => {
            if (err) {
                console.error('❌ Erro ao conectar ao banco de dados:', err);
                console.error('Detalhes:', err.message);
                reject(err);
            } else {
                console.log('✅ Banco de dados conectado:', DB_PATH);
                // Aguardar criação de tabelas antes de resolver
                createTables()
                    .then(() => {
                        console.log('✅ Banco pronto para operações');
                        resolve(db);
                    })
                    .catch((err) => {
                        console.error('❌ Erro ao criar tabelas:', err);
                        reject(err);
                    });
            }
        });
    });
}

/**
 * Create tables if they don't exist
 */
function createTables() {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            // Tabela de leads
            db.run(`
                CREATE TABLE IF NOT EXISTS leads (
                    id TEXT PRIMARY KEY,
                    nome TEXT NOT NULL,
                    estado TEXT NOT NULL,
                    modulo TEXT NOT NULL,
                    propriedade TEXT,
                    tamanho TEXT,
                    score INTEGER,
                    status TEXT,
                    fonte TEXT,
                    cnpj TEXT,
                    atividade TEXT,
                    porte TEXT,
                    telefone TEXT,
                    email TEXT,
                    areaPreservada TEXT,
                    cultura TEXT,
                    temperatura REAL,
                    umidade REAL,
                    precipitacao REAL,
                    data_captura TEXT,
                    data_atualizacao TEXT,
                    metadata TEXT
                )
            `, (err) => {
                if (err) reject(err);
            });

            // Tabela de log de atualizações
            db.run(`
                CREATE TABLE IF NOT EXISTS update_log (
                    id TEXT PRIMARY KEY,
                    estado TEXT,
                    modulo TEXT,
                    fonte TEXT,
                    total_encontrados INTEGER,
                    data_atualizacao TEXT
                )
            `, (err) => {
                if (err) reject(err);
                else {
                    console.log('✅ Tabelas criadas/verificadas');
                    resolve();
                }
            });
        });
    });
}

/**
 * Adicionar ou atualizar lead no banco
 */
function saveLead(lead) {
    return new Promise((resolve, reject) => {
        const leadId = lead.id || uuidv4();
        const agora = new Date().toISOString();

        db.run(
            `INSERT OR REPLACE INTO leads (
                id, nome, estado, modulo, propriedade, tamanho, score, status, fonte,
                cnpj, atividade, porte, telefone, email, areaPreservada, cultura,
                temperatura, umidade, precipitacao, data_captura, data_atualizacao, metadata
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                leadId,
                lead.nome,
                lead.estado,
                lead.modulo,
                lead.propriedade,
                lead.tamanho,
                lead.score,
                lead.status,
                lead.fonte,
                lead.cnpj || null,
                lead.atividade || null,
                lead.porte || null,
                lead.telefone || null,
                lead.email || null,
                lead.areaPreservada || null,
                lead.cultura || null,
                lead.temperatura || null,
                lead.umidade || null,
                lead.precipitacao || null,
                lead.timestamp || agora,
                agora,
                JSON.stringify(lead)
            ],
            (err) => {
                if (err) reject(err);
                else resolve(leadId);
            }
        );
    });
}

/**
 * Salvar múltiplos leads em batch
 */
function saveLeedsBatch(leads) {
    return new Promise(async (resolve, reject) => {
        try {
            db.serialize(() => {
                db.run('BEGIN TRANSACTION');
                let count = 0;

                leads.forEach((lead, index) => {
                    db.run(
                        `INSERT OR REPLACE INTO leads (
                            id, nome, estado, modulo, propriedade, tamanho, score, status, fonte,
                            cnpj, atividade, porte, telefone, email, areaPreservada, cultura,
                            temperatura, umidade, precipitacao, data_captura, data_atualizacao, metadata
                        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                        [
                            lead.id || uuidv4(),
                            lead.nome,
                            lead.estado,
                            lead.modulo,
                            lead.propriedade,
                            lead.tamanho,
                            lead.score,
                            lead.status,
                            lead.fonte,
                            lead.cnpj || null,
                            lead.atividade || null,
                            lead.porte || null,
                            lead.telefone || null,
                            lead.email || null,
                            lead.areaPreservada || null,
                            lead.cultura || null,
                            lead.temperatura || null,
                            lead.umidade || null,
                            lead.precipitacao || null,
                            lead.timestamp || new Date().toISOString(),
                            new Date().toISOString(),
                            JSON.stringify(lead)
                        ],
                        (err) => {
                            if (!err) count++;
                            if (index === leads.length - 1) {
                                db.run('COMMIT', (err) => {
                                    if (err) reject(err);
                                    else resolve(count);
                                });
                            }
                        }
                    );
                });
            });
        } catch (err) {
            reject(err);
        }
    });
}

/**
 * Buscar leads do banco por estado e módulo
 */
function getStoredLeads(estado, modulo = null) {
    return new Promise((resolve, reject) => {
        let query = 'SELECT * FROM leads WHERE estado = ?';
        let params = [estado];

        if (modulo) {
            query += ' AND modulo = ?';
            params.push(modulo);
        }

        query += ' ORDER BY score DESC, data_atualizacao DESC';

        db.all(query, params, (err, rows) => {
            if (err) reject(err);
            else resolve(rows || []);
        });
    });
}

/**
 * Contar leads no banco
 */
function countLeads(estado = null, modulo = null) {
    return new Promise((resolve, reject) => {
        let query = 'SELECT COUNT(*) as total FROM leads';
        let params = [];

        if (estado) {
            query += ' WHERE estado = ?';
            params.push(estado);

            if (modulo) {
                query += ' AND modulo = ?';
                params.push(modulo);
            }
        }

        db.get(query, params, (err, row) => {
            if (err) reject(err);
            else resolve(row?.total || 0);
        });
    });
}

/**
 * Registrar atualização de dados
 */
function logUpdate(estado, modulo, fonte, totalEncontrados) {
    return new Promise((resolve, reject) => {
        db.run(
            `INSERT INTO update_log (id, estado, modulo, fonte, total_encontrados, data_atualizacao)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [
                uuidv4(),
                estado,
                modulo,
                fonte,
                totalEncontrados,
                new Date().toISOString()
            ],
            (err) => {
                if (err) reject(err);
                else resolve();
            }
        );
    });
}

/**
 * Limpar banco de dados (desenvolvimento)
 */
function clearDatabase() {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            db.run('DELETE FROM leads', (err) => {
                if (err) reject(err);
                else {
                    db.run('DELETE FROM update_log', (err) => {
                        if (err) reject(err);
                        else resolve();
                    });
                }
            });
        });
    });
}

/**
 * Obter estatísticas do banco
 */
function getStats() {
    return new Promise((resolve, reject) => {
        db.all(
            `SELECT modulo, COUNT(*) as total, AVG(score) as scoreMedia
             FROM leads
             GROUP BY modulo`,
            (err, rows) => {
                if (err) reject(err);
                else resolve(rows || []);
            }
        );
    });
}

module.exports = {
    initDatabase,
    saveLead,
    saveLeedsBatch,
    getStoredLeads,
    countLeads,
    logUpdate,
    clearDatabase,
    getStats
};
