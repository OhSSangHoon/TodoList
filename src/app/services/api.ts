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
        throw new Error("Failed to create item");
    }
    return response.json();
}

// 할 일 목록 조회
export async function getItems(tenantId: string) {
    const url = `https://assignment-todolist-api.vercel.app/api/${tenantId}/items`;
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error("Failed to fetch items");
    }
    return response.json();
}