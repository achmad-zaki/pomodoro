export const deleteTask = async (
  id: string
): Promise<{ success: boolean; message: string }> => {
  const response = await fetch(`/api/tasks/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || "Terjadi kesalahan saat menghapus tugas");
  }

  return data;
};
