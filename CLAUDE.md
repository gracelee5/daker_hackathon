# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# Sync-Up 프로젝트 규칙

## 기술 스택
- Next.js 14 (App Router), Tailwind CSS, lucide-react
- 외부 API/DB 사용 금지, localStorage만 사용

## 데이터 원칙
- /data 폴더의 JSON 파일이 정식 데이터 소스
- 필드명·구조는 이 파일 기준을 따를 것
- 임의로 더미데이터를 새로 만들지 말 것

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
