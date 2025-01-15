interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
    children: React.ReactNode;
    isHeader?: boolean;
  }
  
  const TableRow = ({ children, className, ...props }: TableRowProps) => {
    return (
      <tr className={className} {...props}>
        {children}
      </tr>
    );
  };
  
  export default TableRow;