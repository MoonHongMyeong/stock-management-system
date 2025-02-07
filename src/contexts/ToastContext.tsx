// 필요한 React 훅들과 Toast 컴포넌트를 임포트
import React, { createContext, useContext, useState, useCallback } from 'react';
import Toast from '../shared/components/common/toast/Toast';

// Toast 컨텍스트에서 사용할 타입 정의
// showToast 함수는 메시지와 타입(success/error/info/warn)을 받음
interface ToastContextType {
  showToast: (message: string, type?: 'success' | 'error' | 'info' | 'warn') => void;
}

// null을 기본값으로 가지는 ToastContext 생성
const ToastContext = createContext<ToastContextType | null>(null);

// Toast 기능을 제공하는 Provider 컴포넌트
export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  // toast 상태 관리: 표시 여부, 메시지, 타입을 포함
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: 'success' | 'error' | 'info' | 'warn';
  }>({
    show: false,
    message: '',
    type: 'success'
  });

  // Toast를 표시하는 함수 (메모이제이션된 콜백)
  // type 파라미터의 기본값은 'success'
  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' | 'warn' = 'success') => {
    setToast({ show: true, message, type });
  }, []);

  // Toast를 숨기는 함수 (메모이제이션된 콜백)
  const hideToast = useCallback(() => {
    setToast(prev => ({ ...prev, show: false }));
  }, []);

  // Context Provider와 Toast 컴포넌트 렌더링
  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* toast.show가 true일 때만 Toast 컴포넌트 렌더링 */}
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={hideToast}
        />
      )}
    </ToastContext.Provider>
  );
};

// Toast 기능을 사용하기 위한 커스텀 훅
export const useToast = () => {
  const context = useContext(ToastContext);
  // Provider 외부에서 사용될 경우 에러 발생
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}; 