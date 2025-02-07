interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
    children: React.ReactNode;
    isHeader?: boolean;
  }
  
  const TableCell = ({ children, className, ...props }: TableCellProps) => {
    return (
      <td className={className} {...props}>
        {children}
      </td>
    );
  };
  
  export default TableCell;