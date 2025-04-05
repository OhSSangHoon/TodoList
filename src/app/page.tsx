"use client";

import { useState, useEffect } from "react";
import { createItem, getItems } from "./services/api";

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
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    getItems(tenantId)
      .then((data) => {
        setTodos(data);
        setLoading(false);
      })
      .catch((err) => {
        setError("할 일 목록 불러오기 실패");
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
    } catch (error) {
      console.error(error);
      setError("할 일 추가 실패");
    }
  };

  // 완료 상태 토글
  const toggleTodo = (id: number) => {
    setTodos((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isCompleted: !item.isCompleted } : item
      )
    );
  };

  // 할 일 삭제
  const deleteTodo = (id: number) => {
    setTodos((prev) => prev.filter((item) => item.id !== id));
  };

  if (loading) return <div>로딩중...</div>;
  if (error) return <div>{error}</div>;

  // 완료 여부에 따라 할 일 리스트를 분리합니다.
  const pendingTodos = todos.filter((todo) => !todo.isCompleted);
  const completedTodos = todos.filter((todo) => todo.isCompleted);

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4">
        <h1 className="text-2xl font-bold mb-4">할 일 목록</h1>
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            className="border border-gray-300 rounded-md p-2 flex-grow"
            placeholder="새로운 할 일을 입력하세요"
          />
          <button onClick={addTodo} className="bg-blue-500 text-white px-4 py-2 rounded-md">
            추가
          </button>
        </div>
      </div>

      <div className="flex space-x-4">
        {/* 좌측: 진행 중인 할 일 */}
        <div className="w-1/2">
          <h2 className="text-xl font-semibold mb-2">진행 중</h2>
          <ul className="space-y-2">
            {pendingTodos.map((todo) => (
              <li key={todo.id} className="flex items-center justify-between p-2 border border-gray-200 rounded">
                <div className="flex items-center space-x-2">
                  <button onClick={() => toggleTodo(todo.id)}>
                    {todo.isCompleted ? "✅" : "⭕️"}
                  </button>
                  <span>{todo.name}</span>
                </div>
                <button onClick={() => deleteTodo(todo.id)} className="text-red-500">
                  삭제
                </button>
              </li>
            ))}
          </ul>
        </div>
        {/* 우측: 완료된 할 일 */}
        <div className="w-1/2">
          <h2 className="text-xl font-semibold mb-2">완료됨</h2>
          <ul className="space-y-2">
            {completedTodos.map((todo) => (
              <li key={todo.id} className="flex items-center justify-between p-2 border border-gray-200 rounded">
                <div className="flex items-center space-x-2">
                  <button onClick={() => toggleTodo(todo.id)}>
                    {todo.isCompleted ? "✅" : "⭕️"}
                  </button>
                  <span className="">{todo.name}</span>
                </div>
                <button onClick={() => deleteTodo(todo.id)} className="text-red-500">
                  삭제
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}