'use client';

export function ProductTableHeader() {
  const TABLE_STYLES = {
    headerCell:
      'px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider',
  };
  return (
    <thead className='bg-card border-b border-border'>
      <tr>
        <th className={`${TABLE_STYLES.headerCell} w-8`}>{/* Expand/Collapse */}</th>
        <th className={`${TABLE_STYLES.headerCell} w-16`}>ID</th>
        <th className={TABLE_STYLES.headerCell}>Product</th>
        <th className={TABLE_STYLES.headerCell}>Status</th>
        <th className={TABLE_STYLES.headerCell}>Last Run</th>
        <th className={TABLE_STYLES.headerCell}>Enabled</th>
      </tr>
    </thead>
  );
}
