import { Button } from "@/src/design-system/components/button/Button";
import { Download } from "lucide-react";
import { CSVLink } from "react-csv";

interface ExportCSVProps {
  exportData: any[];
  filename?: string;
}

const ExportCSV: React.FC<ExportCSVProps> = ({ exportData, filename = "" }) => {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-text-secondary">Export</label>

      <div className="flex items-center gap-2">

        <CSVLink data={exportData} filename={filename}>
          <Button variant="outline" className="w-full" size="lg">
            <div className="bg-primary text-white rounded-full p-2 hover:bg-primary/90">
              <Download size={20} />
            </div>
            CSV
          </Button>
        </CSVLink>
      </div>
    </div>

  );
};

export default ExportCSV;
