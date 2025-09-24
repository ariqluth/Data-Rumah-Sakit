import { useRef, useState } from "react";

import { Download, FileJson, FileSpreadsheet, UploadCloud } from "lucide-react";
import * as XLSX from "xlsx";

import { toISODate } from "../utils/date";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";

const mapColumns = (row) => {
  const pick = (keys, fallback = "") => {
    for (const key of keys) {
      if (row[key] !== undefined && row[key] !== null && `${row[key]}`.trim() !== "") {
        return row[key];
      }
    }
    return fallback;
  };

  const normalizeDate = (value) => {
    if (!value) return null;
    if (value instanceof Date) {
      return toISODate(value);
    }
    if (typeof value === "number") {
      const date = XLSX.SSF.parse_date_code(value);
      if (date) {
        const jsDate = new Date(Date.UTC(date.y, date.m - 1, date.d));
        return toISODate(jsDate);
      }
    }
    return toISODate(value);
  };

  const name = pick(["name", "Name", "nama", "Nama"]);
  const visit = normalizeDate(pick(["tanggal_kunjungan", "TanggalKunjungan", "tanggal kunjungan", "Tanggal Kunjungan", "visit", "visit_date", "Visit Date"]));
  const birth = normalizeDate(pick(["tanggal_lahir", "TanggalLahir", "tanggal lahir", "Tanggal Lahir", "birth", "birth_date", "Birth Date"])) || visit;
  const diagnosis = pick(["diagnosis", "Diagnosis"], "Belum ada diagnosis");
  const tindakan = pick(["tindakan", "Tindakan", "treatment", "Treatment"], "Belum ada tindakan");
  const dokter = pick(["dokter", "Dokter", "doctor", "Doctor"], "Belum ditugaskan");

  if (!name || !visit) {
    return null;
  }

  return {
    name: `${name}`.trim(),
    tanggal_kunjungan: visit,
    tanggal_lahir: birth ?? visit,
    diagnosis: `${diagnosis}`.trim() || "Belum ada diagnosis",
    tindakan: `${tindakan}`.trim() || "Belum ada tindakan",
    dokter: `${dokter}`.trim() || "Belum ditugaskan",
  };
};

const DataActionsCard = ({ onExport, onImport }) => {
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const jsonInputRef = useRef(null);
  const excelInputRef = useRef(null);

  const handleImportPayload = async (patients) => {
    if (!patients.length) {
      setError("Data kosong atau format tidak dikenali");
      return;
    }
    setProcessing(true);
    setError(null);
    try {
      await onImport({ patients });
    } catch (err) {
      setError(err?.message ?? "Gagal mengimpor data");
    } finally {
      setProcessing(false);
    }
  };

  const handleJsonFile = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      if (!Array.isArray(parsed)) {
        throw new Error("JSON harus berupa array pasien");
      }
      const patients = parsed
        .map((row) => (typeof row === "object" ? mapColumns(row) : null))
        .filter(Boolean);
      await handleImportPayload(patients);
    } catch (err) {
      setError(err?.message ?? "JSON tidak valid");
    }
  };

  const handleExcelFile = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    try {
      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: "array", cellDates: true });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(sheet, { defval: "" });
      const patients = rows.map(mapColumns).filter(Boolean);
      await handleImportPayload(patients);
    } catch (err) {
      setError(err?.message ?? "File Excel tidak dapat diproses");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Data Pasien</CardTitle>
        <CardDescription>Import atau export data pasien dalam format Excel maupun JSON.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-2">
          <Button onClick={onExport} disabled={processing} className="justify-start gap-2">
            <Download className="h-4 w-4" /> Export ke Excel
          </Button>
          <Separator />
          <Button
            type="button"
            variant="outline"
            className="justify-start gap-2"
            disabled={processing}
            onClick={() => jsonInputRef.current?.click()}
          >
            <FileJson className="h-4 w-4" /> Import JSON
          </Button>
          <Button
            type="button"
            variant="outline"
            className="justify-start gap-2"
            disabled={processing}
            onClick={() => excelInputRef.current?.click()}
          >
            <FileSpreadsheet className="h-4 w-4" /> Import Excel
          </Button>
        </div>
        {error ? (
          <div className="flex items-center gap-2 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive">
            <UploadCloud className="h-3.5 w-3.5" />
            <span>{error}</span>
          </div>
        ) : null}
        <input ref={jsonInputRef} type="file" accept="application/json" className="hidden" onChange={handleJsonFile} />
        <input
          ref={excelInputRef}
          type="file"
          accept=".xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
          className="hidden"
          onChange={handleExcelFile}
        />
      </CardContent>
    </Card>
  );
};

export default DataActionsCard;
