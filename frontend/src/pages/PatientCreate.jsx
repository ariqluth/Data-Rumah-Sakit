import { useState } from "react";

import { useNavigate } from "react-router-dom";

import PatientForm from "../components/PatientForm";
import RoleGuard from "../components/RoleGuard";
import { AlertTriangle } from "lucide-react";
import { Card, CardContent } from "../components/ui/card";
import { useAppDispatch } from "../hooks/storeHooks";
import { createPatient } from "../features/patients/patientSlice";

const PatientCreate = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (values) => {
    setIsSubmitting(true);
    setError(null);
    const result = await dispatch(createPatient(values));
    setIsSubmitting(false);
    if (createPatient.fulfilled.match(result)) {
      navigate("/");
    } else {
      setError(result.payload ?? "Gagal menambahkan pasien");
    }
  };

  return (
    <RoleGuard allowedRoles={["dokter"]}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Tambah Pasien</h1>
          <p className="text-sm text-muted-foreground">Lengkapi formulir berikut untuk menambahkan pasien baru.</p>
        </div>
        {error ? (
          <Card className="border-destructive/50 bg-destructive/10">
            <CardContent className="flex items-center gap-2 pt-6 text-destructive">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm">{error}</span>
            </CardContent>
          </Card>
        ) : null}
        <PatientForm onSubmit={handleSubmit} submitting={isSubmitting} submitLabel="Simpan Pasien" />
      </div>
    </RoleGuard>
  );
};

export default PatientCreate;
