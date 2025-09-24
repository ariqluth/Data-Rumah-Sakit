import { useState } from "react";

import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { toISODate } from "../utils/date";

const defaultValues = {
  name: "",
  tanggal_lahir: "",
  tanggal_kunjungan: "",
  diagnosis: "",
  tindakan: "",
  dokter: "",
};

const PatientForm = ({ initialValues = {}, onSubmit, submitting = false, submitLabel = "Simpan" }) => {
  const [formValues, setFormValues] = useState({
    ...defaultValues,
    ...initialValues,
    tanggal_lahir: toISODate(initialValues.tanggal_lahir) ?? "",
    tanggal_kunjungan: toISODate(initialValues.tanggal_kunjungan) ?? "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({
      ...formValues,
      tanggal_lahir: toISODate(formValues.tanggal_lahir),
      tanggal_kunjungan: toISODate(formValues.tanggal_kunjungan),
    });
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Nama Pasien</Label>
              <Input id="name" name="name" value={formValues.name} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dokter">Dokter Penanggung Jawab</Label>
              <Input id="dokter" name="dokter" value={formValues.dokter} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tanggal_lahir">Tanggal Lahir</Label>
              <Input
                id="tanggal_lahir"
                type="date"
                name="tanggal_lahir"
                value={formValues.tanggal_lahir}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tanggal_kunjungan">Tanggal Kunjungan</Label>
              <Input
                id="tanggal_kunjungan"
                type="date"
                name="tanggal_kunjungan"
                value={formValues.tanggal_kunjungan}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="diagnosis">Diagnosis</Label>
            <Textarea id="diagnosis" name="diagnosis" rows={3} value={formValues.diagnosis} onChange={handleChange} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tindakan">Tindakan</Label>
            <Textarea id="tindakan" name="tindakan" rows={3} value={formValues.tindakan} onChange={handleChange} required />
          </div>
          <div className="flex justify-end">
            <Button type="submit" disabled={submitting}>
              {submitting ? "Menyimpan..." : submitLabel}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default PatientForm;
