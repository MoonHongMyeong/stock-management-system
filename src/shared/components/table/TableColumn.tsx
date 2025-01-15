interface TableColumnProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
    children: React.ReactNode;
  }
  
  const TableColumn = ({ children, className, ...props }: TableColumnProps) => {
    return (
      <th className={className} {...props}>
        {children}
      </th>
    );
  };
  
  export default TableColumn;