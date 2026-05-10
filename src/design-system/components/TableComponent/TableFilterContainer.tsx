import React from "react";

interface TableFilterContainerProps {
    children: React.ReactNode;
}

const TableFilterContainer: React.FC<TableFilterContainerProps> = ({ children }) => {
    return (
        <div className="bg-bg-card border border-border rounded-2xl shadow-sm p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 items-end">
                {children}
            </div>
        </div>
    );
};

export default TableFilterContainer;
