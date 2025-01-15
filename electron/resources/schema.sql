-- platforms 테이블: 전자상거래 플랫폼 연동 정보를 담는 테이블, 메뉴 역할도 겸함.
CREATE TABLE IF NOT EXISTS platforms (
    id INTEGER PRIMARY KEY,               -- 플랫폼 고유 식별자
    name TEXT NOT NULL,                   -- 플랫폼 이름
    api_url TEXT,                         -- 플랫폼 API 연동 URL
    api_key TEXT,                         -- 플랫폼 API 연동 키
    path TEXT NOT NULL,                   -- 메뉴 경로 (라우팅 용)
    icon TEXT,                            -- 메뉴 아이콘
    sort_order INTEGER DEFAULT 0,         -- 메뉴 정렬 순서
    is_active INTEGER DEFAULT 1,          -- 메뉴 활성화 여부
    created_at TEXT DEFAULT (datetime('now')),  -- 생성일시
    updated_at TEXT DEFAULT (datetime('now')),  -- 수정일시
);

-- targets 테이블: 대상
CREATE TABLE IF NOT EXISTS targets (
    id INTEGER PRIMARY KEY,               -- 대상 그룹 고유 식별자
    code TEXT NOT NULL UNIQUE,            -- 그룹 코드 (예: DELIVERY, PAYMENT)
    name TEXT NOT NULL,                   -- 그룹 이름 (예: 배송, 결제)
    description TEXT,                     -- 그룹 설명
    sort_order INTEGER DEFAULT 0,         -- 정렬 순서
    is_active INTEGER DEFAULT 1,          -- 활성화 여부
    created_at TEXT DEFAULT (datetime('now')),  -- 생성일시
    updated_at TEXT DEFAULT (datetime('now'))   -- 수정일시
);

-- target_status 테이블: 대상 상태 코드 관리
CREATE TABLE IF NOT EXISTS target_status (
    id INTEGER PRIMARY KEY,               -- 상태 코드 고유 식별자
    target_id INTEGER NOT NULL,           -- 대상 ID
    code TEXT NOT NULL UNIQUE,            -- 상태 코드 (예: DELIVERING, DELIVERED)
    name TEXT NOT NULL,                   -- 상태 이름 (예: 배송중, 배송완료)
    description TEXT,                     -- 상태 설명
    sort_order INTEGER DEFAULT 0,         -- 정렬 순서
    is_active INTEGER DEFAULT 1,          -- 활성화 여부
    created_at TEXT DEFAULT (datetime('now')),  -- 생성일시
    updated_at TEXT DEFAULT (datetime('now')),  -- 수정일시
    FOREIGN KEY (target_id) REFERENCES targets(id)
);

-- products 테이블: 제품 기본 정보
CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY,               -- 제품 고유 식별자
    platform_id INTEGER NOT NULL,         -- 플랫폼 ID
    code TEXT NOT NULL UNIQUE,            -- 제품 코드 (고유값)
    name TEXT NOT NULL,                   -- 제품 이름
    status_code_id INTEGER NOT NULL,      -- 제품 상태 코드
    created_at TEXT DEFAULT (datetime('now')),  -- 생성일시
    updated_at TEXT DEFAULT (datetime('now')),  -- 수정일시
    FOREIGN KEY (status_code_id) REFERENCES target_status(id),
    FOREIGN KEY (platform_id) REFERENCES platforms(id)
);

