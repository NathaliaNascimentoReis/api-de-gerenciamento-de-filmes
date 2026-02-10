/*
 *
 * NUNCA EDITE ESTE ARQUIVO
 *
 *
 */

import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';
import { createInterface } from 'readline';
import { fileURLToPath } from 'url';
import { apagar } from './support.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const log = {
    title: (msg) => console.log(`\n\x1b[36m\x1b[1m┌── ${msg} ──┐\x1b[0m`),
    action: (msg) => console.log(`\x1b[36m→ ${msg}\x1b[0m`),
    success: (msg) => console.log(`\x1b[32m✓ ${msg}\x1b[0m`),
    info: (msg) => console.log(`\x1b[90m• ${msg}\x1b[0m`),
    error: (msg) => console.log(`\x1b[31m✗ ${msg}\x1b[0m`),
    warning: (msg) => console.log(`\x1b[33m⚠ ${msg}\x1b[0m`),
};

function perguntarUsuario(pergunta, valorPadrao = '') {
    return new Promise((resolve) => {
        const rl = createInterface({
            input: process.stdin,
            output: process.stdout,
        });
        const msgPadrao = valorPadrao ? ` (padrão: ${valorPadrao})` : '';
        rl.question(`\x1b[36m> ${pergunta}${msgPadrao}: \x1b[0m`, (resposta) => {
            rl.close();
            resolve(resposta.trim() || valorPadrao);
        });
    });
}

function runCommand(command) {
    return new Promise((resolve, reject) => {
        log.action(`Executando: ${command}`);

        const proc = spawn(command, [], {
            cwd: __dirname,
            shell: true,
            stdio: 'inherit',
        });

        proc.on('exit', (code) => {
            if (code === 0) {
                log.success(`Comando finalizado: ${command}`);
                resolve();
            } else {
                log.error(`Comando falhou com código: ${code}`);
                reject(new Error(`Command failed with code ${code}`));
            }
        });

        proc.on('error', (err) => {
            log.error(`Erro ao executar comando: ${err.message}`);
            reject(err);
        });
    });
}

async function configurarPrisma() {
    log.title('CONFIGURAÇÃO DO PRISMA');

    const ajustouSchema = await perguntarUsuario('Você ajustou o prisma/schema.prisma? (s/n)', 'n');
    const ajustouSeed = await perguntarUsuario('Você ajustou o prisma/seed.js? (s/n)', 'n');

    if (ajustouSchema.toLowerCase() !== 's' || ajustouSeed.toLowerCase() !== 's') {
        log.warning('Lembre-se de ajustar os arquivos antes de continuar!');
        const continuar = await perguntarUsuario('Deseja continuar mesmo assim? (s/n)', 'n');

        if (continuar.toLowerCase() !== 's') {
            log.error('Processo cancelado pelo usuário');
            process.exit(0);
        }
    }

    console.log('\n==================================');
    console.log('   CONFIGURAÇÃO DO BANCO DE DADOS');
    console.log('==================================\n');

    const nomeUsuario = await perguntarUsuario('Usuário do PostgreSQL', 'postgres');
    const senha = await perguntarUsuario('Senha do PostgreSQL', 'amods');
    const porta = await perguntarUsuario('Porta do PostgreSQL', '7777');
    const nomeBanco = await perguntarUsuario(
        'Nome do banco (adicione _db no final)',
        'meu_projeto_db',
    );

    console.log('\n==================================\n');

    return { nomeUsuario, senha, porta, nomeBanco };
}

async function atualizarEnv(config) {
    log.title('Atualizando arquivo .env');
    const envPath = path.join(__dirname, '.env');
    const envContent = `DATABASE_URL="postgresql://${config.nomeUsuario}:${config.senha}@localhost:${config.porta}/${config.nomeBanco}"\nPORT=3000`;
    fs.writeFileSync(envPath, envContent, 'utf8');
    log.success('.env atualizado com sucesso');
}

async function configurarBancoDados() {
    log.title('Configurando banco de dados');
    log.info('Criando banco e tabelas...');
    await runCommand('npx prisma migrate dev --name init');

    log.info('Gerando cliente Prisma...');
    await runCommand('npx prisma generate');

    log.info('\n\nPopulando banco de dados...');
    await runCommand('node prisma/seed.js');
}

async function deletarSegundo() {
    log.title('Deletando arquivos/pastas da segunda etapa');

    if (!Array.isArray(apagar.segundo)) {
        log.info('Nenhum item configurado em apagar.segundo');
        return;
    }

    for (const item of apagar.segundo) {
        const caminho = path.join(__dirname, item);
        try {
            if (fs.existsSync(caminho)) {
                const stats = fs.statSync(caminho);
                if (stats.isDirectory()) {
                    fs.rmSync(caminho, { recursive: true, force: true });
                    log.success(`Pasta removida: ${item}`);
                } else {
                    fs.unlinkSync(caminho);
                    log.success(`Arquivo removido: ${item}`);
                }
            } else {
                log.info(`Não encontrado: ${item}`);
            }
        } catch (erro) {
            log.error(`Erro ao deletar ${item}: ${erro.message}`);
        }
    }
}

async function main() {
    try {
        const config = await configurarPrisma();
        await atualizarEnv(config);
        await configurarBancoDados();
        await deletarSegundo();

        log.success('\n✅ Banco e seed aplicados.');
        log.success('Processo Prisma concluído com sucesso!');
        log.info('\n📚 Comandos úteis:');
        log.info('   npx prisma studio - Visualizar banco de dados');
        log.info('   npm run dev - Iniciar servidor');
    } catch (erro) {
        log.error(`Erro no processo: ${erro.message}`);
        process.exit(1);
    }
}

main();
