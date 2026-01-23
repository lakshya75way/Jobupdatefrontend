import { Table as AntTable, TableProps } from "antd";
import styles from "./Table.module.css";
function Table<T extends object>(props: TableProps<T>) {
  return (
    <div className={styles.tableWrapper}>
      <AntTable
        {...props}
        className={`${styles.customTable} ${props.className || ""}`}
        pagination={
          props.pagination === false
            ? false
            : {
                ...props.pagination,
                showSizeChanger: true,
                style: { marginTop: 24 },
              }
        }
      />
    </div>
  );
}
export default Table;