-- product_fields 테이블: 제품의 동적 필드 정의
CREATE TABLE IF NOT EXISTS product_fields (
    id INTEGER PRIMARY KEY,               -- 필드 고유 식별자
    product_id INTEGER NOT NULL,          -- 제품 ID
    name TEXT NOT NULL,                   -- 필드 시스템 이름
    label TEXT NOT NULL,                  -- 필드 표시 이름
    field_type TEXT NOT NULL,             -- 필드 타입 (text, number, select 등)
    is_required INTEGER DEFAULT 0,        -- 필수 입력 여부
    default_value TEXT,                   -- 기본값
    options TEXT,                         -- select 타입의 옵션 (JSON 형식)
    sort_order INTEGER DEFAULT 0,         -- 정렬 순서
    is_active INTEGER DEFAULT 1,          -- 활성화 여부
    created_at TEXT DEFAULT (datetime('now')),  -- 생성일시
    updated_at TEXT DEFAULT (datetime('now')),  -- 수정일시
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- product_field_values 테이블: 제품별 필드 값 저장
CREATE TABLE IF NOT EXISTS product_field_values (
    id INTEGER PRIMARY KEY,               -- 값 고유 식별자
    product_id INTEGER NOT NULL,          -- 제품 ID
    field_id INTEGER NOT NULL,            -- 필드 ID
    value TEXT,                           -- 필드 값
    created_at TEXT DEFAULT (datetime('now')),  -- 생성일시
    updated_at TEXT DEFAULT (datetime('now')),  -- 수정일시
    FOREIGN KEY (product_id) REFERENCES products(id),
    FOREIGN KEY (field_id) REFERENCES product_fields(id)
);

-- rules 테이블: 사용자 정의 규칙
CREATE TABLE IF NOT EXISTS rules (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,                   -- 규칙 이름
    description TEXT,                     -- 규칙 설명
    is_active INTEGER DEFAULT 1,          -- 규칙 활성화 여부
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);

-- rule_conditions 테이블: 규칙 적용을 위한 WHERE 조건
CREATE TABLE IF NOT EXISTS rule_conditions (
    id INTEGER PRIMARY KEY,
    rule_id INTEGER NOT NULL,            -- 규칙 ID
    parent_condition_id INTEGER,         -- 상위 조건 ID (중첩 조건용)
    target_id INTEGER NOT NULL,          -- 대상 ID
    target_status_id INTEGER NOT NULL,   -- 체크할 대상 상태 ID
    operator TEXT NOT NULL,              -- 조건 연산자 (AND, OR, NOT)
    sort_order INTEGER DEFAULT 0,        -- 조건 실행 순서
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (rule_id) REFERENCES rules(id),
    FOREIGN KEY (parent_condition_id) REFERENCES rule_conditions(id),
    FOREIGN KEY (target_id) REFERENCES targets(id),
    FOREIGN KEY (target_status_id) REFERENCES target_statuses(id),
    CONSTRAINT fk_target_status CHECK (
        target_status_id IN (
            SELECT id FROM target_statuses WHERE target_id = target_id
        )
    )
);

-- rule_actions 테이블: conditions 만족 시 상태 변경 정보
CREATE TABLE IF NOT EXISTS rule_actions (
    id INTEGER PRIMARY KEY,
    rule_id INTEGER NOT NULL,
    target_id INTEGER NOT NULL,          -- 대상 ID
    target_status_id INTEGER NOT NULL,   -- 변경할 대상 상태
    sort_order INTEGER DEFAULT 0,        -- 액션 실행 순서
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (rule_id) REFERENCES rules(id),
    FOREIGN KEY (target_id) REFERENCES targets(id),
    FOREIGN KEY (target_status_id) REFERENCES target_statuses(id),
    CONSTRAINT fk_target_status CHECK (
        target_status_id IN (
            SELECT id FROM target_statuses WHERE target_id = target_id
        )
    )
);

-- product_history 테이블: 제품 필드 값 변경 이력
CREATE TABLE IF NOT EXISTS product_history (
    id INTEGER PRIMARY KEY,               -- 이력 고유 식별자
    product_id INTEGER NOT NULL,          -- 제품 ID
    field_id INTEGER NOT NULL,            -- 필드 ID
    old_value TEXT,                       -- 변경 전 값
    new_value TEXT,                       -- 변경 후 값
    created_at TEXT DEFAULT (datetime('now')),  -- 변경일시
);

-- rule_history 테이블: 규칙 기본 정보 변경 이력
CREATE TABLE IF NOT EXISTS rule_history (
    id INTEGER PRIMARY KEY,
    rule_id INTEGER NOT NULL,            -- 규칙 ID
    field_name TEXT NOT NULL,            -- 변경된 필드명 (name, description, is_active)
    old_value TEXT,                      -- 변경 전 값
    new_value TEXT,                      -- 변경 후 값
    created_at TEXT DEFAULT (datetime('now')),  -- 변경일시
);

-- rule_condition_history 테이블: 규칙 조건 변경 이력
CREATE TABLE IF NOT EXISTS rule_condition_history (
    id INTEGER PRIMARY KEY,
    rule_id INTEGER NOT NULL,            -- 규칙 ID
    condition_id INTEGER NOT NULL,       -- 조건 ID
    target_id INTEGER NOT NULL,          -- 대상 ID
    field_name TEXT NOT NULL,            -- 변경된 필드명 (target_status_id, operator 등)
    old_value TEXT,                      -- 변경 전 값
    new_value TEXT,                      -- 변경 후 값
    created_at TEXT DEFAULT (datetime('now')),  -- 변경일시
);

-- rule_action_history 테이블: 규칙 액션 변경 이력
CREATE TABLE IF NOT EXISTS rule_action_history (
    id INTEGER PRIMARY KEY,
    rule_id INTEGER NOT NULL,            -- 규칙 ID
    action_id INTEGER NOT NULL,          -- 액션 ID
    target_id INTEGER NOT NULL,          -- 대상 ID
    field_name TEXT NOT NULL,            -- 변경된 필드명 (target_status_id 등)
    old_value TEXT,                      -- 변경 전 값
    new_value TEXT,                      -- 변경 후 값
    created_at TEXT DEFAULT (datetime('now')),  -- 변경일시
);

-- error_logs 테이블: 시스템 에러 로그
CREATE TABLE IF NOT EXISTS error_logs (
    id INTEGER PRIMARY KEY,               -- 로그 고유 식별자
    error_type TEXT NOT NULL,             -- 에러 유형
    error_message TEXT NOT NULL,          -- 에러 메시지
    stack_trace TEXT,                     -- 스택 트레이스
    additional_info TEXT,                 -- 추가 정보 (JSON 형식)
    created_at TEXT DEFAULT (datetime('now'))   -- 에러 발생일시
);