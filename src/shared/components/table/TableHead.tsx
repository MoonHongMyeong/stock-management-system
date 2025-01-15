interface TableHeadProps extends React.HTMLAttributes<HTMLTableSectionElement> {
    children: React.ReactNode;
  }
  
  const TableHead = ({ children, className, ...props }: TableHeadProps) => {
    return (
      <thead className={className} {...props}>
        {children}
      </thead>
    );
  };
  
  export default TableHead;