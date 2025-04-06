"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { deleteItem, getItemDetail, updateItem, uploadImage } from "../../services/api";

interface TodoDetail {
    id: number;
    tenantId: string;
    name: string;
    memo: string;
    imageUrl: string;
    isCompleted: boolean;
}

export default function DetailPage() {
    const { id } = useParams();
    const tenantId = "sanghun";
    const router = useRouter();

  const [item, setItem] = useState<TodoDetail | null>(null);
  const [name, setName] = useState("");
  const [memo, setMemo] = useState("");
  const [isCompleted, setIsCompleted] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // 동적 입력 필드 관련 참조
  const inputRef = useRef<HTMLInputElement>(null);
  const measureRef = useRef<HTMLSpanElement>(null);

  // 입력 내용의 너비를 측정하는 함수
  const adjustWidth = () => {
    if (inputRef.current && measureRef.current) {
      // 텍스트 내용의 실제 너비 측정을 위한 span 업데이트
      measureRef.current.textContent = name || '';
      
      // 측정된 너비에 약간의 여유 공간 추가 (20px)
      const width = Math.max(measureRef.current.offsetWidth + 20, 160);
      inputRef.current.style.width = `${width}px`;
    }
  };

  // 입력 값이 변경될 때마다 너비 조정
  useEffect(() => {
    adjustWidth();
  }, [name]);

  // 컴포넌트 마운트 후 초기 조정
  useEffect(() => {
    if (name) {
      adjustWidth();
    }
    // 창 크기 변경 시에도 조정
    window.addEventListener('resize', adjustWidth);
    return () => window.removeEventListener('resize', adjustWidth);
  }, [name]);

  // 상세 조회
  useEffect(() => {
    async function fetchDetail() {
      setLoading(true);
      try {
        const data: TodoDetail = await getItemDetail(tenantId, Number(id));
        setItem(data);
        setName(data.name);
        setMemo(data.memo || ""); // 메모가 없는 경우 빈 문자열로 초기화
        setIsCompleted(data.isCompleted);
        setImagePreview(data.imageUrl || ""); // 이미지 URL이 없는 경우 빈 문자열로 초기화
      } catch (_error: unknown) {
        setError(_error instanceof Error ? _error.message : "상세 정보를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchDetail();
  }, [id, tenantId]);

  // 이미지 파일 선택 및 미리보기 핸들러
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const fileNameWithoutExt = file.name.split(".")[0];
      if (!/^[A-Za-z0-9_-]+$/.test(fileNameWithoutExt)) {
        setError("파일 이름은 영어로만 작성되어야 합니다.");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError("파일 크기는 5MB 이하여야 합니다.");
        return;
      }
      setImageFile(file);
      // 미리보기 설정
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // 항목 수정 및 이미지 업로드
  const handleUpdate = async () => {
    setLoading(true);
    try {
      let newImageUrl = imagePreview; // 기존 이미지 URL 유지
      if (imageFile) {
        const uploadData = await uploadImage(tenantId, imageFile);
        newImageUrl = uploadData.url;
      }
      const updatePayload = {
        name,
        memo,
        imageUrl: newImageUrl,
        isCompleted,
      };
      await updateItem(tenantId, Number(id), updatePayload);
      // 수정 완료 후 목록 페이지로 이동
      router.push("/");
    } catch (_error: unknown) {
      setError(_error instanceof Error ? _error.message : "업데이트에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 항목 삭제
  const handleDelete = async () => {
    try {
        await deleteItem(tenantId, Number(id));
        router.push("/");
    } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "삭제에 실패했습니다.");
    } finally {
        setLoading(false);
    }
  };

  if (loading) return <div>로딩중...</div>;
  if (error) return <div>오류: {error}</div>;
  if (!item) return <div>항목 정보를 불러올 수 없습니다.</div>;

  return (
    <div className="w-full max-w-5xl mx-auto p-4 bg-white h-screen">
        <div className="mb-4">
            <div className={`flex items-center justify-center w-full border-2 border-black rounded-3xl overflow-hidden 
            border_1px ${isCompleted ? 'bg-[#DDD6FE]' : ''}`}>
                <div className="flex items-center justify-center gap-4">
                    <label className="flex items-center justify-center w-6 h-6 relative cursor-pointer">
                        <input
                            type="checkbox"
                            name="status" 
                            checked={isCompleted}
                            onChange={() => setIsCompleted(!isCompleted)}
                            className="absolute w-full h-full opacity-0 cursor-pointer z-20"
                        />
                        {isCompleted ? (
                            <div className="w-5 h-5 rounded-full border-2 border-[#7C3AED] bg-[#7C3AED] flex items-center justify-center pointer-events-none">
                            {/* 체크박스 아이콘 */}
                            <svg 
                                className="w-3 h-3 text-white pointer-events-none" 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24" 
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth="3" 
                                d="M5 13l4 4L19 7"
                                />
                            </svg>
                            </div>
                        ) : (
                            <div className="w-5 h-5 rounded-full border-2 border-black bg-[#FEFCE8] pointer-events-none">
                            </div>
                        )}
                    </label>
                    <div className="relative">
                        <input
                            ref={inputRef}
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="underline p-2 text-2xl focus:outline-none"
                        />
                        <span
                            ref={measureRef}
                            className="absolute opacity-0 text-2xl whitespace-pre"
                            style={{ 
                            top: '-9999px', 
                            left: '-9999px',
                            font: inputRef.current ? window.getComputedStyle(inputRef.current).font : 'inherit' }}
                        >
                            {name || ''}
                        </span>
                    </div>
                </div>
            </div>
        </div>

        {/* 이미지 업로드 미리보기 섹션 */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="w-full md:w-2/5 h-[315px] border-2 border-dashed border-gray-300 rounded-3xl relative overflow-hidden">
                <label className="absolute bottom-2 right-2 z-10">
                    <div className="relative">
                        <input 
                            type="file" 
                            accept="image/*" 
                            onChange={handleImageChange}
                            className="absolute w-16 h-16 z-10 opacity-0 cursor-pointer" 
                        />
                        <img 
                            src={imagePreview ? "/Type=Edit.svg" : "/Type=Plus.svg"}
                            alt="이미지 업로드 버튼"
                            className="w-16 h-16"
                        />
                    </div>
                </label>
                {imagePreview ? (
                    <div className="w-full h-full">
                        <img src={imagePreview} alt="이미지 미리보기" className="w-full h-full object-cover"/>
                    </div> 
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-[#F8FAFC]">
                        <img src="/img.svg" alt="기본 이미지" className="w-16 h-16"/>
                    </div>
                )}
            </div>

            {/* 메모 섹션 */}
            <div className="w-full md:w-2/3 relative h-[311px]">
                <div className="w-full h-full absolute inset-0 bg-[url('/memo.svg')] bg-no-repeat bg-cover rounded-3xl z-0">
                    <p className="w-full flex justify-center text-xl text-[#92400E] font-semibold pt-4">
                        Memo
                    </p>
                    <div className="w-full h-[calc(100%-4rem)] p-4">
                        <textarea
                            value={memo ?? ""} 
                            onChange={(e) => setMemo(e.target.value)}
                            className="w-full h-full focus:outline-none resize-none text-[#1E293B] text-lg"
                        />
                    </div>
                </div>
            </div>
        </div>

        {/* 수정 / 삭제 버튼 */}
        <div className="flex justify-center md:justify-end gap-4 mt-4">
            <button onClick={handleUpdate} className="bg-[#BEF264] text-black font-semibold px-4 py-4 rounded-4xl w-[10rem] cursor-pointer">
                √ 수정 완료
            </button>
            <button onClick={handleDelete} className="bg-[#F43F5E] text-white font-semibold px-4 py-4 rounded-4xl w-[10rem] cursor-pointer">
                X 삭제하기
            </button>
        </div>
    </div>
  );
}