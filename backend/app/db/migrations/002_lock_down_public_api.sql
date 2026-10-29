-- O Supabase expõe o esquema "public" pela API REST para os papéis anon/authenticated.
-- O S.A.I.T.E. só acessa o banco pelo backend; aqui essa porta é fechada:
-- RLS ligado sem políticas (nega tudo a esses papéis) e privilégios revogados.
-- Em um PostgreSQL comum (sem esses papéis) a migração não faz nada além de ligar o RLS.

DO $$
DECLARE
    t TEXT;
BEGIN
    FOREACH t IN ARRAY ARRAY[
        'projects', 'conversations', 'messages', 'documents', 'document_blobs',
        'chunks', 'memories', 'settings', 'activity_log', 'schema_migrations'
    ] LOOP
        EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', t);
        IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN
            EXECUTE format('REVOKE ALL ON TABLE %I FROM anon, authenticated', t);
        END IF;
    END LOOP;
    IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN
        REVOKE ALL ON ALL SEQUENCES IN SCHEMA public FROM anon, authenticated;
    END IF;
END $$;
