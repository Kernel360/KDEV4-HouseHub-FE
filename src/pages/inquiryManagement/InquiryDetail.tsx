'use client';

import type React from 'react';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'react-feather';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Button from '../../components/ui/Button';
import { useToast } from '../../context/useToast';
import { getInquiryById } from '../../api/inquiry';
import type { InquiryDetail } from '../../types/inquiry';
import CustomerInfoCard from '../../components/inquiry/CustomerInfoCard';
import InquiryAnswerList from '../../components/inquiry/InquiryAnswerList';

const InquiryDetail: React.FC = () => {
  const { inquiryId } = useParams<{ inquiryId: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [inquiry, setInquiry] = useState<InquiryDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchInquiryDetail = async () => {
      if (!inquiryId) return;

      setIsLoading(true);
      try {
        const response = await getInquiryById(Number(inquiryId));
        if (response.success && response.data) {
          setInquiry(response.data);
        } else {
          showToast(response.error || '문의 상세 정보를 불러오는데 실패했습니다.', 'error');
          navigate('/inquiries');
        }
      } catch (error) {
        console.error('문의 상세 정보를 불러오는 중 오류가 발생했습니다:', error);
        showToast('문의 상세 정보를 불러오는 중 오류가 발생했습니다.', 'error');
        navigate('/inquiries');
      } finally {
        setIsLoading(false);
      }
    };

    fetchInquiryDetail();
  }, [inquiryId, navigate, showToast]);

  // 뒤로 가기 핸들러
  const handleGoBack = () => {
    navigate('/inquiries');
  };

  return (
    <DashboardLayout>
      <div className="pb-5 mb-6 border-b border-gray-200">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleGoBack}
            className="mr-4 text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">문의 상세 정보</h1>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : inquiry ? (
        <div className="space-y-6">
          {/* 고객 정보 섹션 */}
          <CustomerInfoCard
            name={inquiry.customerName}
            email={inquiry.customerEmail}
            contact={inquiry.customerContact}
            createdAt={inquiry.createdAt}
          />

          {/* 문의 내용 섹션 */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">문의 내용</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">고객이 제출한 문의 내용입니다.</p>
            </div>
            <div className="border-t border-gray-200">
              <div className="px-4 py-5 sm:p-6">
                <div className="space-y-4">
                  <InquiryAnswerList answers={inquiry.answers} />
                </div>
              </div>
            </div>
          </div>

          {/* 답변 작성 섹션 (향후 구현) */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">답변 작성</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                고객 문의에 대한 답변을 작성할 수 있습니다.
              </p>
            </div>
            <div className="border-t border-gray-200">
              <div className="px-4 py-5 sm:p-6">
                <p className="text-sm text-gray-500 italic">답변 작성 기능은 준비 중입니다.</p>
              </div>
            </div>
          </div>

          {/* 하단 버튼 */}
          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={handleGoBack}>
              목록으로 돌아가기
            </Button>
            <Button variant="primary" disabled>
              답변 저장
            </Button>
          </div>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6 text-center">
          <p className="text-gray-500">문의 정보를 찾을 수 없습니다.</p>
          <Button variant="outline" onClick={handleGoBack} className="mt-4">
            목록으로 돌아가기
          </Button>
        </div>
      )}
    </DashboardLayout>
  );
};

export default InquiryDetail;
