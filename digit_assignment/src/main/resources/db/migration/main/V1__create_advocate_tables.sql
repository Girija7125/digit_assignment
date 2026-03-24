CREATE TABLE IF NOT EXISTS eg_advocate (
    id                      VARCHAR(64)  NOT NULL,
    tenant_id               VARCHAR(64)  NOT NULL,
    application_number      VARCHAR(64),
    individual_id           VARCHAR(64),
    bar_registration_number VARCHAR(128),
    advocate_id             VARCHAR(64),
    user_type               VARCHAR(64)  NOT NULL,
    mobile_number           VARCHAR(20)  NOT NULL,
    is_active               BOOLEAN      DEFAULT TRUE,
    status                  VARCHAR(64),
    created_by              VARCHAR(64),
    last_modified_by        VARCHAR(64),
    created_time            BIGINT,
    last_modified_time      BIGINT,
    CONSTRAINT pk_eg_advocate PRIMARY KEY (id),
    CONSTRAINT uq_advocate_mobile UNIQUE (mobile_number)
);

CREATE TABLE IF NOT EXISTS eg_advocate_document (
    id              VARCHAR(64)  NOT NULL,
    advocate_id     VARCHAR(64)  NOT NULL,
    document_type   VARCHAR(64),
    file_store_id   VARCHAR(256),
    document_uid    VARCHAR(64),
    is_active       BOOLEAN DEFAULT TRUE,
    CONSTRAINT pk_eg_advocate_document PRIMARY KEY (id),
    CONSTRAINT fk_advocate_document FOREIGN KEY (advocate_id) REFERENCES eg_advocate(id)
);

CREATE INDEX IF NOT EXISTS idx_advocate_tenant  ON eg_advocate(tenant_id);
CREATE INDEX IF NOT EXISTS idx_advocate_mobile  ON eg_advocate(mobile_number);
CREATE INDEX IF NOT EXISTS idx_advocate_status  ON eg_advocate(status);
CREATE INDEX IF NOT EXISTS idx_advocate_appnum  ON eg_advocate(application_number);
