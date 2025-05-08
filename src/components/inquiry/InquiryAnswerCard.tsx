import React from 'react';
import { AnswerDto } from '../../types/inquiry';
import { isAddressQuestion } from '../../utils/isAddressAnswer';
import { AddressAnswer } from './AddressAnswer';
import { CheckboxAnswer } from './CheckboxAnswer';

const InquiryAnswerCard: React.FC<{ answer: AnswerDto }> = ({ answer }) => {
  const renderAnswer = () => {
    if (!answer.answer) return <span className="text-gray-400">응답 없음</span>;

    if (isAddressQuestion(answer.questionContent)) {
      return <AddressAnswer answer={answer.answer} />;
    }

    switch (answer.questionType) {
      case 'TEXTAREA':
        return <pre className="whitespace-pre-wrap text-gray-700">{answer.answer}</pre>;

      case 'CHECKBOX':
        return <CheckboxAnswer answer={answer.answer} />;

      case 'DATE':
        try {
          const date = new Date(answer.answer);
          return (
            <span className="text-gray-700">
              {date.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
          );
        } catch {
          return <span className="text-gray-700">{answer.answer}</span>;
        }

      default:
        return <span className="text-gray-700">{answer.answer}</span>;
    }
  };

  return (
    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
      <h4 className="font-medium text-gray-900 mb-2">{answer.questionContent}</h4>
      {renderAnswer()}
    </div>
  );
};

export default InquiryAnswerCard;
