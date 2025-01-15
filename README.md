# 재고 관리 시스템

bbs같은 유연한 필드 구조를 가질 수 있는 재고 관리 시스템 프로젝트

## 개발환경 
- frontend: typescript/react/vite
- database: sqlite
- export/import: excel
- desktop: electron

## 테이블
- platforms
  - 전자상거래 플랫폼 연동 정보를 담는 테이블, 메뉴 역할도 겸함.
- targets 
  - 대상에 대한 정보를 담는 테이블로 대상이란 상태를 가질 수 있는 주체를 말한다.
- target_status
  - 대상의 상태를 담는 테이블
- products
  - 제품 정보의 메인 테이블
- product_fields
  - 제품 정보에 대한 필드를 동적으로 정의하기 위한 테이블
- product_field_values
  - 제품 정보 필드를 정의한 값을 저장하는 테이블
- rules
  - 제품의 상태에 따라 적용되는 규칙을 정의하는 메인 테이블
- rule_conditions
  - 규칙의 조건을 정의하는 테이블 , 중첩 가능-> 동적 sql 생성에서 where 조건을 담당.
- rule_actions
  - 규칙의 실행을 정의하는 테이블 -> 동적 sql 생성에서 DML을 담당.
- product_field_values_history
  - 제품 정보에 대한 필드의 값의 변경 이력을 저장하는 테이블
- rule_history
  - 규칙의 변경 이력을 저장하는 테이블
- rule_condition_history
  - 규칙의 조건의 변경 이력을 저장하는 테이블
- rule_action_history
  - 규칙의 실행의 변경 이력을 저장하는 테이블
- error_logs
  - 개발자에게 보내기 위한 에러 로그를 쌓는 테이블.