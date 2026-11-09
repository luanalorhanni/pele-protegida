# Pele Protegida

Site de educação em saúde para a UBS de São Luís (MA), voltado a trabalhadores expostos ao sol, principalmente pescadores.
É uma PWA instalável no celular, que também funciona bem no navegador do computador.

Telas: **Início**, **Checklist**, **Consentimento**, **Questionário** (24 perguntas, algumas condicionais), **Resultado** e **Quero falar com a UBS**.

> O site dá orientações de prevenção. Ele **não faz diagnóstico** e não substitui uma consulta.

## Tecnologias

- Vite + React + TypeScript
- `vite-plugin-pwa` (Workbox): manifest, service worker e precache do app shell
- `@supabase/supabase-js`: gravação anônima das respostas
- `idb-keyval`: fila offline no IndexedDB
- Vitest: testes da lógica de resultado e da fila

## Onde editar o conteúdo

| O quê | Arquivo |
| --- | --- |
| Perguntas, opções, códigos (flags) e condições de exibição | `src/content/questions.ts` |
| Versão do questionário gravada no banco | `QUESTIONNAIRE_VERSION` em `src/content/questions.ts` |
| Textos do resultado (dicas, mensagens, aviso da UBS) | `src/content/result-texts.ts` |
| Checklist, consentimento e rodapé | `src/content/screens.ts` |
| **Dados da UBS** (endereço, telefone, WhatsApp, horário, como marcar) | `src/content/ubs.ts` |
| Lógica do resultado (função pura) | `src/lib/computeResult.ts` |
| Ícones do app | `scripts/gen-icons.mjs` → `npm run icons` |
| Logo do cabeçalho (Universidade CEUMA) | `public/brand/logo-ceuma.png` |

Sempre que mudar o **sentido** de uma pergunta, as opções, os valores ou as condições, aumente `QUESTIONNAIRE_VERSION` (ex.: `2026-11-v2`). Assim você sabe qual versão gerou cada resposta.

## Rodar localmente

Requisito: Node.js 20 ou mais novo.

```bash
npm install
cp .env.example .env.local   # e preencha a chave publicável
npm run dev                  # http://localhost:5173
```

Outros comandos:

```bash
npm test          # testes (Vitest)
npm run build     # build de produção em dist/ (inclui o service worker)
npm run preview   # serve o build em http://localhost:4173 (use para testar PWA/offline)
npm run icons     # gera de novo os ícones em public/icons/
```

O service worker só é gerado no build. Para testar o modo offline e a instalação, use `npm run build && npm run preview`.

## Variáveis de ambiente

| Variável | Valor |
| --- | --- |
| `VITE_SUPABASE_URL` | `https://xxebcvxvsdaeroemxpxf.supabase.co` |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | chave **publicável** (`sb_publishable_...`), em Supabase → Project Settings → API Keys |

- Localmente, elas ficam em `.env.local` (fora do git). O `.env.example` é o modelo versionado.
- **Nunca** use a *service role key* (ou a *secret key*) no front-end. Tudo que começa com `VITE_` vai para o navegador.
- Sem essas variáveis, o app funciona, mas as respostas ficam só na fila local do aparelho.

## Banco de dados (Supabase)

Projeto: **pele-protegida** (ref `xxebcvxvsdaeroemxpxf`). As mudanças de schema ficam em `supabase/migrations/`.

- `public.respostas`: uma linha por questionário respondido. Não guarda nome, CPF, telefone, IP nem localização.
- RLS ligada. O papel `anon` só tem **INSERT** (policy `with check (consentimento = true)`). Não há SELECT, UPDATE nem DELETE para `anon` ou `authenticated`.
- `public.vw_respostas`: view de análise com uma coluna por pergunta (`security_invoker = true`, sem acesso para `anon`/`authenticated`).
- O `id` é gerado no aparelho (`crypto.randomUUID()`). Se a fila reenviar a mesma resposta, o banco recusa a duplicata (erro `23505`) e o app trata isso como sucesso.

### Aplicar as migrations

A migration inicial (`20261109164359_respostas.sql`) **já está aplicada** no projeto. Para um projeto novo ou para migrations futuras:

**Com o Supabase CLI:**

```bash
npx supabase login
npx supabase link --project-ref xxebcvxvsdaeroemxpxf
npx supabase db push          # aplica o que estiver em supabase/migrations/ e ainda não foi aplicado
```

**Pelo painel:** Supabase → SQL Editor → cole o conteúdo do arquivo `.sql` e execute. Nesse caso o histórico de migrations do CLI não é atualizado.

Para uma mudança nova, crie um arquivo com timestamp, por exemplo `npx supabase migration new nome_da_mudanca`. Nunca edite uma migration que já foi aplicada.

## Deploy na Vercel

1. Importe o repositório na Vercel. O preset **Vite** é detectado; o `vercel.json` já define o build (`npm run build`) e a saída (`dist`).
2. Em **Settings → Environment Variables**, cadastre `VITE_SUPABASE_URL` e `VITE_SUPABASE_PUBLISHABLE_KEY` para *Production* e *Preview*.
3. Faça o deploy.

