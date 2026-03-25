# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# Sync-Up 프로젝트 규칙

## 기술 스택

- Next.js 14 (App Router), Tailwind CSS, lucide-react
- 외부 API/DB 사용 가능하지만 별도 키 없이 접근 가능해야 함

## 데이터 원칙

- /data 폴더의 JSON 파일이 정식 데이터 소스
- 필드명·구조는 이 파일 기준을 따를 것
- 필요하다면 더미 데이터를 새 만들거나 수정해도 됨

## 코드 컨벤션

- 컴포넌트: PascalCase, 파일명도 동일
- 훅: use 접두사, /hooks 폴더
- 타입: /types/index.ts에 통합 관리
- 한국어 UI 텍스트 사용

## 상태 UI 필수

- 모든 데이터 로딩 구간에 Loading / Empty / Error UI 구현

## 절대 하지 말 것

- console.log 남기기
- any 타입 사용
- 하드코딩된 색상 (Tailwind 클래스 사용)

## Git 규칙

- 기능 구현 완료 시마다 반드시 git add . && git commit && git push 실행
- 커밋 메시지 형식: feat: [구현 내용] (예: feat: 해커톤 목록 페이지 구현)
- 페이지 단위로 커밋 (컴포넌트 하나하나 말고 페이지 완성 시점에)
