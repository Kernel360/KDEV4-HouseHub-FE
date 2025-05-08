'use client';

import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { createInquiry } from '../../api/inquiry';
import Button from '../ui/Button';
import { useToast } from '../../context/useToast';
import QuestionField from './QuestionField';
import type { InquiryTemplate, CreateInquiryRequest } from '../../types/inquiry';
import type { InquiryAnswer } from '../../types/inquiry';

interface FormRendererProps {
  template: InquiryTemplate;
  shareToken: string;
  onSubmitStart: () => void;
  onSubmitSuccess: () => void;
  onSubmitError: (error: string) => void;
}

const FormRenderer: React.FC<FormRendererProps> = ({
  template,
  shareToken,
  onSubmitStart,
  onSubmitSuccess,
  onSubmitError,
}) => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const methods = useForm({
    mode: 'onChange', // 실시간 에러 감지를 위한 설정
  });
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = methods;

  // 질문 정렬
  const sortedQuestions = [...template.questions].sort((a, b) => a.questionOrder - b.questionOrder);

  // 폼 제출 핸들러
  const onSubmit = async (data: any) => {
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      onSubmitStart();

      // 답변 데이터 구성
      const answers: InquiryAnswer[] = [];
      let phone = '';

      sortedQuestions.forEach((question, index) => {
        const answer = data.answers[question.id];
        if (answer !== undefined && answer !== '') {
          answers.push({
            questionId: question.id,
            answerText: typeof answer === 'string' ? answer : JSON.stringify(answer),
          });

          if (index === 1) {
            phone = typeof answer === 'string' ? answer : JSON.stringify(answer);
          }
        }
      });

      // 필수 정보 확인
      if (!phone) {
        showToast('연락처는 필수 입력 항목입니다.', 'error');
        onSubmitError('연락처는 필수 입력 항목입니다.');
        setIsSubmitting(false);
        return;
      }

      // API 요청 데이터 구성
      const requestData: CreateInquiryRequest = {
        templateToken: shareToken,
        phone,
        answers,
      };

      // 공개 API 호출
      const response = await createInquiry(requestData);

      // 응답 처리
      if (response.code === 'INQUIRY_CREATE_SUCCESS') {
        showToast('문의가 성공적으로 등록되었습니다.', 'success');
        onSubmitSuccess();
        navigate('/inquiry/complete');
      } else {
        onSubmitError(response.message || '문의 등록에 실패했습니다.');
        showToast(response.message || '문의 등록에 실패했습니다.', 'error');
      }
    } catch (error) {
      if (error instanceof Error) {
        onSubmitError(error.message);
        showToast(error.message, 'error');
      } else {
        onSubmitError('문의 등록 중 오류가 발생했습니다.');
        showToast('문의 등록 중 오류가 발생했습니다.', 'error');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* 질문 필드 */}
        <div className="space-y-6">
          {sortedQuestions.map((question) => (
            <div key={question.id} className="bg-white p-4 rounded-md border border-gray-200">
              <QuestionField
                question={question}
                control={control}
                error={errors[question.id]?.message as string}
              />
            </div>
          ))}
        </div>

        {/* 제출 버튼 */}
        <div className="pt-4">
          <Button
            type="submit"
            variant="primary"
            fullWidth
            isLoading={isSubmitting}
            disabled={isSubmitting}
          >
            {isSubmitting ? '제출 중...' : '문의하기'}
          </Button>
          <p className="text-xs text-gray-500 text-center mt-2">
            * 제출된 정보는 문의 처리 목적으로만 사용됩니다.
          </p>
        </div>
      </form>
    </FormProvider>
  );
};

export default FormRenderer;
