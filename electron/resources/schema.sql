-- 메뉴
CREATE TABLE IF NOT EXISTS menus (
    `id` INTEGER PRIMARY KEY AUTOINCREMENT,
    `name` TEXT NOT NULL, -- 메뉴 이름
    `route` TEXT,  -- 메뉴 URL 또는 경로
    `is_active` BOOLEAN DEFAULT TRUE,  -- 메뉴 활성화 여부
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- 생성일
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- 수정일
    UNIQUE(`name`, `route`)
);

-- 배송자
CREATE TABLE IF NOT EXISTS senders (
    `id` INTEGER PRIMARY KEY AUTOINCREMENT,
    `company_name` TEXT NOT NULL,
    `company_phone` TEXT,
    `company_zipcode` TEXT,
    `company_address` TEXT,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- 생성일
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- 수정일
    UNIQUE (`company_name`, `company_phone`, `company_zipcode`, `company_address`)
);

-- 주문
CREATE TABLE IF NOT EXISTS `orders` (
    `id` INTEGER PRIMARY KEY, -- 주문 ID
    `order_number` TEXT NOT NULL, -- 주문번호
    `status_id` INTEGER, -- 정의한 상태
    `receiver_name` TEXT, -- 수령인
    `receiver_zipcode` TEXT, -- 우편번호
    `receiver_address` TEXT, -- 배송지
    `receiver_detail_address` TEXT, -- 상세주소
    `receiver_phone` TEXT, -- 연락처
    `receiver_email` TEXT, -- 이메일
    `order_date` TIMESTAMP, -- 발주일
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- 생성일
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- 수정일
    UNIQUE (`order_number`)  -- 주문번호는 유일해야 함
);

-- 품목별 주문
CREATE TABLE IF NOT EXISTS `order_products` (
    `id` INTEGER PRIMARY KEY, -- 주문 ID
    `order_id` INTEGER NOT NULL, -- 주문 ID
    `product_unit_id` INTEGER, -- 제품 단위 ID
    `order_products_number` TEXT NOT NULL, -- 품목별 주문번호
    `quantity` INTEGER, -- 주문 수량
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- 생성일
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- 수정일
    UNIQUE (`order_id`, `order_products_number`) -- 주문 ID와 품목별 주문번호는 유일해야 함
    FOREIGN KEY (`order_id`) REFERENCES orders(id) ON DELETE CASCADE
);

-- 배송
CREATE TABLE IF NOT EXISTS `shipments` (
    `id` INTEGER PRIMARY KEY, -- 배송 ID
    `order_id` INTEGER NOT NULL, -- 주문 ID
    `order_products_id` INTEGER NOT NULL, -- 품목별 주문ID
    `tracking_number` TEXT NOT NULL, -- 운송장번호
    `status_id` INTEGER, -- 정의한 상태
    `start_date` TIMESTAMP, -- 배송 시작일
    `expected_date` TIMESTAMP, -- 배송 예상 도착일
    `elapsed_days` INTEGER, -- 배송 경과일
    `shipped_at` TIMESTAMP, -- 배송 완료일
    `receiver_name` TEXT, -- 수령인
    `receiver_zipcode` TEXT, -- 우편번호
    `receiver_address` TEXT, -- 배송지
    `receiver_detail_address` TEXT, -- 상세주소
    `receiver_phone` TEXT, -- 연락처
    `receiver_email` TEXT, -- 이메일
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- 생성일
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- 수정일
    UNIQUE (`tracking_number`, `order_id`, `order_products_id`)  -- 송장번호는 유일해야 함
    FOREIGN KEY (`order_id`) REFERENCES orders(id) ON DELETE CASCADE
);

-- 창고
CREATE TABLE IF NOT EXISTS `warehouses` (
    `id` INTEGER PRIMARY KEY, -- 창고 ID
    `name` TEXT NOT NULL, -- 창고명
    `address` TEXT, -- 창고 위치
    `contact` TEXT, -- 연락처등 추가로 필요한 것
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- 생성일
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- 수정일
    UNIQUE(`name`, `address`)
);

-- 재고
CREATE TABLE IF NOT EXISTS `inventory` (
    `id` INTEGER PRIMARY KEY, -- 재고 ID
    `product_unit_id` INTEGER NOT NULL, -- 제품 단위 ID
    `warehouse_id` INTEGER, -- 창고 ID
    `order_id` INTEGER NULL, -- 주문 ID (없을 경우 NULL)
    `status_id` INTEGER, -- 정의한 상태
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- 생성일
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- 수정일
    FOREIGN KEY (`order_id`) REFERENCES orders(id) ON DELETE CASCADE
);

-- 상품
CREATE TABLE IF NOT EXISTS `products` (
    `id` INTEGER PRIMARY KEY, -- 제품 ID
    `name` TEXT, -- 제품명
    `description` TEXT, -- 제품 설명
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- 생성일
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- 수정일
    UNIQUE(`name`)
);

-- 상품 필드
CREATE TABLE IF NOT EXISTS `product_options` (
    `id` INTEGER PRIMARY KEY, -- 옵션 ID
    `product_id` INTEGER, -- 제품 ID
    `name` TEXT, -- 옵션명
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- 생성일
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- 수정일
    UNIQUE (`product_id`, `name`)  -- 같은 제품에서 같은 옵션 이름이 중복되지 않도록 설정
);

-- 상품 정보
CREATE TABLE IF NOT EXISTS `product_option_values` (
    `id` INTEGER PRIMARY KEY, -- 옵션 값 ID
    `product_option_id` INTEGER, -- 옵션 ID
    `value` TEXT, -- 옵션 값
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- 생성일
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- 수정일
    UNIQUE (`product_option_id`, `value`)  -- 같은 옵션 조합이 중복되지 않도록 설정
);

