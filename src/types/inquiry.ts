// 질문 타입 열거형
export enum QuestionType {
  TEXT = 'TEXT',
  TEXTAREA = 'TEXTAREA',
  SELECT = 'SELECT',
  RADIO = 'RADIO',
  CHECKBOX = 'CHECKBOX',
  DATE = 'DATE',
  FILE = 'FILE',
  EMAIL = 'EMAIL',
  PHONE = 'PHONE',
  NUMBER = 'NUMBER',
  REGION = 'REGION',
}

// 질문 인터페이스
export interface Question {
  id: number;
  label: string;
  type: QuestionType;
  isRequired: boolean;
  questionOrder: number;
  options?: string[] | null;
}

// 템플릿 인터페이스
export interface InquiryTemplate {
  description: string;
  name: string;
  questions: Question[];
}

// 문의 답변 타입
export interface InquiryAnswer {
  questionId: number;
  answerText: string;
}

// 폼 상태 인터페이스
export interface FormState {
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
}

// 문의 등록 요청 타입
export interface CreateInquiryRequest {
  templateToken: string; // 템플릿 공유 토큰
  phone: string; // 고객 전화번호
  answers: InquiryAnswer[]; // 질문에 대한 답변 목록
}

// 문의 등록 성공 응답 타입
export interface CreateInquirySuccessResponse {
  inquiryId: number;
  message: string;
}

export interface ErrorResponse {
  success: false;
  message: string;
  code: string;
  errors?: FieldError[];
}

export interface FieldError {
  field: string;
  message: string;
}

// Union 타입 (응답 처리 시 사용)
export type CreateInquiryResponse = CreateInquirySuccessResponse | ErrorResponse;

// 문의 목록 아이템 타입 (InquiryListItemResDto)
export interface InquiryListItem {
  inquiryId: number;
  customerType: CustomerType;
  name: string;
  email: string;
  contact: string;
  createdAt: string;
}

// 고객 유형 열거형
export enum CustomerType {
  CUSTOMER = 'CUSTOMER',
  CUSTOMER_CANDIDATE = 'CUSTOMER_CANDIDATE',
}

// 문의 상세 정보 타입 (InquiryDetailResDto)
export interface InquiryDetail {
  inquiryId: number;
  customerName: string;
  customerEmail: string;
  customerContact: string;
  createdAt: string;
  answers: AnswerDto[];
}

// 답변 DTO 타입
export interface AnswerDto {
  questionId: number;
  questionType: QuestionType;
  questionContent: string;
  answer: string;
}

// 문의 목록 응답 타입
export interface InquiryListResponse {
  content: InquiryListItem[];
  pagination: PaginationInfo;
}

// 페이지네이션 정보 타입
export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalElements: number;
  size: number;
}

// 문의 검색 필터 타입
export interface InquiryFilter {
  keyword?: string;
  sortBy?: 'createdAt';
  sortDirection?: 'asc' | 'desc';
  page: number;
  size: number;
}
