'use client';

import type React from 'react';
import { useState } from 'react';
import { type Question, QuestionType } from '../../types/inquiry';
import { Controller, type Control } from 'react-hook-form';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Checkbox from '../ui/Checkbox';
import { Paperclip, X } from 'react-feather';
import RegionSelector from '../region/RegionSelector';
import { RegionData } from '../../types/region';
import AddressInput from '../ui/AddressInput';

interface QuestionFieldProps {
  question: Question;
  control: Control<any>;
  error?: string;
}

const QuestionField: React.FC<QuestionFieldProps> = ({ question, control, error }) => {
  const [files, setFiles] = useState<File[]>([]);

  // 파일 선택 핸들러
  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    onChange: (value: any) => void
  ) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...selectedFiles]);
      onChange(selectedFiles);
    }
  };

  // 파일 제거 핸들러
  const handleRemoveFile = (index: number, onChange: (value: any) => void) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
    onChange(newFiles);
  };

  // 질문 타입에 따른 입력 필드 렌더링
  const renderField = () => {
    const isTextType = question.type === 'TEXT';
    const includesAddress = question.label.includes('주소');

    // 주소 컴포넌트를 렌더링할 조건
    if (isTextType && includesAddress) {
      return (
        <div>
          <Controller
            name={`answers.${question.id}`}
            control={control}
            defaultValue={{
              jibunAddress: '',
              roadAddress: '',
              detailAddress: '',
              zipCode: '',
            }}
            render={({ field: { onChange, value } }) => (
              <AddressInput onAddressSelect={(address) => onChange(address)} />
            )}
          />
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
      );
    }

    return (
      <Controller
        name={`answers.${question.id}`}
        control={control}
        defaultValue=""
        rules={{
          required: question.isRequired ? `${question.label}은(는) 필수 항목입니다.` : false,
          // 질문 타입별 유효성 검사 추가
          ...(question.type === QuestionType.EMAIL && {
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
              message: '유효한 이메일 주소를 입력해주세요.',
            },
          }),
          ...(question.type === QuestionType.PHONE && {
            pattern: {
              value: /^010-\d{4}-\d{4}$/,
              message: '유효한 전화번호를 입력해주세요. (예: 010-0000-0000)',
            },
          }),
          ...(question.type === QuestionType.NUMBER && {
            min: {
              value: 1,
              message: '1 이상의 숫자를 입력해주세요.',
            },
          }),
          ...(question.type === QuestionType.FILE && {
            validate: {
              fileSize: (value) =>
                value && value[0].size <= 5 * 1024 * 1024
                  ? true
                  : '파일 크기는 5MB 이하로 업로드해주세요.',
              fileType: (value) =>
                value && /image\/(jpeg|png|jpg)/.test(value[0].type)
                  ? true
                  : 'JPEG, PNG 형식의 이미지 파일만 업로드 가능합니다.',
            },
          }),
          ...(question.type === QuestionType.TEXTAREA && {
            maxLength: {
              value: 500,
              message: '500자 이하로 입력해주세요.',
            },
          }),
        }}
        render={({ field: { onChange, value, ref }, fieldState: { error } }) => {
          switch (question.type) {
            case QuestionType.TEXT:
              return (
                <Input
                  value={value || ''}
                  onChange={(e) => onChange(e.target.value)}
                  placeholder={`${question.label} 입력`}
                  error={error?.message}
                  fullWidth
                />
              );

            case QuestionType.TEXTAREA:
              return (
                <div>
                  <textarea
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
                    }`}
                    rows={4}
                    value={value || ''}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={`${question.label} 입력`}
                    ref={ref}
                  />
                  {error && <p className="mt-1 text-sm text-red-500">{error.message}</p>}
                </div>
              );

            case QuestionType.SELECT:
              return (
                <div>
                  <select
                    className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
                    }`}
                    value={value || ''}
                    onChange={(e) => onChange(e.target.value)}
                    ref={ref}
                  >
                    <option value="" disabled>
                      선택하세요
                    </option>
                    {question.options?.map((option, index) => (
                      <option key={index} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  {error && <p className="mt-1 text-sm text-red-500">{error.message}</p>}
                </div>
              );

            case QuestionType.RADIO:
              return (
                <div className="space-y-2">
                  {question.options?.map((option, index) => (
                    <div key={index} className="flex items-center">
                      <input
                        type="radio"
                        id={`question-${question.id}-option-${index}`}
                        name={`question-${question.id}`}
                        value={option}
                        checked={value === option}
                        onChange={() => onChange(option)}
                        className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <label
                        htmlFor={`question-${question.id}-option-${index}`}
                        className="ml-2 block text-sm text-gray-700"
                      >
                        {option}
                      </label>
                    </div>
                  ))}
                  {error && <p className="mt-1 text-sm text-red-500">{error.message}</p>}
                </div>
              );

            case QuestionType.CHECKBOX:
              return (
                <div className="space-y-2">
                  {question.options?.map((option, index) => (
                    <div key={index} className="flex items-center">
                      <Checkbox
                        id={`question-${question.id}-option-${index}`}
                        checked={Array.isArray(value) && value.includes(option)}
                        onChange={(e) => {
                          const currentValues = Array.isArray(value) ? [...value] : [];
                          if (e.target.checked) {
                            onChange([...currentValues, option]);
                          } else {
                            onChange(currentValues.filter((val) => val !== option));
                          }
                        }}
                        label={option}
                      />
                    </div>
                  ))}
                  {error && <p className="mt-1 text-sm text-red-500">{error.message}</p>}
                </div>
              );

            case QuestionType.DATE:
              return (
                <div>
                  <Input
                    type="date"
                    value={value || ''}
                    onChange={(e) => onChange(e.target.value)}
                    error={error?.message}
                    fullWidth
                  />
                </div>
              );

            case QuestionType.FILE:
              return (
                <div>
                  <div className="flex items-center mt-1">
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        className="hidden"
                        onChange={(e) => handleFileChange(e, onChange)}
                        multiple
                      />
                      <Button type="button" variant="outline" className="inline-flex items-center">
                        <Paperclip size={16} className="mr-2" />
                        파일 선택
                      </Button>
                    </label>
                    <span className="ml-3 text-sm text-gray-500">
                      {files.length > 0 ? `${files.length}개 파일 선택됨` : '선택된 파일 없음'}
                    </span>
                  </div>

                  {files.length > 0 && (
                    <div className="mt-2">
                      <ul className="space-y-1">
                        {files.map((file, index) => (
                          <li
                            key={index}
                            className="flex items-center justify-between text-sm bg-gray-50 p-2 rounded"
                          >
                            <span className="truncate max-w-xs">{file.name}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveFile(index, onChange)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <X size={16} />
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {error && <p className="mt-1 text-sm text-red-500">{error.message}</p>}
                </div>
              );

            case QuestionType.EMAIL:
              return (
                <Input
                  type="email"
                  value={value || ''}
                  onChange={(e) => onChange(e.target.value)}
                  placeholder="example@example.com"
                  error={error?.message}
                  fullWidth
                />
              );

            case QuestionType.PHONE:
              return (
                <Input
                  type="tel"
                  value={value || ''}
                  onChange={(e) => onChange(e.target.value)}
                  placeholder="010-0000-0000"
                  error={error?.message}
                  fullWidth
                />
              );

            case QuestionType.NUMBER:
              return (
                <Input
                  type="number"
                  value={value || ''}
                  onChange={(e) => onChange(e.target.value)}
                  placeholder="숫자 입력"
                  error={error?.message}
                  fullWidth
                />
              );

            case QuestionType.REGION:
              return (
                <div className="border border-gray-200 rounded-md p-4 bg-gray-50">
                  <RegionSelector
                    error={error?.message}
                    onChange={(regionData: RegionData | null) => {
                      onChange(regionData);
                    }}
                  />
                </div>
              );

            default:
              return (
                <Input
                  value={value || ''}
                  onChange={(e) => onChange(e.target.value)}
                  placeholder={`${question.label} 입력`}
                  error={error?.message}
                  fullWidth
                />
              );
          }
        }}
      />
    );
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {question.label}
        {question.isRequired && <span className="text-red-500 ml-1">*</span>}
      </label>
      {renderField()}
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default QuestionField;
