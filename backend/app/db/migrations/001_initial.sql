-- S.A.I.T.E. — esquema inicial (SQLite)
-- Fonte da verdade relacional. O índice lexical (FTS5) é mantido por gatilhos
-- e os embeddings ficam na própria tabela de chunks.

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

CREATE TABLE messages (
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
CREATE INDEX idx_messages_conversation ON messages(conversation_id, created_at);

-- scope: global (todas as conversas), project (só o projeto), conversation (só a conversa)
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
    stored_path      TEXT,
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

CREATE TABLE chunks (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    document_id  TEXT NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    ord          INTEGER NOT NULL,
    content      TEXT NOT NULL,
    location     TEXT NOT NULL DEFAULT '',
    embedding    BLOB,
    embed_dim    INTEGER
);
CREATE INDEX idx_chunks_document ON chunks(document_id, ord);

CREATE VIRTUAL TABLE chunks_fts USING fts5(
    content,
    content = 'chunks',
    content_rowid = 'id',
    tokenize = 'unicode61 remove_diacritics 2'
);

CREATE TRIGGER chunks_ai AFTER INSERT ON chunks BEGIN
    INSERT INTO chunks_fts(rowid, content) VALUES (new.id, new.content);
END;
CREATE TRIGGER chunks_ad AFTER DELETE ON chunks BEGIN
    INSERT INTO chunks_fts(chunks_fts, rowid, content) VALUES ('delete', old.id, old.content);
END;
CREATE TRIGGER chunks_au AFTER UPDATE OF content ON chunks BEGIN
    INSERT INTO chunks_fts(chunks_fts, rowid, content) VALUES ('delete', old.id, old.content);
    INSERT INTO chunks_fts(rowid, content) VALUES (new.id, new.content);
END;

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

-- Registro de operações relevantes (ferramentas, exclusões, importações).
-- Não guarda conteúdo de mensagens ou documentos.
CREATE TABLE activity_log (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    created_at  TEXT NOT NULL,
    project_id  TEXT REFERENCES projects(id) ON DELETE CASCADE,
    action      TEXT NOT NULL,
    detail      TEXT NOT NULL DEFAULT '{}'
);
CREATE INDEX idx_activity_project ON activity_log(project_id, created_at);
