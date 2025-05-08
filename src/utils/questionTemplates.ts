import { v4 as uuidv4 } from 'uuid';
import type { Question, QuestionType } from '../types/inquiryTemplate';

// 유형별 기본 질문 생성 함수
export const generateTypeBasedQuestions = (
  propertyType: string,
  transactionPurpose: string
): Question[] => {
  // 공통 질문
  const commonQuestions: Question[] = [
    {
      id: uuidv4(),
      label: '연락처',
      type: 'PHONE' as QuestionType,
      isRequired: true,
      questionOrder: 1,
    },
    {
      id: uuidv4(),
      label: '마케팅 수신 동의 여부',
      type: 'CHECKBOX' as QuestionType,
      isRequired: true,
      questionOrder: 2,
      options: ['동의합니다'],
    },
    {
      id: uuidv4(),
      label: '연락 가능 시간',
      type: 'SELECT' as QuestionType,
      isRequired: true,
      questionOrder: 3,
      options: ['오전 9시-12시', '오후 12시-3시', '오후 3시-6시', '저녁 6시-9시'],
    },
  ];

  // 유형별 특화 질문
  const typeSpecificQuestions: Record<string, Question[]> = {
    // 아파트 관련 질문
    아파트_매수: [
      {
        id: uuidv4(),
        label: '희망 지역',
        type: 'TEXT' as QuestionType,
        isRequired: true,
        questionOrder: 3,
      },
      {
        id: uuidv4(),
        label: '예산',
        type: 'SELECT' as QuestionType,
        isRequired: true,
        questionOrder: 4,
        options: ['1억 이하', '1억-3억', '3억-5억', '5억-10억', '10억 이상'],
      },
      {
        id: uuidv4(),
        label: '희망 평수',
        type: 'SELECT' as QuestionType,
        isRequired: true,
        questionOrder: 5,
        options: ['10평 이하', '10평-20평', '20평-30평', '30평-40평', '40평 이상'],
      },
    ],
    아파트_매도: [
      {
        id: uuidv4(),
        label: '매물 주소',
        type: 'TEXT' as QuestionType,
        isRequired: true,
        questionOrder: 3,
      },
      {
        id: uuidv4(),
        label: '매물 평수',
        type: 'TEXT' as QuestionType,
        isRequired: true,
        questionOrder: 4,
      },
      {
        id: uuidv4(),
        label: '희망 매도가',
        type: 'TEXT' as QuestionType,
        isRequired: true,
        questionOrder: 5,
      },
    ],
    아파트_임대: [
      {
        id: uuidv4(),
        label: '매물 주소',
        type: 'TEXT' as QuestionType,
        isRequired: true,
        questionOrder: 3,
      },
      {
        id: uuidv4(),
        label: '임대 유형',
        type: 'SELECT' as QuestionType,
        isRequired: true,
        questionOrder: 4,
        options: ['전세', '월세'],
      },
      {
        id: uuidv4(),
        label: '희망 임대료',
        type: 'TEXT' as QuestionType,
        isRequired: true,
        questionOrder: 5,
      },
    ],
    아파트_임차: [
      {
        id: uuidv4(),
        label: '희망 지역',
        type: 'TEXT' as QuestionType,
        isRequired: true,
        questionOrder: 3,
      },
      {
        id: uuidv4(),
        label: '임차 유형',
        type: 'SELECT' as QuestionType,
        isRequired: true,
        questionOrder: 4,
        options: ['전세', '월세'],
      },
      {
        id: uuidv4(),
        label: '예산',
        type: 'SELECT' as QuestionType,
        isRequired: true,
        questionOrder: 5,
        options: ['5천만원 이하', '5천만원-1억', '1억-2억', '2억-3억', '3억 이상'],
      },
    ],

    // 오피스텔 관련 질문
    오피스텔_매수: [
      {
        id: uuidv4(),
        label: '희망 지역',
        type: 'TEXT' as QuestionType,
        isRequired: true,
        questionOrder: 3,
      },
      {
        id: uuidv4(),
        label: '예산',
        type: 'SELECT' as QuestionType,
        isRequired: true,
        questionOrder: 4,
        options: ['5천만원 이하', '5천만원-1억', '1억-2억', '2억-3억', '3억 이상'],
      },
      {
        id: uuidv4(),
        label: '용도',
        type: 'SELECT' as QuestionType,
        isRequired: true,
        questionOrder: 5,
        options: ['주거용', '사업용', '투자용'],
      },
    ],
    오피스텔_매도: [
      {
        id: uuidv4(),
        label: '매물 주소',
        type: 'TEXT' as QuestionType,
        isRequired: true,
        questionOrder: 3,
      },
      {
        id: uuidv4(),
        label: '매물 평수',
        type: 'NUMBER' as QuestionType,
        isRequired: true,
        questionOrder: 4,
      },
      {
        id: uuidv4(),
        label: '희망 매도가',
        type: 'NUMBER' as QuestionType,
        isRequired: true,
        questionOrder: 5,
      },
    ],
    오피스텔_임대: [
      {
        id: uuidv4(),
        label: '매물 주소',
        type: 'TEXT' as QuestionType,
        isRequired: true,
        questionOrder: 3,
      },
      {
        id: uuidv4(),
        label: '임대 유형',
        type: 'SELECT' as QuestionType,
        isRequired: true,
        questionOrder: 4,
        options: ['전세', '월세'],
      },
      {
        id: uuidv4(),
        label: '희망 임대료',
        type: 'NUMBER' as QuestionType,
        isRequired: true,
        questionOrder: 5,
      },
    ],
    오피스텔_임차: [
      {
        id: uuidv4(),
        label: '희망 지역',
        type: 'TEXT' as QuestionType,
        isRequired: true,
        questionOrder: 3,
      },
      {
        id: uuidv4(),
        label: '임차 유형',
        type: 'SELECT' as QuestionType,
        isRequired: true,
        questionOrder: 4,
        options: ['전세', '월세'],
      },
      {
        id: uuidv4(),
        label: '예산',
        type: 'SELECT' as QuestionType,
        isRequired: true,
        questionOrder: 5,
        options: ['3천만원 이하', '3천만원-5천만원', '5천만원-1억', '1억 이상'],
      },
    ],

    // 상가 관련 질문
    상가_매수: [
      {
        id: uuidv4(),
        label: '희망 지역',
        type: 'TEXT' as QuestionType,
        isRequired: true,
        questionOrder: 3,
      },
      {
        id: uuidv4(),
        label: '예산',
        type: 'SELECT' as QuestionType,
        isRequired: true,
        questionOrder: 4,
        options: ['1억 이하', '1억-3억', '3억-5억', '5억-10억', '10억 이상'],
      },
      {
        id: uuidv4(),
        label: '희망 업종',
        type: 'TEXT' as QuestionType,
        isRequired: true,
        questionOrder: 5,
      },
    ],
    상가_매도: [
      {
        id: uuidv4(),
        label: '매물 주소',
        type: 'TEXT' as QuestionType,
        isRequired: true,
        questionOrder: 3,
      },
      {
        id: uuidv4(),
        label: '매물 평수',
        type: 'NUMBER' as QuestionType,
        isRequired: true,
        questionOrder: 4,
      },
      {
        id: uuidv4(),
        label: '현재 업종',
        type: 'TEXT' as QuestionType,
        isRequired: true,
        questionOrder: 5,
      },
    ],
    상가_임대: [
      {
        id: uuidv4(),
        label: '매물 주소',
        type: 'TEXT' as QuestionType,
        isRequired: true,
        questionOrder: 3,
      },
      {
        id: uuidv4(),
        label: '임대 유형',
        type: 'SELECT' as QuestionType,
        isRequired: true,
        questionOrder: 4,
        options: ['전세', '월세'],
      },
      {
        id: uuidv4(),
        label: '권리금 유무',
        type: 'RADIO' as QuestionType,
        isRequired: true,
        questionOrder: 5,
        options: ['있음', '없음'],
      },
    ],
    상가_임차: [
      {
        id: uuidv4(),
        label: '희망 지역',
        type: 'TEXT' as QuestionType,
        isRequired: true,
        questionOrder: 3,
      },
      {
        id: uuidv4(),
        label: '예상 업종',
        type: 'TEXT' as QuestionType,
        isRequired: true,
        questionOrder: 4,
      },
      {
        id: uuidv4(),
        label: '권리금 예산',
        type: 'SELECT' as QuestionType,
        isRequired: true,
        questionOrder: 5,
        options: ['없음', '1천만원 이하', '1천만원-3천만원', '3천만원-5천만원', '5천만원 이상'],
      },
    ],

    // 사무실 관련 질문
    사무실_매수: [
      {
        id: uuidv4(),
        label: '희망 지역',
        type: 'TEXT' as QuestionType,
        isRequired: true,
        questionOrder: 3,
      },
      {
        id: uuidv4(),
        label: '예산',
        type: 'SELECT' as QuestionType,
        isRequired: true,
        questionOrder: 4,
        options: ['1억 이하', '1억-3억', '3억-5억', '5억-10억', '10억 이상'],
      },
      {
        id: uuidv4(),
        label: '희망 평수',
        type: 'SELECT' as QuestionType,
        isRequired: true,
        questionOrder: 5,
        options: ['10평 이하', '10평-20평', '20평-30평', '30평-50평', '50평 이상'],
      },
    ],
    사무실_매도: [
      {
        id: uuidv4(),
        label: '매물 주소',
        type: 'TEXT' as QuestionType,
        isRequired: true,
        questionOrder: 3,
      },
      {
        id: uuidv4(),
        label: '매물 평수',
        type: 'NUMBER' as QuestionType,
        isRequired: true,
        questionOrder: 4,
      },
      {
        id: uuidv4(),
        label: '희망 매도가',
        type: 'NUMBER' as QuestionType,
        isRequired: true,
        questionOrder: 5,
      },
    ],
    사무실_임대: [
      {
        id: uuidv4(),
        label: '매물 주소',
        type: 'TEXT' as QuestionType,
        isRequired: true,
        questionOrder: 3,
      },
      {
        id: uuidv4(),
        label: '임대 유형',
        type: 'SELECT' as QuestionType,
        isRequired: true,
        questionOrder: 4,
        options: ['전세', '월세'],
      },
      {
        id: uuidv4(),
        label: '희망 임대료',
        type: 'NUMBER' as QuestionType,
        isRequired: true,
        questionOrder: 5,
      },
    ],
    사무실_임차: [
      {
        id: uuidv4(),
        label: '희망 지역',
        type: 'TEXT' as QuestionType,
        isRequired: true,
        questionOrder: 3,
      },
      {
        id: uuidv4(),
        label: '임차 유형',
        type: 'SELECT' as QuestionType,
        isRequired: true,
        questionOrder: 4,
        options: ['전세', '월세'],
      },
      {
        id: uuidv4(),
        label: '예산',
        type: 'SELECT' as QuestionType,
        isRequired: true,
        questionOrder: 5,
        options: ['5천만원 이하', '5천만원-1억', '1억-2억', '2억-3억', '3억 이상'],
      },
    ],

    // 원룸 관련 질문
    원룸_매수: [
      {
        id: uuidv4(),
        label: '희망 지역',
        type: 'TEXT' as QuestionType,
        isRequired: true,
        questionOrder: 3,
      },
      {
        id: uuidv4(),
        label: '예산',
        type: 'SELECT' as QuestionType,
        isRequired: true,
        questionOrder: 4,
        options: ['5천만원 이하', '5천만원-1억', '1억-2억', '2억 이상'],
      },
      {
        id: uuidv4(),
        label: '투자 목적',
        type: 'RADIO' as QuestionType,
        isRequired: true,
        questionOrder: 5,
        options: ['직접 거주', '임대 수익'],
      },
    ],
    원룸_매도: [
      {
        id: uuidv4(),
        label: '매물 주소',
        type: 'TEXT' as QuestionType,
        isRequired: true,
        questionOrder: 3,
      },
      {
        id: uuidv4(),
        label: '매물 평수',
        type: 'NUMBER' as QuestionType,
        isRequired: true,
        questionOrder: 4,
      },
      {
        id: uuidv4(),
        label: '희망 매도가',
        type: 'NUMBER' as QuestionType,
        isRequired: true,
        questionOrder: 5,
      },
    ],
    원룸_임대: [
      {
        id: uuidv4(),
        label: '매물 주소',
        type: 'TEXT' as QuestionType,
        isRequired: true,
        questionOrder: 3,
      },
      {
        id: uuidv4(),
        label: '임대 유형',
        type: 'SELECT' as QuestionType,
        isRequired: true,
        questionOrder: 4,
        options: ['전세', '월세'],
      },
      {
        id: uuidv4(),
        label: '희망 임대료',
        type: 'NUMBER' as QuestionType,
        isRequired: true,
        questionOrder: 5,
      },
    ],
    원룸_임차: [
      {
        id: uuidv4(),
        label: '희망 지역',
        type: 'TEXT' as QuestionType,
        isRequired: true,
        questionOrder: 3,
      },
      {
        id: uuidv4(),
        label: '임차 유형',
        type: 'SELECT' as QuestionType,
        isRequired: true,
        questionOrder: 4,
        options: ['전세', '월세'],
      },
      {
        id: uuidv4(),
        label: '예산',
        type: 'SELECT' as QuestionType,
        isRequired: true,
        questionOrder: 5,
        options: ['500만원 이하', '500만원-1천만원', '1천만원-2천만원', '2천만원 이상'],
      },
    ],
  };

  const typeKey = `${propertyType}_${transactionPurpose}`;

  // 해당 유형의 특화 질문이 있으면 반환, 없으면 공통 질문만 반환
  return typeSpecificQuestions[typeKey]
    ? [...commonQuestions, ...typeSpecificQuestions[typeKey]]
    : commonQuestions;
};

// 유형 필드 생성 함수
export const createTypeField = (propertyType: string, transactionPurpose: string): Question => {
  return {
    id: uuidv4(),
    label: '유형',
    type: 'SELECT' as QuestionType,
    isRequired: true,
    questionOrder: 0, // 임시 순서, 나중에 조정됨
    options: [`${propertyType}_${transactionPurpose}`],
  };
};