O `vercel.json` já cuida do seguinte:
- Rewrite de SPA para `index.html` (`/checklist`, `/ubs` etc. funcionam ao recarregar).
- `sw.js`, `workbox-*.js`, `manifest.webmanifest` e `index.html` **sem cache longo** (`max-age=0, must-revalidate`), para que as atualizações cheguem.
- Arquivos em `/assets/` (com hash no nome) com cache de 1 ano.

## Testar a instalação

A instalação exige **HTTPS** (a URL da Vercel serve) ou `localhost`.

### Android (Chrome)

1. Abra o site no Chrome.
2. Na tela inicial, toque em **Instalar no celular**. O botão usa o diálogo nativo (`beforeinstallprompt`).
   Se o botão não aparecer, use o menu ⋮ → **Instalar app** / **Adicionar à tela inicial**.
3. Abra o app pelo ícone. Ele roda em tela cheia e o botão de instalar desaparece.
4. Teste offline: com o app aberto uma vez, ative o modo avião e abra de novo. Início, Checklist, Questionário e "Falar com a UBS" funcionam.

### iPhone (Safari)

1. Abra o site no **Safari**.
2. Toque em **Instalar no celular**. Aparecem as instruções: **Compartilhar → Adicionar à Tela de Início → Adicionar**.
3. Abra pelo ícone na tela de início.

Observação: o iOS não tem Background Sync. Por isso o envio da fila acontece ao abrir o app, ao voltar para ele e quando a conexão volta (evento `online`).

### Atualizações

Depois de um novo deploy, quem já tem o app vê **"Atualização disponível — Atualizar"**. Ao tocar em Atualizar, o app recarrega com a nova versão. O app também procura atualizações a cada hora.

### Respostas sem internet

Se a pessoa terminar o questionário sem internet, a resposta vai para uma fila no IndexedDB do aparelho e aparece o aviso "Sem internet agora…".
O envio é automático quando a conexão volta ou na próxima vez que o app for aberto.

## Prévia do link (WhatsApp, Telegram, redes sociais)

Ao compartilhar o link, os apps mostram a imagem `public/og-image.jpg` (1200×630) com título e descrição. As tags `og:*` e `twitter:*` ficam em `index.html`.

- A imagem precisa de **URL absoluta**. No build da Vercel o domínio de produção entra sozinho (variável `VERCEL_PROJECT_PRODUCTION_URL`). Se usar um domínio próprio ou outro serviço, defina `VITE_SITE_URL` (ex.: `https://pelep.exemplo.com.br`).
- Para mudar a arte, edite `scripts/og/og.html` e rode `npm run og` (usa o Chrome instalado; defina `CHROME_PATH` se ele não for encontrado).
- O WhatsApp guarda a prévia em cache. Depois de trocar a imagem, teste com um link novo (ex.: `https://seu-dominio/?v=2`) ou confira em [opengraph.xyz](https://www.opengraph.xyz/).

## Exportar as respostas

As respostas só podem ser lidas pelo painel do Supabase ou com a service role (nunca pelo site).

**Pelo painel (mais simples):** Supabase → **SQL Editor**:

```sql
select * from public.vw_respostas order by respondida_em;
```

Depois clique em **Export → CSV**. Também dá para abrir a view em **Table Editor → vw_respostas → Export**.

Exemplos de análise:

```sql
-- quantas pessoas em cada resultado
select resultado_prevencao, count(*) from public.vw_respostas group by 1;

-- frequência de cada código interno
select f as flag, count(*) from public.respostas, unnest(flags) f group by 1 order by 2 desc;

-- barreiras para procurar a UBS (P24, múltipla escolha)
select b as barreira, count(*) from public.vw_respostas, unnest(p24) b group by 1 order by 2 desc;
```

Colunas da view: `id`, `respondida_em`, `versao_questionario`, `origem` (`web` ou `pwa`), `p1` … `p23` (texto), `p24` (lista), `flags`, `resultado_prevencao` (`atencao`, `pode_melhorar`, `caminho`) e `alerta_ubs` (`sim`, `incerto` ou vazio).

Os valores gravados são códigos curtos (ex.: `5mais`, `as_vezes`). O texto de cada opção está em `src/content/questions.ts`.

## Acessibilidade

- Fonte Atkinson Hyperlegible, texto base de 18px e alvos de toque com 48px ou mais.
- Opções do questionário são `radio`/`checkbox` reais dentro de `fieldset`. O foco vai para o título a cada tela ou pergunta.
- "Ouvir a pergunta" usa a Web Speech API com voz pt-BR. O botão some se o navegador não tiver suporte.
- Lighthouse 13 (mobile): 100 em Acessibilidade, Boas práticas e Desempenho nas telas Início, Checklist, Consentimento e UBS. axe-core sem violações também no Questionário e no Resultado.
