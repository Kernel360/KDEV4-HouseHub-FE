import type { CreateCustomerResDto } from './customer';
import type { ContractResDto } from './contract';
import type { PaginationDto } from './pagination';

// 매물 유형 enum
export enum PropertyType {
  APARTMENT = 'APARTMENT',
  VILLA = 'VILLA',
  OFFICETEL = 'OFFICETEL',
  COMMERCIAL = 'COMMERCIAL',
  ONE_ROOM = 'ONE_ROOM',
  TWO_ROOM = 'TWO_ROOM',
}

// 매물 유형 표시 텍스트
export const PropertyTypeLabels: Record<PropertyType, string> = {
  [PropertyType.APARTMENT]: '아파트',
  [PropertyType.VILLA]: '빌라',
  [PropertyType.OFFICETEL]: '오피스텔',
  [PropertyType.COMMERCIAL]: '상가',
  [PropertyType.ONE_ROOM]: '원룸',
  [PropertyType.TWO_ROOM]: '투룸',
};

// 매물 유형별 배경색 및 텍스트 색상
export const PropertyTypeColors: Record<PropertyType, { bg: string; text: string }> = {
  [PropertyType.APARTMENT]: { bg: 'bg-blue-100', text: 'text-blue-800' },
  [PropertyType.VILLA]: { bg: 'bg-green-100', text: 'text-green-800' },
  [PropertyType.OFFICETEL]: { bg: 'bg-purple-100', text: 'text-purple-800' },
  [PropertyType.COMMERCIAL]: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
  [PropertyType.ONE_ROOM]: { bg: 'bg-pink-100', text: 'text-pink-800' },
  [PropertyType.TWO_ROOM]: { bg: 'bg-indigo-100', text: 'text-indigo-800' },
};

// 매물 등록 DTO
export interface PropertyRegistrationDTO {
  customerId: number;
  propertyType: PropertyType;
  memo?: string;
  roadAddress: string;
  jibunAddress: string;
  detailAddress: string;
}

// 매물 목록 응답 DTO
export interface FindPropertyResDto {
  id: number;
  propertyType: PropertyType;
  detailAddress: string;
  roadAddress: string;
  jibunAddress: string;
  active: boolean;
}

// 매물 목록 응답 LIST DTO
export interface PropertyListResDto {
  content: FindPropertyResDto[];
  pagination: PaginationDto;
}

// 매물 검색 필터 인터페이스를 백엔드 PropertySearchDto와 일치하도록 수정
export interface PropertySearchFilter {
  province?: string; // 도, 특별시, 광역시
  city?: string; // 시/군/구
  dong?: string; // 읍/면/동
  propertyType: PropertyType | null; // 매물 유형 (아파트, 오피스텔 등)
  agentName?: string; // 공인중개사 이름
  customerName?: string; // 고객 이름
  active?: boolean; // 계약 가능 여부
  page: number;
  size: number;
}

// 매물 상세 정보 응답 DTO
export interface FindPropertyDetailResDto {
  id: number;
  propertyType: PropertyType;
  customer: CreateCustomerResDto;
  memo?: string;
  province: string;
  city: string;
  dong: string;
  detailAddress: string;
  roadAddress: string;
  jibunAddress: string;
  createdAt: string;
  updatedAt: string;
  latitude?: number;
  longitude?: number;
  contractList: ContractResDto[];
  active: boolean;
}
