-- Pele Protegida: tabela de respostas anônimas do questionário + view de análise.
-- Nenhum dado pessoal é coletado (sem nome, CPF, telefone, IP ou geolocalização).

create table public.respostas (
  id                   uuid primary key,          -- gerado no cliente (crypto.randomUUID) → reenvio idempotente
  created_at           timestamptz not null default now(),
  respondida_em        timestamptz not null,      -- quando a pessoa terminou (mesmo se enviada depois)
  consentimento        boolean not null check (consentimento = true),
  respostas            jsonb not null,            -- { "p1": "...", ..., "p24": ["..."] }
  flags                text[] not null default '{}',
  resultado_prevencao  text not null check (resultado_prevencao in ('atencao', 'pode_melhorar', 'caminho')),
  alerta_ubs           text check (alerta_ubs in ('sim', 'incerto')),  -- null = sem alerta
  versao_questionario  text not null,
  origem               text not null default 'web' check (origem in ('web', 'pwa')),
  constraint respostas_is_object check (jsonb_typeof(respostas) = 'object'),
  constraint respostas_size check (pg_column_size(respostas) < 8192)
);

comment on table public.respostas is
  'Respostas anônimas do questionário Pele Protegida. Sem dados pessoais.';

alter table public.respostas enable row level security;

-- Defesa em profundidade: além da RLS, anon só tem o privilégio de INSERT
-- e authenticated não tem nenhum. Leitura apenas pelo dashboard / service role.
revoke all on table public.respostas from anon, authenticated;
grant insert on table public.respostas to anon;

create policy "anon pode inserir com consentimento"
  on public.respostas
  for insert
  to anon
  with check (consentimento = true);

-- View de análise: uma coluna por pergunta.
create view public.vw_respostas
  with (security_invoker = true) as
select
  r.id,
  r.respondida_em,
  r.versao_questionario,
  r.origem,
  r.respostas ->> 'p1'  as p1,
  r.respostas ->> 'p2'  as p2,
  r.respostas ->> 'p3'  as p3,
  r.respostas ->> 'p4'  as p4,
  r.respostas ->> 'p5'  as p5,
  r.respostas ->> 'p6'  as p6,
  r.respostas ->> 'p7'  as p7,
  r.respostas ->> 'p8'  as p8,
  r.respostas ->> 'p9'  as p9,
  r.respostas ->> 'p10' as p10,
  r.respostas ->> 'p11' as p11,
  r.respostas ->> 'p12' as p12,
  r.respostas ->> 'p13' as p13,
  r.respostas ->> 'p14' as p14,
  r.respostas ->> 'p15' as p15,
  r.respostas ->> 'p16' as p16,
  r.respostas ->> 'p17' as p17,
  r.respostas ->> 'p18' as p18,
  r.respostas ->> 'p19' as p19,
  r.respostas ->> 'p20' as p20,
  r.respostas ->> 'p21' as p21,
  r.respostas ->> 'p22' as p22,
  r.respostas ->> 'p23' as p23,
  case
    when jsonb_typeof(r.respostas -> 'p24') = 'array'
      then array(select jsonb_array_elements_text(r.respostas -> 'p24'))
  end as p24,
  r.flags,
  r.resultado_prevencao,
  r.alerta_ubs
from public.respostas r;

comment on view public.vw_respostas is
  'Respostas achatadas (uma coluna por pergunta) para exportação/análise.';

revoke all on table public.vw_respostas from anon, authenticated;