-- 상품 단위
CREATE TABLE IF NOT EXISTS `product_units` (
    `id` INTEGER PRIMARY KEY, -- 제품 단위 ID
    `product_id` INTEGER, -- 제품 ID
    `option_value_ids` TEXT, -- 옵션 값 ID 목록 (쉼표로 구분된 값)
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- 생성일
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- 수정일
    UNIQUE(`product_id`, `option_value_ids`) -- 동일한 옵션이 생성되지 않도록
);

-- 공급자
CREATE TABLE IF NOT EXISTS suppliers (
    `id` INTEGER PRIMARY KEY AUTOINCREMENT,
    `product_name` TEXT NOT NULL,  -- 발주할 상품명
    `product_url` TEXT,            -- 상품 구매 URL (선택)
    `supplier_name` TEXT,          -- 공급업체명 (예: 쿠팡, 알리익스프레스 등)
    `supplier_contact` TEXT,       -- 공급업체 연락처 (선택)
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP, --생성일
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- 수정일
    UNIQUE (`product_name`, `supplier_name`)  -- 같은 상품이 같은 공급업체에서 중복되지 않도록 설정
);

-- 발주
CREATE TABLE IF NOT EXISTS `purchase_orders` (
    `id` INTEGER PRIMARY KEY, -- 발주 ID
    `product_unit_id` INTEGER, -- 제품 단위 ID
    `supplier_id` INTEGER, -- 공급자 ID
    `quantity` INTEGER, -- 발주 수량
    `status_id` INTEGER, -- 정의한 상태
    `start_date` TIMESTAMP, -- 발주 시작일
    `expected_date` TIMESTAMP, -- 발주 예상 도착일
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- 생성일
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- 수정일
    UNIQUE (`product_unit_id`, `supplier_id`)  -- 동일한 제품이 같은 공급자에게 중복 발주되지 않도록 설정
);

-- 규칙
CREATE TABLE IF NOT EXISTS `rules` (
    `id` INTEGER PRIMARY KEY, -- 규칙 ID
    `name` TEXT, -- 규칙명
    `description` TEXT, -- 규칙 설명
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- 생성일
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- 수정일
    UNIQUE (`name`)  -- 규칙명은 유일해야 함
);

-- 규칙 조건
CREATE TABLE IF NOT EXISTS `rule_conditions` (
    `id` INTEGER PRIMARY KEY, -- 규칙 조건 ID
    `rule_id` INTEGER, -- 규칙 ID (연결)
    `entity` TEXT, -- 적용 대상 ('orders', 'inventory', 'shipments')
    `field` TEXT, -- 조건을 확인할 필드명
    `field_type` TEXT, -- 조건을 확인할 필드 타입
    `value` TEXT, -- 조건 값
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- 생성일
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- 수정일
    UNIQUE (`rule_id`, `entity`, `field`, `value`)  -- 같은 규칙에서 동일한 조건이 중복되지 않도록 설정
);

-- 규칙 실행
CREATE TABLE IF NOT EXISTS `rule_actions` (
    `id` INTEGER PRIMARY KEY, -- 규칙 실행 ID
    `rule_id` INTEGER, -- 규칙 ID (연결)
    `entity` TEXT, -- 적용 대상 ('orders', 'inventory', 'shipments')
    `field` TEXT, -- 변경할 필드명
    `field_type` TEXT, -- 변경할 필드 타입
    `new_value` TEXT, -- 변경할 값
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- 생성일
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- 수정일
    UNIQUE (`rule_id`, `entity`, `field`, `new_value`)  -- 같은 규칙에서 동일한 액션이 중복되지 않도록 설정
);

-- 주문 이력
CREATE TABLE IF NOT EXISTS `order_history` (
    `id` INTEGER PRIMARY KEY, -- 이력 ID
    `order_id` INTEGER, -- 주문 ID
    `previous_state` TEXT, -- 이전 상태
    `new_state` TEXT, -- 변경된 상태
    `changed_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- 변경일
);

-- 재고 이력
CREATE TABLE IF NOT EXISTS `inventory_history` (
    `id` INTEGER PRIMARY KEY, -- 이력 ID
    `inventory_id` INTEGER, -- 재고 ID
    `order_id` INTEGER NULL, -- 주문 ID (없을 경우 NULL)
    `previous_state` TEXT, -- 이전 상태
    `new_state` TEXT, -- 변경된 상태
    `changed_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- 변경일
);

-- 배송 이력
CREATE TABLE IF NOT EXISTS `shipment_history` (
    `id` INTEGER PRIMARY KEY, -- 이력 ID
    `shipment_id` INTEGER, -- 배송 ID
    `previous_state` TEXT, -- 이전 상태
    `new_state` TEXT, -- 변경된 상태
    `changed_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- 변경일
);

-- 발주 이력
CREATE TABLE IF NOT EXISTS `purchase_order_history` (
    `id` INTEGER PRIMARY KEY, -- 이력 ID
    `purchase_order_id` INTEGER, -- 발주 ID
    `previous_state` TEXT, -- 이전 상태
    `new_state` TEXT, -- 변경된 상태
    `changed_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- 변경일
);

-- 단계 - 상태
CREATE TABLE IF NOT EXISTS step_status (
    `id` INTEGER PRIMARY KEY AUTOINCREMENT,
    `step_type` TEXT NOT NULL,  -- 'order', 'inventory', 'shipment' 구분
    `status_name` TEXT NOT NULL,       -- 상태 이름 ('결제 완료', '배송 중', '입고 대기' 등)
    `description` TEXT,         -- 상태 설명 (선택)
    UNIQUE (`step_type`, `status_name`)  -- 같은 step_type에서 동일한 상태 이름이 중복되지 않도록 설정
);
