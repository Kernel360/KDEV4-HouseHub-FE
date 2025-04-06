import apiClient from './client';
import type {
  SendSmsReqDto,
  SendSmsResDto,
  AligoHistoryReqDto,
  HistoryDetailDto,
  CreateUpdateTemplateReqDto,
  TemplateResDto,
  ApiResponse,
} from '../types/sms';

// 문자 발송 API
export const sendSms = async (data: SendSmsReqDto): Promise<ApiResponse<SendSmsResDto>> => {
  try {
    const response = await apiClient.post<ApiResponse<SendSmsResDto>>('/sms/send', data);
    return response.data;
  } catch (error) {
    console.error('SMS 발송 오류:', error);
    throw error;
  }
};

// 문자 발송 이력 조회 API
export const getSmsHistories = async (
  params: AligoHistoryReqDto
): Promise<ApiResponse<HistoryDetailDto[]>> => {
  try {
    const response = await apiClient.get<ApiResponse<HistoryDetailDto[]>>('/sms/history', {
      params,
    });
    return response.data;
  } catch (error) {
    console.error('SMS 이력 조회 오류:', error);
    throw error;
  }
};

// 문자 단건 조회 API
export const getSmsById = async (id: number): Promise<ApiResponse<SendSmsResDto>> => {
  try {
    const response = await apiClient.get<ApiResponse<SendSmsResDto>>(`/sms/${id}`);
    return response.data;
  } catch (error) {
    console.error('SMS 단건 조회 오류:', error);
    throw error;
  }
};

// 문자 전체 조회 API
export const getAllSms = async (): Promise<ApiResponse<SendSmsResDto[]>> => {
  try {
    const response = await apiClient.get<ApiResponse<SendSmsResDto[]>>('/sms/');
    return response.data;
  } catch (error) {
    console.error('SMS 전체 조회 오류:', error);
    throw error;
  }
};

// 템플릿 생성 API
export const createTemplate = async (
  data: CreateUpdateTemplateReqDto
): Promise<ApiResponse<TemplateResDto>> => {
  try {
    const response = await apiClient.post<ApiResponse<TemplateResDto>>('/sms/templates', data);
    return response.data;
  } catch (error) {
    console.error('템플릿 생성 오류:', error);
    throw error;
  }
};

// 템플릿 수정 API
export const updateTemplate = async (
  id: number,
  data: CreateUpdateTemplateReqDto
): Promise<ApiResponse<TemplateResDto>> => {
  try {
    const response = await apiClient.put<ApiResponse<TemplateResDto>>(
      `/api/sms/templates/${id}`,
      data
    );
    return response.data;
  } catch (error) {
    console.error('템플릿 수정 오류:', error);
    throw error;
  }
};

// 템플릿 삭제 API
export const deleteTemplate = async (id: number): Promise<ApiResponse<void>> => {
  try {
    const response = await apiClient.delete<ApiResponse<void>>(`/sms/templates/${id}`);
    return response.data;
  } catch (error) {
    console.error('템플릿 삭제 오류:', error);
    throw error;
  }
};

// 템플릿 상세 조회 API
export const getTemplateById = async (id: number): Promise<ApiResponse<TemplateResDto>> => {
  try {
    const response = await apiClient.get<ApiResponse<TemplateResDto>>(`/sms/templates/${id}`);
    return response.data;
  } catch (error) {
    console.error('템플릿 상세 조회 오류:', error);
    throw error;
  }
};

// 템플릿 목록 조회 API
export const getAllTemplates = async (): Promise<ApiResponse<TemplateResDto[]>> => {
  try {
    const response = await apiClient.get<ApiResponse<TemplateResDto[]>>('/sms/templates');
    return response.data;
  } catch (error) {
    console.error('템플릿 목록 조회 오류:', error);
    throw error;
  }
};
