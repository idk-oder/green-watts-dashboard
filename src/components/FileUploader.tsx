import { useState, useCallback, useRef } from "react";
import { Upload, FileSpreadsheet, Download, X, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { motion, AnimatePresence } from "framer-motion";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import { SAMPLE_CSV, type DatasetRow, analyzeDataset, type DatasetAnalysis } from "@/services/mockAI";
import { EMISSION_FACTOR, COST_PER_KWH } from "@/data/energy-data";
import { cn } from "@/lib/utils";

interface FileUploaderProps {
  onDataParsed: (rows: DatasetRow[], analysis: DatasetAnalysis) => void;
}

export function FileUploader({ onDataParsed }: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [rows, setRows] = useState<DatasetRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [parsed, setParsed] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const processData = useCallback(
    (rawRows: Record<string, string>[]) => {
      setError(null);
      try {
        const parsed: DatasetRow[] = [];
        for (const row of rawRows) {
          const time = row["Time"] || row["time"] || row["TIME"] || "";
          const appliance = row["Appliance"] || row["appliance"] || row["APPLIANCE"] || "";
          const energy =
            parseFloat(row["Energy_kWh"] || row["energy_kwh"] || row["Energy"] || row["energy"] || row["kWh"] || "0");

          if (time && appliance && !isNaN(energy) && energy > 0) {
            parsed.push({ time: time.trim(), appliance: appliance.trim(), energy_kwh: energy });
          }
        }

        if (parsed.length === 0) {
          setError("No valid data rows found. Expected columns: Time, Appliance, Energy_kWh");
          return;
        }

        setRows(parsed);
        setParsed(true);
        const analysis = analyzeDataset(parsed);
        onDataParsed(parsed, analysis);
      } catch (e) {
        setError("Failed to parse data. Please check the file format.");
      }
    },
    [onDataParsed]
  );

  const handleFile = useCallback(
    (file: File) => {
      setError(null);
      setParsed(false);
      setRows([]);

      const ext = file.name.split(".").pop()?.toLowerCase();
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        setError("File too large. Maximum size is 10MB.");
        return;
      }

      setFileName(file.name);

      if (ext === "csv") {
        Papa.parse(file, {
          header: true,
          skipEmptyLines: true,
          complete: (result) => processData(result.data as Record<string, string>[]),
          error: () => setError("Failed to parse CSV file."),
        });
      } else if (ext === "xls" || ext === "xlsx") {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const wb = XLSX.read(e.target?.result, { type: "binary" });
            const sheet = wb.Sheets[wb.SheetNames[0]];
            const data = XLSX.utils.sheet_to_json(sheet) as Record<string, string>[];
            processData(data);
          } catch {
            setError("Failed to parse Excel file.");
          }
        };
        reader.readAsBinaryString(file);
      } else {
        setError("Unsupported file format. Please upload .csv, .xls, or .xlsx files.");
      }
    },
    [processData]
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const downloadSample = () => {
    const blob = new Blob([SAMPLE_CSV], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sample_energy_data.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearFile = () => {
    setFileName(null);
    setRows([]);
    setError(null);
    setParsed(false);
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <div className="space-y-4">
      {/* Drop zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        onClick={() => fileRef.current?.click()}
        className={cn(
          "relative flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-8 cursor-pointer transition-all",
          isDragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/40 hover:bg-card/80",
          parsed && "border-primary/30 bg-primary/5"
        )}
      >
        <input
          ref={fileRef}
          type="file"
          accept=".csv,.xls,.xlsx"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
        />
        {parsed ? (
          <CheckCircle2 className="h-10 w-10 text-primary" />
        ) : (
          <Upload className={cn("h-10 w-10", isDragging ? "text-primary" : "text-muted-foreground")} />
        )}
        <div className="text-center">
          {fileName ? (
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">{fileName}</span>
              <button onClick={(e) => { e.stopPropagation(); clearFile(); }} className="text-muted-foreground hover:text-destructive">
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <>
              <p className="text-sm font-medium">
                {isDragging ? "Drop your file here" : "Drag & drop your energy dataset"}
              </p>
              <p className="text-xs text-muted-foreground mt-1">Supports CSV, XLS, XLSX (max 10MB)</p>
            </>
          )}
        </div>
      </div>

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex items-center gap-2 text-destructive text-sm bg-destructive/10 rounded-lg p-3">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sample download */}
      <Button variant="outline" size="sm" onClick={downloadSample} className="w-full">
        <Download className="h-4 w-4 mr-2" /> Download sample dataset
      </Button>

      {/* Data preview */}
      {rows.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <CardHeader className="py-3 px-4">
              <CardTitle className="text-sm flex items-center justify-between">
                <span>Data Preview ({rows.length} rows)</span>
                <span className="text-xs font-normal text-muted-foreground">
                  Total: {rows.reduce((s, r) => s + r.energy_kwh, 0).toFixed(1)} kWh
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-3">
              <div className="max-h-48 overflow-auto rounded border border-border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs">Time</TableHead>
                      <TableHead className="text-xs">Appliance</TableHead>
                      <TableHead className="text-xs text-right">Energy (kWh)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rows.slice(0, 20).map((r, i) => (
                      <TableRow key={i}>
                        <TableCell className="text-xs font-mono py-1.5">{r.time}</TableCell>
                        <TableCell className="text-xs py-1.5">{r.appliance}</TableCell>
                        <TableCell className="text-xs text-right font-mono py-1.5">{r.energy_kwh.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                    {rows.length > 20 && (
                      <TableRow>
                        <TableCell colSpan={3} className="text-xs text-center text-muted-foreground py-1.5">
                          ...and {rows.length - 20} more rows
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
