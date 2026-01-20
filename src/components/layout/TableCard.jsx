export default function TableCard({ title, rows, onEdit, onDelete }) {
  if (!rows || rows.length === 0) {
    return (
      <div className="card">
        <h3>{title}</h3>
        <p>No data found</p>
      </div>
    );
  }

  const columns = Object.keys(rows[0]).filter(
    key => key !== "id" && key !== "createdAt" && key !== "updatedAt"
  );

  return (
    <div className="card">
      <h3>{title}</h3>

      <table width="100%" border="1" cellPadding="8">
        <thead>
          <tr>
            {columns.map(col => (
              <th key={col}>
                {col.toUpperCase()}
              </th>
            ))}
            <th>ACTIONS</th>
          </tr>
        </thead>

        <tbody>
          {rows.map(row => (
            <tr key={row.id}>
              {columns.map(col => (
                <td key={col}>
                  {row[col] ?? "N/A"}
                </td>
              ))}
              <td>
                <button onClick={() => onEdit(row)}>Edit</button>
                <button onClick={() => onDelete(row.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
