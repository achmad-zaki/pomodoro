export const deleteTask = async (
  id: string
): Promise<{ success: boolean; message: string }> => {
  const response = await fetch(`/api/tasks/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Terjadi kesalahan saat menghapus tugas");
  }

  return response.json();
};
