'use client';

import type React from 'react';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { z } from 'zod';
import { Eye, EyeOff, Mail, User, Phone, Briefcase } from 'react-feather';

import AuthLayout from '../../components/layout/AuthLayout';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Toast from '../../components/ui/Toast';
import useToast from '../../hooks/useToast';
import useEmailVerification from '../../hooks/useEmailVerification';
import { signUpSchema } from '../../utils/validation';
import { useAuth } from '../../context/useAuth';
import { SignUpRequest } from '../../api/auth';
import { VerificationType } from '../../types/auth';
import AddressInput from '../../components/ui/AddressInput';

type SignUpFormData = z.infer<typeof signUpSchema>;

const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const { toast, showToast, hideToast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [showAgencySection, setShowAgencySection] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [validFields, setValidFields] = useState<Record<string, boolean>>({});

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting, dirtyFields },
    setValue,
    getValues,
    trigger,
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: '',
      password: '',
      passwordConfirm: '',
      name: '',
      licenseNumber: '',
      phone: '',
      agencyName: '',
      agencyBusinessNumber: '',
      agencyAddress: '',
      agencyRoadAddress: '',
    },
    mode: 'onChange', // 입력 값이 변경될 때마다 유효성 검사 실행
  });

  // 필드 변경 감지 및 유효성 검사를 위한 단일 useEffect
  useEffect(() => {
    // 선택 필드 목록
    const optionalFields = [
      'licenseNumber',
      'agencyName',
      'agencyBusinessNumber',
      'agencyAddress',
      'agencyRoadAddress',
    ];

    // 변경된 필드 감지를 위한 함수
    const validateField = async (fieldName: keyof SignUpFormData) => {
      // 필드가 수정되었는지 확인
      if (dirtyFields[fieldName]) {
        // 선택 필드인 경우 값이 있을 때만 유효성 검사 실행
        const value = getValues(fieldName);
        if (optionalFields.includes(fieldName) && !value) return;

        // 유효성 검사 실행
        const isValid = await trigger(fieldName);

        // 상태 업데이트 (이전 상태를 기반으로 특정 필드만 업데이트)
        setValidFields((prev) => ({
          ...prev,
          [fieldName]: isValid,
        }));
      }
    };

    // 필드 변경 감지를 위한 구독 설정
    const subscription = watch((_, { name, type }) => {
      // 값이 변경된 경우에만 유효성 검사 실행
      if (name && type === 'change') {
        validateField(name as keyof SignUpFormData);
      }
    });

    // 컴포넌트 언마운트 시 구독 해제
    return () => subscription.unsubscribe();
  }, [watch, trigger, dirtyFields, getValues]);

  // 이메일 인증 관련 로직
  const {
    isVerificationSent,
    isVerified,
    verificationCode,
    setVerificationCode,
    timeRemaining,
    isExpired,
    isLoading: isVerificationLoading,
    error: verificationError,
    sendVerification,
    verifyCode,
    resendVerification,
    resetVerification,
  } = useEmailVerification();

  const handleSendVerification = async () => {
    const email = getValues('email');
    if (!email) {
      showToast('이메일을 입력해주세요.', 'error');
      return;
    }

    try {
      const result = await sendVerification(email, VerificationType.EMAIL_VERIFICATION);
      if (result.success) {
        showToast('인증 메일이 발송되었습니다. 이메일을 확인해주세요.', 'success');
      } else {
        showToast(result.message || '인증 메일 발송에 실패했습니다.', 'error');
      }
    } catch {
      showToast('인증 메일 발송 중 오류가 발생했습니다.', 'error');
    }
  };

  const handleVerifyCode = async () => {
    const email = getValues('email');
    const result = await verifyCode(email, verificationCode);

    if (result) {
      showToast('이메일 인증이 완료되었습니다.', 'success');
      // 인증 코드 입력 후 이메일 필드 비활성화
      setValue('email', getValues('email'), { shouldValidate: true, shouldDirty: true });
    } else {
      if (isExpired) {
        showToast('인증번호가 만료되었습니다. 다시 요청해주세요.', 'error');
      } else {
        showToast('인증번호가 일치하지 않습니다. 다시 입력해주세요.', 'error');
      }
    }
  };

  const resetEmailVerification = () => {
    resetVerification();
    setResendCooldown(0);
    // 쿨다운 타이머가 있다면 제거
    if (window.cooldownInterval) {
      clearInterval(window.cooldownInterval);
    }
  };

  const handleResendVerification = async () => {
    if (resendCooldown > 0) {
      showToast(`${resendCooldown}초 후에 다시 시도해주세요.`, 'warning');
      return;
    }

    const email = getValues('email');
    if (!email) {
      showToast('이메일을 입력해주세요.', 'error');
      return;
    }

    try {
      const success = await resendVerification(email, VerificationType.EMAIL_VERIFICATION);
      if (success) {
        showToast('인증 메일을 재전송했습니다. 이메일을 확인해주세요.', 'success');

        // 재발송 쿨다운 설정 (30초)
        setResendCooldown(30);
        const cooldownInterval = setInterval(() => {
          setResendCooldown((prev) => {
            if (prev <= 1) {
              clearInterval(cooldownInterval);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        showToast('이메일 재전송에 실패했습니다. 잠시 후 다시 시도해주세요.', 'error');
      }
    } catch {
      showToast('이메일 재전송 중 오류가 발생했습니다.', 'error');
    }
  };

  const onSubmit = async (data: SignUpFormData) => {
    if (!isVerified) {
      showToast('이메일 인증을 완료해주세요.', 'error');
      return;
    }

    try {
      const signUpData: SignUpRequest = {
        agent: {
          name: data.name,
          licenseNumber: data.licenseNumber || undefined,
          email: data.email,
          password: data.password,
          contact: data.phone,
          emailVerified: isVerified, // 이메일 인증 여부
        },
        realEstate: {
          name: data.agencyName || undefined,
          businessRegistrationNumber: data.agencyBusinessNumber || undefined,
          address: data.agencyAddress || undefined,
          roadAddress: data.agencyRoadAddress || undefined,
        },
      };

      // realEstate 객체에 모든 필드가 undefined인 경우 undefined로 설정
      if (!Object.values(signUpData.realEstate || {}).some((value) => value !== undefined)) {
        signUpData.realEstate = undefined;
      }

      const success = await signUp(signUpData);

      if (success) {
        showToast('회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.', 'success');
        setTimeout(() => {
          navigate('/signin');
        }, 2000);
      } else {
        showToast('회원가입에 실패했습니다. 다시 시도해주세요.', 'error');
      }
    } catch {
      showToast('회원가입 중 오류가 발생했습니다.', 'error');
    }
  };

  const formatTimeRemaining = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const handleAddressSelect = (address: {
    jibunAddress: string;
    roadAddress: string;
    detailAddress: string;
    zipCode: string;
  }) => {
    // react-hook-form의 setValue를 사용하여 폼 필드 값 업데이트
    setValue('agencyAddress', address.jibunAddress + ' ' + address.detailAddress, {
      shouldValidate: true,
      shouldDirty: true,
    });
    setValue('agencyRoadAddress', address.roadAddress + ' ' + address.detailAddress, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  return (
    <AuthLayout title="회원가입" subtitle="부동산 CRM 서비스에 오신 것을 환영합니다.">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-left text-lg font-medium text-gray-900">공인중개사 정보</h3>

          {/* 이메일 */}
          <div>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <div className="relative">
                  <Input
                    {...field}
                    label="이메일"
                    type="email"
                    placeholder="example@example.com"
                    error={errors.email?.message}
                    leftIcon={<Mail size={18} />}
                    required
                    disabled={isVerified}
                    isValid={validFields.email}
                    onChange={(e) => {
                      field.onChange(e);
                      // 이메일이 변경되면 인증 상태 초기화
                      if (isVerificationSent && !isVerified) {
                        resetEmailVerification();
                      }
                    }}
                    autoComplete="off"
                  />
                  {!isVerified && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="absolute right-2 top-8"
                      onClick={handleSendVerification}
                      isLoading={isVerificationLoading}
                      disabled={(isVerificationSent && !isExpired) || !validFields.email}
                    >
                      {isVerificationSent && !isExpired
                        ? '발송됨'
                        : isExpired
                          ? '재발송'
                          : '인증하기'}
                    </Button>
                  )}
                </div>
              )}
            />
          </div>

          {/* 이메일 인증 코드 */}
          {isVerificationSent && !isVerified && (
            <div className="space-y-2">
              <div className="relative">
                <Input
                  label="인증번호"
                  type="text"
                  placeholder="인증번호 6자리 입력"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  error={verificationError || undefined}
                  required
                  isValid={verificationCode.length === 6}
                  disabled={isVerified || isExpired}
                  maxLength={6}
                  autoComplete="off"
                />
                {!isExpired ? (
                  <div className="absolute right-2 top-8 text-sm text-blue-600">
                    {formatTimeRemaining(timeRemaining)}
                  </div>
                ) : (
                  <div className="absolute right-2 top-8 text-sm text-red-600">만료됨</div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  onClick={handleVerifyCode}
                  isLoading={isVerificationLoading}
                  disabled={isExpired || verificationCode.length !== 6}
                  className="flex-1"
                >
                  인증 확인
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleResendVerification}
                  isLoading={isVerificationLoading}
                  disabled={resendCooldown > 0}
                  className="flex-1"
                >
                  {resendCooldown > 0 ? `재발송 (${resendCooldown}초)` : '인증번호 재발송'}
                </Button>
              </div>

              <p className="text-left text-xs text-gray-500 mt-1">
                인증번호가 오지 않았나요? 스팸 메일함을 확인하거나 인증번호 재발송 버튼을
                클릭하세요.
              </p>
            </div>
          )}

          {/* 비밀번호 */}
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                label="비밀번호"
                type={showPassword ? 'text' : 'password'}
                placeholder="비밀번호 입력 (8자 이상, 영문, 숫자, 특수문자 포함)"
                error={errors.password?.message}
                required
                isValid={validFields.password}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="focus:outline-none"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                }
                autoComplete="off"
              />
            )}
          />

          {/* 비밀번호 확인 */}
          <Controller
            name="passwordConfirm"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                label="비밀번호 확인"
                type={showPasswordConfirm ? 'text' : 'password'}
                placeholder="비밀번호 재입력"
                error={errors.passwordConfirm?.message}
                required
                isValid={validFields.passwordConfirm}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                    className="focus:outline-none"
                  >
                    {showPasswordConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                }
                autoComplete="off"
              />
            )}
          />

          {/* 이름 */}
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                label="이름"
                placeholder="이름 입력"
                error={errors.name?.message}
                leftIcon={<User size={18} />}
                required
                isValid={validFields.name}
                autoComplete="off"
              />
            )}
          />

          {/* 자격증 번호 */}
          <Controller
            name="licenseNumber"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                label="자격증 번호"
                placeholder="자격증 번호 입력 (선택)"
                error={errors.licenseNumber?.message}
                leftIcon={<Briefcase size={18} />}
                autoComplete="off"
              />
            )}
          />

          {/* 연락처 */}
          <Controller
            name="phone"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                label="연락처"
                placeholder="010-0000-0000"
                error={errors.phone?.message}
                leftIcon={<Phone size={18} />}
                required
                isValid={validFields.phone}
                autoComplete="off"
              />
            )}
          />
        </div>

        {/* 소속 부동산 정보 */}
        <div className="pt-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">소속 부동산 정보 (선택)</h3>
            <button
              type="button"
              className="text-sm text-blue-600 hover:text-blue-800"
              onClick={() => setShowAgencySection(!showAgencySection)}
            >
              {showAgencySection ? '접기' : '펼치기'}
            </button>
          </div>

          {showAgencySection && (
            <div className="mt-4 space-y-4">
              {/* 부동산 이름 */}
              <Controller
                name="agencyName"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    label="부동산 이름"
                    placeholder="부동산 이름 입력"
                    error={errors.agencyName?.message}
                    leftIcon={<Briefcase size={18} />}
                    autoComplete="off"
                  />
                )}
              />

              {/* 사업자 등록번호 */}
              <Controller
                name="agencyBusinessNumber"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    label="사업자 등록번호"
                    placeholder="000-00-00000"
                    error={errors.agencyBusinessNumber?.message}
                    autoComplete="off"
                  />
                )}
              />

              {/* 주소 입력 컴포넌트 */}
              <AddressInput onAddressSelect={handleAddressSelect} />
            </div>
          )}
        </div>

        <div>
          <Button
            type="submit"
            variant="primary"
            fullWidth
            isLoading={isSubmitting}
            disabled={!isVerified}
          >
            회원가입
          </Button>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            이미 계정이 있으신가요?{' '}
            <Link to="/signin" className="font-medium text-blue-600 hover:text-blue-500">
              로그인
            </Link>
          </p>
        </div>
      </form>

      {toast.isVisible && (
        <Toast
          message={toast.message}
          variant={toast.variant}
          onClose={hideToast}
          isVisible={toast.isVisible}
        />
      )}
    </AuthLayout>
  );
};

export default SignUp;
