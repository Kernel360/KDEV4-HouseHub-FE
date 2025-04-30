'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { EventSourcePolyfill } from 'event-source-polyfill';
import { NotificationEvent } from '../types/notification';
import { useAuth } from '../context/useAuth';

interface UseSSEOptions {
  url: string;
  onMessage: (event: MessageEvent) => void;
  onError?: (error: Event) => void;
  onOpen?: (event: Event) => void;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
  headers?: Record<string, string>;
  withCredentials?: boolean;
}

const useSSE = ({
  url,
  onMessage,
  onError,
  onOpen,
  reconnectInterval = 20000,
  maxReconnectAttempts = 5,
  headers = {},
  withCredentials = true,
}: UseSSEOptions) => {
  const { user } = useAuth();
  const userId = user?.id;
  const [isConnected, setIsConnected] = useState(false);
  const reconnectAttemptsRef = useRef(0);
  const eventSourceRef = useRef<EventSourcePolyfill | null>(null);
  const reconnectTimeoutRef = useRef<number | null>(null);
  const bcRef = useRef<BroadcastChannel | null>(null);
  const isLeaderRef = useRef(false);

  const connect = useCallback(() => {
    if (!userId || eventSourceRef.current || isConnected) return;

    const eventSource = new EventSourcePolyfill(url, {
      headers,
      withCredentials,
    });

    eventSourceRef.current = eventSource;

    eventSource.onopen = (event) => {
      setIsConnected(true);
      reconnectAttemptsRef.current = 0;
      onOpen?.(event as unknown as Event);
    };

    eventSource.onmessage = (event) => {
      onMessage(event as MessageEvent<NotificationEvent>);
    };

    eventSource.onerror = (event) => {
      setIsConnected(false);
      eventSource.close();
      eventSourceRef.current = null;

      onError?.(event);

      if (reconnectAttemptsRef.current < maxReconnectAttempts) {
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
        }

        reconnectTimeoutRef.current = window.setTimeout(() => {
          reconnectAttemptsRef.current += 1;
          connect();
        }, reconnectInterval);
      }
    };
  }, [
    url,
    onMessage,
    onError,
    onOpen,
    reconnectInterval,
    maxReconnectAttempts,
    headers,
    withCredentials,
    userId,
    isConnected,
  ]);

  const disconnect = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }

    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    setIsConnected(false);
  }, []);

  const requestLeadership = useCallback(() => {
    if (!userId) return;

    if (document.visibilityState !== 'visible') return;

    // 리더가 아니면 브로드캐스트로 리더 요청
    bcRef.current?.postMessage('sse-request');

    // 약간의 지연 후 리더가 없는 경우 내가 맡음
    setTimeout(() => {
      if (!isLeaderRef.current) {
        isLeaderRef.current = true;
        connect();
      }
    }, 100);
  }, [userId, connect]);

  const handleVisibilityChange = useCallback(() => {
    if (document.visibilityState === 'visible') {
      requestLeadership();
    } else {
      if (isLeaderRef.current) {
        bcRef.current?.postMessage('sse-release');
        isLeaderRef.current = false;
        disconnect();
      }
    }
  }, [disconnect, requestLeadership]);

  // 초기 브로드캐스트 채널 설정 및 이벤트 리스너 등록
  useEffect(() => {
    bcRef.current = new BroadcastChannel('sse_channel');

    bcRef.current.onmessage = (event) => {
      const data = event.data;

      if (data === 'sse-request') {
        if (isLeaderRef.current) {
          bcRef.current?.postMessage('sse-taken');
        }
      }

      if (data === 'sse-taken') {
        if (!isLeaderRef.current) {
          disconnect(); // 다른 탭이 리더니까 연결 끊음
        }
      }

      if (data === 'sse-release') {
        requestLeadership();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      bcRef.current?.close();

      if (isLeaderRef.current) {
        bcRef.current?.postMessage('sse-release');
        isLeaderRef.current = false;
        disconnect();
      }
    };
  }, [disconnect, handleVisibilityChange, requestLeadership]);

  // userId가 생긴 후에 리더 시도
  useEffect(() => {
    if (userId && document.visibilityState === 'visible') {
      requestLeadership();
    }
  }, [userId, requestLeadership]);

  return {
    isConnected,
    reconnectAttempts: reconnectAttemptsRef.current,
    connect,
    disconnect,
  };
};

export default useSSE;
