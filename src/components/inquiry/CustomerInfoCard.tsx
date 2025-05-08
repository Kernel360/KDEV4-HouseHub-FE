import React from 'react';
import { User, Mail, Phone, Calendar } from 'react-feather';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

interface CustomerInfoCardProps {
  name: string;
  email: string;
  contact: string;
  createdAt: string;
}

const CustomerInfoCard: React.FC<CustomerInfoCardProps> = ({ name, email, contact, createdAt }) => {
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'yyyy년 MM월 dd일 HH:mm', { locale: ko });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg font-medium text-gray-900">고객 정보</h3>
        <p className="mt-1 text-sm text-gray-500">문의를 제출한 고객의 상세 정보입니다.</p>
      </div>
      <div className="border-t border-gray-200">
        <dl>
          {[
            { label: '고객명', icon: <User />, value: name },
            { label: '이메일', icon: <Mail />, value: email },
            { label: '연락처', icon: <Phone />, value: contact },
            { label: '문의일시', icon: <Calendar />, value: formatDate(createdAt) },
          ].map(({ label, icon, value }, idx) => (
            <div key={idx} className={idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
              <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500 flex items-center gap-2">
                  <span className="text-gray-400">{icon}</span>
                  {label}
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{value}</dd>
              </div>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
};

export default CustomerInfoCard;
