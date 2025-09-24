import { useRef, useState } from "react";

import { Download, FileJson, FileSpreadsheet, Filter, PlusCircle, UploadCloud } from "lucide-react";
import * as XLSX from "xlsx";

import { toISODate } from "../utils/date";
import { Button } from "./ui/button";

const mapRowToPatient = (row) => {
  const pick = (keys, fallback = "") => {
    for (const key of keys) {
      const value = row[key];
      if (value !== undefined && value !== null && `${value}`.trim() !== "") {
        return value;
      }
    }
    return fallback;
  };

  const normalizeDate = (value) => {
    if (!value) return null;
    if (value instanceof Date) return toISODate(value);
    if (typeof value === "number") {
      const parsed = XLSX.SSF.parse_date_code(value);
      if (parsed) {
        const date = new Date(Date.UTC(parsed.y, parsed.m - 1, parsed.d));
        return toISODate(date);
      }
    }
    return toISODate(value);
  };

  const name = pick(["name", "Name", "nama", "Nama"]);
  const visit = normalizeDate(pick(["tanggal_kunjungan", "TanggalKunjungan", "visit", "Visit", "visit_date", "Tanggal Kunjungan"]));
  if (!name || !visit) return null;

  const birth = normalizeDate(
    pick(["tanggal_lahir", "TanggalLahir", "birth", "Birth", "birth_date", "Tanggal Lahir"])
  ) || visit;

  const diagnosis = pick(["diagnosis", "Diagnosis"], "Belum ada diagnosis");
  const tindakan = pick(["tindakan", "Tindakan", "treatment", "Treatment"], "Belum ada tindakan");
  const dokter = pick(["dokter", "Dokter", "doctor", "Doctor"], "Belum ditugaskan");

  return {
    name: `${name}`.trim(),
    tanggal_kunjungan: visit,
    tanggal_lahir: birth ?? visit,
    diagnosis: `${diagnosis}`.trim() || "Belum ada diagnosis",
    tindakan: `${tindakan}`.trim() || "Belum ada tindakan",
    dokter: `${dokter}`.trim() || "Belum ditugaskan",
  };
};

const PatientActions = ({
  canManage,
  onAddPatient,
  onExport,
  onImport,
  onToggleFilters,
  filtersOpen,
}) => {
  const jsonInputRef = useRef(null);
  const excelInputRef = useRef(null);
  const [error, setError] = useState(null);

  const handlePayload = async (patients) => {
    if (!patients.length) {
      setError("Data kosong atau format tidak dikenali");
      return;
    }
    try {
      await onImport({ patients });
      setError(null);
    } catch (err) {
      setError(err?.message ?? "Gagal mengimpor data");
    }
  };

  const parseJsonFile = async (file) => {
    const text = await file.text();
    const parsed = JSON.parse(text);
    if (!Array.isArray(parsed)) {
      throw new Error("JSON harus berupa array pasien");
    }
    return parsed.map((row) => (typeof row === "object" ? mapRowToPatient(row) : null)).filter(Boolean);
  };

  const parseExcelFile = async (file) => {
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: "array", cellDates: true });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet, { defval: "" });
    return rows.map(mapRowToPatient).filter(Boolean);
  };

  const handleJsonChange = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    try {
      const patients = await parseJsonFile(file);
      await handlePayload(patients);
    } catch (err) {
      setError(err?.message ?? "JSON tidak valid");
    }
  };

  const handleExcelChange = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    try {
      const patients = await parseExcelFile(file);
      await handlePayload(patients);
    } catch (err) {
      setError(err?.message ?? "File Excel tidak dapat diproses");
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button variant="outline" size="sm" onClick={onToggleFilters}>
        <Filter className="mr-2 h-4 w-4" /> {filtersOpen ? "Sembunyikan Filter" : "Filter"}
      </Button>
      <Button variant="outline" size="sm" onClick={onExport}>
        <Download className="mr-2 h-4 w-4" /> Export
      </Button>
      {canManage ? (
        <>
          <Button variant="outline" size="sm" onClick={() => jsonInputRef.current?.click()}>
            <FileJson className="mr-2 h-4 w-4" /> Import JSON
          </Button>
          <Button variant="outline" size="sm" onClick={() => excelInputRef.current?.click()}>
            <FileSpreadsheet className="mr-2 h-4 w-4" /> Import Excel
          </Button>
          <Button size="sm" onClick={onAddPatient}>
            <PlusCircle className="mr-2 h-4 w-4" /> Tambah Pasien
          </Button>
        </>
      ) : null}
      {error ? (
        <span className="flex items-center gap-1 rounded-md border border-destructive/40 bg-destructive/10 px-2 py-1 text-xs text-destructive">
          <UploadCloud className="h-3 w-3" /> {error}
        </span>
      ) : null}
      <input ref={jsonInputRef} type="file" accept="application/json" className="hidden" onChange={handleJsonChange} />
      <input
        ref={excelInputRef}
        type="file"
        accept=".xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
        className="hidden"
        onChange={handleExcelChange}
      />
    </div>
  );
};

export default PatientActions;
