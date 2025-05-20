
export function exportTableToCSV<T>(filename: string, rows: T[], columns: { label: string; key: keyof T }[], clientName, patientName, staffName) {
  if (!rows.length) return;

  const csvHeader1 = [`CLIENT,${clientName},Conditions`];
  const csvHeader2 = [`PATIENT,${patientName}`];
  const csvHeader3 = [`STAFF,${staffName}`];
  const csvHeader4 = [];
  const csvHeader5 = ['FORM,BillingTime']

  const csvRows = rows.map(row =>
    columns
      .map(col => {
        const value = row[col.key] ?? '';
        // Ensure left alignment by adding a non-breaking space (or any character you prefer)
        return value
      })
      .join(',')
  );

  const csvContent = [
    ...csvHeader1,
    ...csvHeader2,
    ...csvHeader3,
    csvHeader4,
    ...csvHeader5,
    ...csvRows
  ].join('\r\n');

  console.log(csvContent)
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}


export function exportTableToCSVForAdmin<T>(filename: string, rows: T[], columns: { label: string; key: keyof T }[], clientName, patientName, staffName) {
  if (!rows.length) return;

  const csvHeader1 = [`CLIENT,${clientName}`];
  const csvHeader2 = [`PATIENT,${patientName}`];
  const csvHeader3 = [`STAFF,${staffName}`];
  const csvHeader4 = [];
  const csvHeader5 = ['FORM,Staff,BillingTime,Conditions']

  const csvRows = rows.map(row =>
    columns
      .map(col => {
        const value = row[col.key] ?? '';
        // Ensure left alignment by adding a non-breaking space (or any character you prefer)
        return value
      })
      .join(',')
  );

  const csvContent = [
    ...csvHeader1,
    ...csvHeader2,
    ...csvHeader3,
    csvHeader4,
    ...csvHeader5,
    ...csvRows
  ].join('\r\n');

  console.log(csvContent)
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

