-- S.A.I.T.E. — esquema inicial (PostgreSQL)
-- Fonte da verdade na nuvem (Supabase). Índice lexical via tsvector (português);
-- embeddings como float32 empacotados em bytea; arquivos originais em document_blobs.

CREATE TABLE projects (
    id           TEXT PRIMARY KEY,
    name         TEXT NOT NULL,
    description  TEXT NOT NULL DEFAULT '',
    instructions TEXT NOT NULL DEFAULT '',
    archived     INTEGER NOT NULL DEFAULT 0,
    created_at   TEXT NOT NULL,
    updated_at   TEXT NOT NULL
);

CREATE TABLE conversations (
    id          TEXT PRIMARY KEY,
    project_id  TEXT REFERENCES projects(id) ON DELETE CASCADE,
    title       TEXT NOT NULL DEFAULT 'Nova conversa',
    pinned      INTEGER NOT NULL DEFAULT 0,
    archived    INTEGER NOT NULL DEFAULT 0,
    created_at  TEXT NOT NULL,
    updated_at  TEXT NOT NULL
);
CREATE INDEX idx_conversations_project ON conversations(project_id);
CREATE INDEX idx_conversations_updated ON conversations(updated_at DESC);

CREATE TABLE messages (
    seq              BIGSERIAL UNIQUE,
    id               TEXT PRIMARY KEY,
    conversation_id  TEXT NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    role             TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'tool')),
    content          TEXT NOT NULL,
    status           TEXT NOT NULL DEFAULT 'complete'
                     CHECK (status IN ('complete', 'partial', 'error')),
    model            TEXT,
    citations        TEXT NOT NULL DEFAULT '[]',
    tool_calls       TEXT NOT NULL DEFAULT '[]',
    created_at       TEXT NOT NULL
);
CREATE INDEX idx_messages_conversation ON messages(conversation_id, seq);

CREATE TABLE documents (
    id               TEXT PRIMARY KEY,
    scope            TEXT NOT NULL CHECK (scope IN ('global', 'project', 'conversation')),
    project_id       TEXT REFERENCES projects(id) ON DELETE CASCADE,
    conversation_id  TEXT REFERENCES conversations(id) ON DELETE CASCADE,
    source_type      TEXT NOT NULL CHECK (source_type IN ('file', 'url')),
    name             TEXT NOT NULL,
    mime             TEXT NOT NULL DEFAULT '',
    size_bytes       INTEGER NOT NULL DEFAULT 0,
    sha256           TEXT NOT NULL DEFAULT '',
    url              TEXT,
    status           TEXT NOT NULL DEFAULT 'pending'
                     CHECK (status IN ('pending', 'processing', 'ready', 'error')),
    error            TEXT,
    chunk_count      INTEGER NOT NULL DEFAULT 0,
    char_count       INTEGER NOT NULL DEFAULT 0,
    embed_model      TEXT,
    version          INTEGER NOT NULL DEFAULT 1,
    fetched_at       TEXT,
    created_at       TEXT NOT NULL,
    updated_at       TEXT NOT NULL,
    CHECK (
        (scope = 'global' AND project_id IS NULL AND conversation_id IS NULL) OR
        (scope = 'project' AND project_id IS NOT NULL AND conversation_id IS NULL) OR
        (scope = 'conversation' AND conversation_id IS NOT NULL)
    )
);
CREATE INDEX idx_documents_scope ON documents(scope, project_id, conversation_id);
CREATE INDEX idx_documents_sha ON documents(sha256);

-- Original do arquivo (ou cópia capturada de um link), apagado junto com o documento.
CREATE TABLE document_blobs (
    document_id  TEXT PRIMARY KEY REFERENCES documents(id) ON DELETE CASCADE,
    data         BYTEA NOT NULL
);

CREATE TABLE chunks (
    id           BIGSERIAL PRIMARY KEY,
    document_id  TEXT NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    ord          INTEGER NOT NULL,
    content      TEXT NOT NULL,
    location     TEXT NOT NULL DEFAULT '',
    embedding    BYTEA,
    embed_dim    INTEGER,
    tsv          TSVECTOR GENERATED ALWAYS AS (to_tsvector('portuguese', content)) STORED
);
CREATE INDEX idx_chunks_document ON chunks(document_id, ord);
CREATE INDEX idx_chunks_tsv ON chunks USING GIN (tsv);

-- Memórias explícitas, criadas e removidas pelo usuário (nunca automáticas)
CREATE TABLE memories (
    id          TEXT PRIMARY KEY,
    project_id  TEXT REFERENCES projects(id) ON DELETE CASCADE,
    content     TEXT NOT NULL,
    created_at  TEXT NOT NULL
);

CREATE TABLE settings (
    key    TEXT PRIMARY KEY,
    value  TEXT NOT NULL
);

-- Registro de operações relevantes (sem conteúdo de mensagens ou documentos).
CREATE TABLE activity_log (
    id          BIGSERIAL PRIMARY KEY,
    created_at  TEXT NOT NULL,
    project_id  TEXT REFERENCES projects(id) ON DELETE CASCADE,
    action      TEXT NOT NULL,
    detail      TEXT NOT NULL DEFAULT '{}'
);
CREATE INDEX idx_activity_project ON activity_log(project_id, created_at);
