interface TableBodyProps extends React.HTMLAttributes<HTMLTableSectionElement> {
    children: React.ReactNode;
  }
  
  const TableBody = ({ children, className, ...props }: TableBodyProps) => {
    return (
      <tbody className={className} {...props}>
        {children}
      </tbody>
    );
  };
  
  export default TableBody;