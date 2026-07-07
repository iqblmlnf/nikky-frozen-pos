import * as XLSX from "xlsx";

/**
 * Mengespor data array of objects ke dalam file Excel (.xlsx)
 * @param data Data yang ingin ekspor (array of objects)
 * @param fileName Nama file output (tanpa ekstensi .xlsx)
 */
export function exportToExcel(data: any[], fileName: string) {
  // Buat worksheet dari data JSON
  const worksheet = XLSX.utils.json_to_sheet(data);
  
  // Buat workbook baru
  const workbook = XLSX.utils.book_new();
  
  // Masukkan worksheet ke dalam workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, "Laporan");
  
  // Unduh file di browser
  XLSX.writeFile(workbook, `${fileName}.xlsx`);
}
