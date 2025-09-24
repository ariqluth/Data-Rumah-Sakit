import { useEffect, useState } from "react";

import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

const PatientFilters = ({ initialFilters, onApply }) => {
  const [localFilters, setLocalFilters] = useState({
    name: "",
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    setLocalFilters((prev) => ({
      ...prev,
      name: initialFilters?.name ?? "",
      startDate: initialFilters?.startDate ?? "",
      endDate: initialFilters?.endDate ?? "",
    }));
  }, [initialFilters]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setLocalFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onApply({
      name: localFilters.name || undefined,
      startDate: localFilters.startDate || undefined,
      endDate: localFilters.endDate || undefined,
    });
  };

  const handleReset = () => {
    const resetValues = { name: "", startDate: "", endDate: "" };
    setLocalFilters(resetValues);
    onApply({});
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 rounded-lg border bg-muted/30 p-4 md:grid-cols-4">
      <div className="space-y-2">
        <Label htmlFor="filter-name">Nama Pasien</Label>
        <Input id="filter-name" name="name" value={localFilters.name} onChange={handleChange} placeholder="Cari nama" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="filter-start">Mulai Tanggal</Label>
        <Input id="filter-start" type="date" name="startDate" value={localFilters.startDate} onChange={handleChange} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="filter-end">Sampai Tanggal</Label>
        <Input id="filter-end" type="date" name="endDate" value={localFilters.endDate} onChange={handleChange} />
      </div>
      <div className="flex items-end gap-2">
        <Button type="button" variant="outline" onClick={handleReset} className="flex-1">
          Reset
        </Button>
        <Button type="submit" className="flex-1">
          Terapkan
        </Button>
      </div>
    </form>
  );
};

export default PatientFilters;
