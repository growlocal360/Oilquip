-- Quotes shown randomly in the website footer.
-- Run once in the Supabase SQL editor.

create table public.quotes (
  id uuid primary key default gen_random_uuid(),
  quote_text text not null,
  author text,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.quotes enable row level security;

create policy "Public can read published quotes"
  on public.quotes for select
  using (published = true);

create policy "Authenticated can read all quotes"
  on public.quotes for select
  to authenticated
  using (true);

create policy "Authenticated can insert quotes"
  on public.quotes for insert
  to authenticated
  with check (true);

create policy "Authenticated can update quotes"
  on public.quotes for update
  to authenticated
  using (true);

create policy "Authenticated can delete quotes"
  on public.quotes for delete
  to authenticated
  using (true);

create or replace function public.quotes_set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger quotes_updated_at
  before update on public.quotes
  for each row
  execute function public.quotes_set_updated_at();

-- Seed with the quote currently hardcoded in the footer
insert into public.quotes (quote_text, author) values (
  'What is a soul? It''s like electricity — we don''t know really what it is, but it''s a force that can light a room',
  'Ray Charles'
);
