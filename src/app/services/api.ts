// 할 일 생성
export async function createItem(tenantId: string, name: string) {
    const url = `https://assignment-todolist-api.vercel.app/api/${tenantId}/items`;
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
    });
    if (!response.ok) {
        throw new Error("할 일 생성에 실패했습니다.");
    }
    return response.json();
}

// 할 일 목록 조회
export async function getItems(tenantId: string) {
    const url = `https://assignment-todolist-api.vercel.app/api/${tenantId}/items`;
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error("할 일 목록 조회에 실패했습니다.");
    }
    return response.json();
}


// 할 일 상세 조회
export async function getItemDetail(tenantId: string, itemId: number) {
    const url = `https://assignment-todolist-api.vercel.app/api/${tenantId}/items/${itemId}`;
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error("상세 조회에 실패했습니다.");
    }
    return response.json();
}

// 할 일 수정
export async function updateItem(
    tenantId: string,
    itemId: number,
    data: Partial<{ name: string, memo: string, imageUrl: string; isCompleted: boolean }>
) {
    const url = `https://assignment-todolist-api.vercel.app/api/${tenantId}/items/${itemId}`;
    const response = await fetch(url, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        throw new Error("수정에 실패했습니다.");
    }
    return response.json();
}

// 할 일 삭제
export async function deleteItem(tenantId: string, itemId: number) {
    const url = `https://assignment-todolist-api.vercel.app/api/${tenantId}/items/${itemId}`;
    const response = await fetch(url, {
        method: "DELETE",
    });
    if (!response.ok) {
        throw new Error("삭제에 실패했습니다.");
    }
    return response.json();
}

// 이미지 업로드
export async function uploadImage(tenantId: string, file: File) {
    const formData = new FormData();
    formData.append("image", file);
    const url = `https://assignment-todolist-api.vercel.app/api/${tenantId}/images/upload`;
    const response = await fetch(url, {
        method: "POST",
        body: formData,
    });
    if (!response.ok) {
        throw new Error("이미지 업로드에 실패했습니다.");
    }
    return response.json();
}