'use client';

import type React from 'react';

import {
  getMyCustomers,
  createMyCustomer,
  updateMyCustomer,
  deleteMyCustomer,
  downloadExcelTemplate,
  uploadCustomersExcel,
} from '../../api/customer';
import { useState, useEffect, useCallback, useRef } from 'react';
import { Search, Plus, RefreshCw, Edit, Trash2, Download, Upload } from 'react-feather';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Table from '../../components/ui/Table';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Pagination from '../../components/ui/Pagination';
import Modal from '../../components/ui/Modal';
import CustomerForm from '../../components/customers/CustomerForm';
import CustomerDetailModal from '../../components/customers/CustomerDetailModal';
import { formatPhoneNumber } from '../../utils/format';
import { useToast } from '../../context/useToast';
import type { CreateCustomerReqDto, Customer } from '../../types/customer';

const CustomersPage = () => {
  const { showToast } = useToast();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 0,
    totalElements: 0,
    size: 10,
  });
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // 검색 필드 상태 분리
  // 검색어는 하나로만 해요. > 백엔드에서 검색 대상: 이름, 이메일, 연락처 하면 됨.
  const [filter, setFilter] = useState({
    keyword: '',
    page: 1,
    size: 10,
  });
  const [searchBtnClicked, setSearchBtnClicked] = useState(false);

  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const itemsPerPage = 10;

  // 고객 데이터 로드 함수
  const loadCustomers = useCallback(async () => {
    setIsLoading(true);
    try {
      // API 호출
      const response = await getMyCustomers({
        keyword: filter.keyword,
        page: filter.page,
        size: filter.size,
      });

      if (response.success && response.data) {
        setCustomers(response.data.content);
        setPagination(response.data.pagination);
      } else {
        showToast(response.message || '고객 정보를 불러오는데 실패했습니다.', 'error');
      }
    } finally {
      // catch (error) {
      //   console.error('Failed to load customers:', error);
      //   showToast('고객 정보를 불러오는데 실패했습니다.', 'error');
      // }
      setIsLoading(false);
    }
  }, [showToast, filter]);

  // 데이터 로딩
  useEffect(() => {
    loadCustomers();
  }, []);

  useEffect(() => {
    if (searchBtnClicked) {
      loadCustomers();
      setSearchBtnClicked(false);
    }
  }, [filter, searchBtnClicked]);

  // 검색 실행 함수
  const handleSearch = () => {
    setFilter((prev) => ({
      ...prev,
      keyword: filter.keyword,
      page: 1,
    }));
    setSearchBtnClicked(true);
  };

  // 검색어 입력 시 Enter 키 처리
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // 페이지 변경 핸들러
  const handlePageChange = (newPage: number) => {
    setFilter((prev) => ({
      ...prev,
      page: newPage,
    }));
    setSearchBtnClicked(true);
  };

  // 고객 상세 정보 모달 열기
  const handleViewCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsDetailModalOpen(true);
  };

  // 고객 수정 버튼 클릭
  const handleEditCustomer = (customer: Customer, e?: React.MouseEvent) => {
    if (e) e.stopPropagation(); // 행 클릭 이벤트 전파 방지
    setSelectedCustomer(customer);
    setIsEditModalOpen(true);
  };

  // 고객 삭제 버튼 클릭
  const handleDeleteCustomerClick = (customer: Customer, e?: React.MouseEvent) => {
    if (e) e.stopPropagation(); // 행 클릭 이벤트 전파 방지
    setSelectedCustomer(customer);
    setIsDeleteModalOpen(true);
  };

  useEffect(() => {
    if (!isDeleteModalOpen) {
      setSelectedCustomer(null); // 선택된 고객 초기화
    }
  }, [isDeleteModalOpen]);

  // 고객 정보 수정
  const handleUpdateCustomer = async (customerData: CreateCustomerReqDto) => {
    if (!selectedCustomer) return;

    try {
      // API 호출
      const response = await updateMyCustomer(selectedCustomer.id, customerData);

      if (response.success && response.data) {
        // 상태 업데이트
        const updatedCustomer = { ...selectedCustomer, ...response.data };

        // 전체 목록 업데이트
        setCustomers((prev) =>
          prev.map((customer) => (customer.id === selectedCustomer.id ? updatedCustomer : customer))
        );

        setSelectedCustomer(updatedCustomer);

        showToast(response.message || '고객 정보가 성공적으로 수정되었습니다.', 'success');

        // 목록 새로고침
        loadCustomers();
      } else {
        // 실패 시 에러 메시지 표시
        showToast(response.message || '고객 정보 수정에 실패했습니다.', 'error');
      }
    } finally {
      // catch (error) {
      //   console.error('고객 정보 수정 중 오류 발생:', error);
      //   showToast('서버 연결 중 오류가 발생했습니다.', 'error');
      // }
      // 모달 닫기
      setIsEditModalOpen(false);
    }
  };

  // 고객 삭제
  const handleDeleteCustomer = async () => {
    if (!selectedCustomer) return;

    try {
      const response = await deleteMyCustomer(selectedCustomer.id);

      if (response.success && response.data) {
        showToast(response.message || '고객 정보가 성공적으로 삭제되었습니다.', 'success');

        // 목록 새로고침
        loadCustomers();
      } else {
        showToast(response.message || '고객 정보 삭제에 실패했습니다.', 'error');
      }
    } finally {
      //  catch (error) {
      //   console.error('고객 정보 삭제 중 오류 발생:', error);
      //   showToast('서버 연결 중 오류가 발생했습니다.', 'error');
      // }
      setIsDeleteModalOpen(false);
    }
  };

  //고객 등록
  const handleAddCustomer = async (customerData: CreateCustomerReqDto) => {
    try {
      const response = await createMyCustomer(customerData);

      if (response.success && response.data) {
        showToast(response.message || '고객 등록 성공', 'success');

        // 목록 새로고침
        loadCustomers();
        setIsAddModalOpen(false);
      } else {
        showToast(response.message || '등록 실패', 'error');
      }
    } catch (error) {
      console.error('API Error:', error);
      showToast('서버 연결 실패', 'error');
    }
  };

  // 엑셀 템플릿 다운로드
  const handleDownloadTemplate = async () => {
    try {
      const blob = await downloadExcelTemplate();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'excel_template.xlsx';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('엑셀 템플릿 다운로드 오류:', error);
      showToast('엑셀 템플릿 다운로드 중 오류가 발생했습니다.', 'error');
    }
  };

  // 파일 선택 핸들러
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setUploadFile(e.target.files[0]);
    }
  };

  // 엑셀 파일 업로드
  const handleUploadExcel = async () => {
    if (!uploadFile) {
      showToast('업로드할 파일을 선택해주세요.', 'error');
      return;
    }

    setIsUploading(true);
    try {
      const response = await uploadCustomersExcel(uploadFile);
      if (response.success && response.data) {
        showToast(
          `${response.data.length}명의 고객 정보가 성공적으로 업로드되었습니다.`,
          'success'
        );
        setIsUploadModalOpen(false);
        setUploadFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        // 고객 목록 새로고침
        loadCustomers();
      } else {
        showToast(response.message || '고객 정보 업로드에 실패했습니다.', 'error');
      }
    } catch (error) {
      console.error('고객 정보 업로드 오류:', error);
      showToast('고객 정보 업로드 중 오류가 발생했습니다.', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  // 테이블 컬럼 정의
  const columns = [
    {
      key: 'name',
      header: '이름',
      render: (customer: Customer) => (
        <div className="font-medium text-gray-900">{customer.name}</div>
      ),
    },
    {
      key: 'contact',
      header: '연락처',
      render: (customer: Customer) => (
        <div>
          <div>{formatPhoneNumber(customer.contact)}</div>
          <div className="text-gray-500 text-xs">{customer.email}</div>
        </div>
      ),
    },
    {
      key: 'demographic',
      header: '연령대',
      render: (customer: Customer) => (
        <div>
          <div>{customer.ageGroup ? `${customer.ageGroup}대` : '-'}</div>
          <div className="text-gray-500 text-xs">
            {customer.gender === 'M' ? '남성' : customer.gender === 'F' ? '여성' : '-'}
          </div>
        </div>
      ),
    },
    {
      key: 'actions',
      header: '관리',
      render: (customer: Customer) => (
        <div className="flex justify-end space-x-2">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Edit size={14} />}
            onClick={(e) => {
              e.stopPropagation(); // 행 클릭 이벤트 전파 방지
              handleEditCustomer(customer);
            }}
            className="text-blue-600 border-blue-300 hover:bg-blue-50"
          >
            수정
          </Button>
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Trash2 size={14} />}
            onClick={(e) => {
              e.stopPropagation(); // 행 클릭 이벤트 전파 방지
              handleDeleteCustomerClick(customer);
            }}
            className="text-red-600 border-red-300 hover:bg-red-50"
          >
            삭제
          </Button>
        </div>
      ),
      width: '200px',
    },
  ];

  // Calculate the range of customers being displayed
  const startIndex = (pagination.currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(pagination.currentPage * itemsPerPage, pagination.totalElements);

  return (
    <DashboardLayout>
      <div className="pb-5 border-b border-gray-200 sm:flex sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">고객 관리</h1>
        <div className="mt-3 sm:mt-0 sm:ml-4 flex flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            leftIcon={<RefreshCw size={16} />}
            onClick={async () => {
              setIsLoading(true);
              try {
                await loadCustomers();
                showToast('데이터가 성공적으로 새로고침되었습니다.', 'success');
              } catch (error) {
                console.error('새로고침 중 오류 발생:', error);
                showToast('새로고침에 실패했습니다.', 'error');
              } finally {
                setIsLoading(false);
              }
            }}
          >
            새로고침
          </Button>
          <Button
            variant="outline"
            leftIcon={<Download size={16} />}
            onClick={handleDownloadTemplate}
          >
            엑셀 양식 다운로드
          </Button>
          <Button
            variant="outline"
            leftIcon={<Upload size={16} />}
            onClick={() => setIsUploadModalOpen(true)}
          >
            엑셀 업로드
          </Button>
          <Button
            variant="primary"
            leftIcon={<Plus size={16} />}
            onClick={() => setIsAddModalOpen(true)}
          >
            신규 고객 등록
          </Button>
        </div>
      </div>

      <div className="mt-6">
        {/* 검색 폼 */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="space-y-4">
            {/* 기본 검색 필드 */}
            <div className="flex flex-col md:flex-row gap-4 items-end">
              <div className="flex-grow">
                <Input
                  label="키워드 검색"
                  id="keyword-search"
                  placeholder="이름, 이메일, 연락처로 검색"
                  value={filter.keyword}
                  onChange={(e) => setFilter((prev) => ({ ...prev, keyword: e.target.value }))}
                  onKeyDown={handleKeyPress}
                  leftIcon={<Search size={16} />}
                />
              </div>
              <div>
                <Button variant="primary" onClick={handleSearch} leftIcon={<Search size={16} />}>
                  검색
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <Table
            columns={columns}
            data={customers}
            keyExtractor={(item) => item.id.toString()}
            isLoading={isLoading}
            emptyMessage="검색 결과가 없습니다."
            onRowClick={handleViewCustomer}
          />

          {customers.length > 0 && (
            <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="hidden sm:block">
                <p className="text-sm text-gray-700">
                  총 <span className="font-medium">{pagination.totalElements}</span>명의 고객 중{' '}
                  <span className="font-medium">{startIndex}</span>-
                  <span className="font-medium">{endIndex}</span>명 표시
                </p>
              </div>
              <Pagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>
      </div>

      {/* 신규 고객 등록 모달 */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="신규 고객 등록"
        size="lg"
      >
        <CustomerForm
          onSubmit={(data: Partial<Customer>) => {
            // Partial<Customer> → CreateCustomerReqDto로 변환
            const requestData: CreateCustomerReqDto = {
              name: data.name || '',
              email: data.email || '',
              contact: data.contact || '',
              ageGroup: Number(data.ageGroup),
              gender: data.gender,
              memo: data.memo,
            };

            handleAddCustomer(requestData); // 변환된 데이터를 전달
          }}
          onCancel={() => setIsAddModalOpen(false)}
        />
      </Modal>

      {/* 고객 정보 수정 모달 */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="고객 정보 수정"
        size="lg"
      >
        {selectedCustomer && (
          <CustomerForm
            initialData={selectedCustomer}
            onSubmit={(data: Partial<Customer>) => {
              // 타입 변환 및 필수 필드 보장
              const requestData: CreateCustomerReqDto = {
                name: data.name || selectedCustomer.name,
                email: data.email || selectedCustomer.email,
                contact: data.contact || selectedCustomer.contact,
                ageGroup: data.ageGroup !== undefined ? Number(data.ageGroup) : undefined,
                gender: data.gender !== undefined ? data.gender : undefined,
                memo: data.memo !== undefined && data.memo !== '' ? data.memo : undefined,
              };

              handleUpdateCustomer(requestData);
            }}
            onCancel={() => setIsEditModalOpen(false)}
          />
        )}
      </Modal>

      {/* 고객 삭제 확인 모달 */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="고객 삭제"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-700">
            정말로 <span className="font-semibold">{selectedCustomer?.name}</span> 고객을
            삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
          </p>
          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
              취소
            </Button>
            <Button type="button" variant="danger" onClick={handleDeleteCustomer}>
              삭제
            </Button>
          </div>
        </div>
      </Modal>

      {/* 고객 상세 정보 모달 */}
      <CustomerDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        customer={selectedCustomer}
        onUpdate={handleUpdateCustomer}
      />

      {/* 엑셀 업로드 모달 */}
      <Modal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        title="고객 정보 엑셀 업로드"
        size="md"
      >
        <div className="space-y-4">
          <p className="text-gray-700">
            엑셀 파일을 통해 다수의 고객 정보를 한 번에 등록할 수 있습니다. 올바른 형식의 파일을
            업로드해주세요.
          </p>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">엑셀 파일 선택</label>
            <div className="flex items-center">
              <input
                type="file"
                ref={fileInputRef}
                accept=".xlsx, .xls"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100"
              />
            </div>
            {uploadFile && (
              <p className="mt-2 text-sm text-gray-600">선택된 파일: {uploadFile.name}</p>
            )}
          </div>

          <div className="mt-2 text-sm text-gray-500">
            <p>* 엑셀 파일은 .xlsx 또는 .xls 형식만 지원합니다.</p>
            <p>* 올바른 형식의 파일을 업로드하려면 먼저 엑셀 양식을 다운로드하여 사용하세요.</p>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsUploadModalOpen(false);
                setUploadFile(null);
                if (fileInputRef.current) {
                  fileInputRef.current.value = '';
                }
              }}
            >
              취소
            </Button>
            <Button
              type="button"
              variant="primary"
              onClick={handleUploadExcel}
              isLoading={isUploading}
              disabled={!uploadFile || isUploading}
            >
              업로드
            </Button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
};

export default CustomersPage;
