import './Table.css';

interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {
  children: React.ReactNode;
}

const Table = ({ children, className, ...props }: TableProps) => {
  return (
    <div className="table-container">
      <table className={`table ${className || ''}`} {...props}>
        {children}
      </table>
    </div>
  );
};

export default Table;
