"use client";

import { useState, useEffect } from "react";
import { createItem, getItems, updateItem } from "./services/api";
import Link from "next/link";

interface TodoItem {
  id: number;
  name: string;          // 할 일 내용
  isCompleted: boolean;  // 완료 여부
}

export default function Home() {
  const tenantId = "sanghun";
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [newTodo, setNewTodo] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    getItems(tenantId)
      .then((data) => {
        setTodos(data);
        setLoading(false);
      })
      .catch((_error: unknown) => {
        setError(_error instanceof Error ? _error.message : "할 일 목록 불러오기 실패");
        setLoading(false);
      });
  }, [tenantId]);

  // 새로운 할 일 추가
  const addTodo = async () => {
    if (!newTodo.trim()) return;
    try {
      const newItem = await createItem(tenantId, newTodo);
      setTodos((prev) => [...prev, newItem]);
      setNewTodo("");
    } catch (_error: unknown) {
      console.error(_error);
      setError(_error instanceof Error ? _error.message : "할 일 추가 실패");
    }
  };

  // 완료 상태 토글
  const toggleTodo = async (id: number) => {
    try {
      setTodos((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, isCompleted: !item.isCompleted } : item
        )
      );
      const todo = todos.find((item) => item.id === id);
      if (!todo) return;
      const newStatus = !todo.isCompleted;
      await updateItem(tenantId, id, { name: todo.name, isCompleted: newStatus });
    } catch (_error: unknown) {
      console.error(_error);
      // 오류 발생 시 완료 상태 변경 취소
      setTodos((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, isCompleted: !item.isCompleted } : item
        )
      );
      setError(_error instanceof Error ? _error.message : "완료 상태 변경 실패");
    }
  };

  if (loading) return <div>로딩중...</div>;
  if (error) return <div>{error}</div>;

  // 완료 여부에 따라 할 일 리스트를 분리합니다.
  const pendingTodos = todos.filter((todo) => !todo.isCompleted);
  const completedTodos = todos.filter((todo) => todo.isCompleted);

  return (
    <div className="mx-auto mt-10 w-full max-w-[375px] sm:max-w-[744px] lg:max-w-[75rem] p-4">
      {/* 입력 영역 */}
      <div className="mb-4">
        <div className="flex flex-nowrap md:flex-row items-stretch gap-4">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                addTodo();
              }
            }}
            className="border border-gray-300 p-2 flex-grow h-14 rounded-4xl pl-6 placeholder:text-[#64748B] bg-[#F1F5F9]"
            placeholder="할 일을 입력해주세요"
          />
          <button 
            onClick={addTodo} 
            className={`h-14 rounded-4xl font-medium ${newTodo.trim() ? "bg-[#7C3AED] text-white" : "bg-[#E2E8F0]"} w-[56px] sm:w-auto sm:px-12`}
          >
            <span className="block sm:hidden text-2xl">+</span>
            <span className="hidden sm:block">+ 추가하기</span>
          </button>
        </div>
      </div>

      {/* 할 일 목록 영역 */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* 진행 중인 할 일 */}
        <div className="w-full md:w-1/2">
          <div className="flex items-center justify-center rounded-3xl bg-[#BEF264] p-2 w-1/4 h-10 my-4">
            <h2 className="text-sm md:text-l text-[#15803D] font-black">TO DO</h2>
          </div>
          {pendingTodos.length > 0 ? (
            <ul className="space-y-2">
              {pendingTodos.map((todo) => (
                <li
                  key={todo.id}
                  className="flex items-center justify-between p-2 border-2 border-black rounded-full h-12"
                >
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 border-2 border-black rounded-full bg-[#FEFCE8]">
                      <input
                        type="checkbox"
                        name="status"
                        checked={todo.isCompleted}
                        onChange={() => toggleTodo(todo.id)}
                        className="opacity-0 w-5 h-5"
                      />
                    </div>
                    <Link href={`/detail/${todo.id}`}>
                      <p className="cursor-pointer text-sm md:text-base">
                        {todo.name}
                      </p>
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="w-full h-[20rem] bg-[url('/empty2.png')] bg-no-repeat bg-center bg-contain" />
          )}
        </div>

        {/* 완료된 할 일 */}
        <div className="w-full md:w-1/2">
          <div className="flex items-center justify-center rounded-3xl bg-[#15803D] p-2 w-1/4 h-10 my-4">
            <h2 className="text-sm md:text-l text-[#FCD34D] font-black">DONE</h2>
          </div>
          {completedTodos.length > 0 ? (
            <ul className="space-y-2">
              {completedTodos.map((todo) => (
                <li
                  key={todo.id}
                  className="flex items-center justify-between p-2 border-2 border-black rounded-full h-12"
                >
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 rounded-full bg-[#7C3AED] flex items-center justify-center">
                      <input
                        type="checkbox"
                        name="status"
                        checked={todo.isCompleted}
                        onChange={() => toggleTodo(todo.id)}
                        className="opacity-0 w-5 h-5"
                      />
                      <div className="absolute pointer-events-none">
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 14 14"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M11.6666 3.5L5.24992 9.91667L2.33325 7"
                            stroke="white"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    </div>
                    <Link href={`/detail/${todo.id}`}>
                      <p className="cursor-pointer text-sm md:text-base line-through">
                        {todo.name}
                      </p>
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="w-full h-[20rem] bg-[url('/empty.png')] bg-no-repeat bg-center bg-contain" />
          )}
        </div>
      </div>
    </div>
  );
}