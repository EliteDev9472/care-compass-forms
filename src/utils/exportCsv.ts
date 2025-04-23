
export function exportTableToCSV<T>(filename: string, rows: T[], columns: { label: string; key: keyof T }[]) {
  if (!rows.length) return;

  const csvHeader = columns.map(col => `"${col.label}"`).join(',');
  const csvRows = rows.map(row =>
    columns
      .map(col => {
        const value = row[col.key] ?? '';
        // Escape quotes for CSV
        return `"${String(value).replace(/"/g, '""')}"`
      })
      .join(',')
  );
  const csvContent = [csvHeader, ...csvRows].join('\r\n');

  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
