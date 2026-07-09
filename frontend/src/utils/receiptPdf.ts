import jsPDF from "jspdf";

export const generateReceiptPDF = (sale: any) => {
  const width = 80; // 80mm width standard thermal paper
  const itemsCount = sale.items?.length ?? 0;
  
  // Calculate dynamic page height based on number of items
  const cashDetailsHeight = sale.cash_received ? 12 : 0;
  const height = 45 + (itemsCount * 9) + 28 + cashDetailsHeight + 25;

  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: [width, height],
  });

  const marginX = 5;
  const rightX = width - marginX;
  const centerX = width / 2;

  let y = 10;

  // Header Title
  doc.setFont("courier", "bold");
  doc.setFontSize(11);
  doc.text("NIKKY FROZEN", centerX, y, { align: "center" });
  
  y += 5;
  doc.setFont("courier", "normal");
  doc.setFontSize(8);
  doc.text("Pusat Makanan Beku & Segar", centerX, y, { align: "center" });
  
  y += 4;
  doc.text("Jl. Raya Frozen No. 99, Surabaya", centerX, y, { align: "center" });
  
  y += 4;
  doc.text("Telp: 0812-3456-7890", centerX, y, { align: "center" });

  y += 4;
  doc.text("==========================================", centerX, y, { align: "center" });

  y += 4;
  doc.text(`Tgl   : ${new Date(sale.created_at).toLocaleString("id-ID")}`, marginX, y);
  
  y += 4;
  doc.text(`Kasir : ${sale.user?.name ?? "-"}`, marginX, y);
  
  y += 4;
  doc.text(`No.   : ${sale.invoice_number}`, marginX, y);

  y += 4;
  doc.text("==========================================", centerX, y, { align: "center" });

  // List Items
  y += 4;
  sale.items?.forEach((item: any) => {
    doc.setFont("courier", "bold");
    const name = item.product?.name ?? "Produk";
    // Truncate name if too long to fit receipt width
    const displayName = name.length > 28 ? name.substring(0, 25) + "..." : name;
    doc.text(displayName, marginX, y);
    
    y += 4;
    doc.setFont("courier", "normal");
    const qtyPrice = `  ${item.qty} x ${new Intl.NumberFormat("id-ID").format(item.price)}`;
    const subtotalText = new Intl.NumberFormat("id-ID").format(item.qty * item.price);
    doc.text(qtyPrice, marginX, y);
    doc.text(subtotalText, rightX, y, { align: "right" });
    
    y += 5;
  });

  doc.setFont("courier", "normal");
  doc.text("------------------------------------------", centerX, y, { align: "center" });

  y += 4;
  doc.setFont("courier", "bold");
  doc.text("Total Belanja", marginX, y);
  doc.text(new Intl.NumberFormat("id-ID").format(sale.total), rightX, y, { align: "right" });

  y += 4;
  doc.setFont("courier", "normal");
  doc.text("Metode Bayar", marginX, y);
  doc.text(sale.payment_method, rightX, y, { align: "right" });

  if (sale.cash_received) {
    y += 4;
    doc.text("Uang Tunai", marginX, y);
    doc.text(new Intl.NumberFormat("id-ID").format(sale.cash_received), rightX, y, { align: "right" });

    y += 4;
    doc.setFont("courier", "bold");
    doc.text("Kembalian", marginX, y);
    doc.text(new Intl.NumberFormat("id-ID").format(sale.change), rightX, y, { align: "right" });
  }

  y += 5;
  doc.setFont("courier", "normal");
  doc.text("==========================================", centerX, y, { align: "center" });

  y += 5;
  doc.setFont("courier", "bold");
  doc.text("TERIMA KASIH ATAS KUNJUNGAN ANDA", centerX, y, { align: "center" });

  y += 4;
  doc.setFont("courier", "normal");
  doc.setFontSize(7);
  doc.text("Barang yang sudah dibeli tidak dapat ditukar", centerX, y, { align: "center" });
  
  y += 4;
  doc.text("Layanan Konsumen: 0812-3456-7890", centerX, y, { align: "center" });

  doc.save(`${sale.invoice_number}.pdf`);
};
