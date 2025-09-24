import { useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

import LoadingScreen from "../components/LoadingScreen";
import PatientForm from "../components/PatientForm";
import RoleGuard from "../components/RoleGuard";
import { Card, CardContent } from "../components/ui/card";
import { AlertTriangle } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../hooks/storeHooks";
import { fetchPatientById, updatePatient } from "../features/patients/patientSlice";

const PatientEdit = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const patient = useAppSelector((state) => state.patients.current);
  const patientError = useAppSelector((state) => state.patients.error);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      dispatch(fetchPatientById(id));
    }
  }, [dispatch, id]);

  const handleSubmit = async (values) => {
    setIsSubmitting(true);
    setError(null);
    const result = await dispatch(updatePatient({ id, payload: values }));
    setIsSubmitting(false);
    if (updatePatient.fulfilled.match(result)) {
      navigate("/");
    } else {
      setError(result.payload ?? "Gagal memperbarui pasien");
    }
  };

  if (!patient && !patientError) {
    return <LoadingScreen message="Mengambil data pasien" />;
  }

  if (patientError && !patient) {
    return (
      <Card className="border-destructive/50 bg-destructive/10">
        <CardContent className="flex items-center gap-2 pt-6 text-destructive">
          <AlertTriangle className="h-4 w-4" />
          <span className="text-sm">{patientError}</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <RoleGuard allowedRoles={["dokter"]}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Edit Pasien</h1>
          <p className="text-sm text-muted-foreground">Perbarui informasi pasien sesuai kebutuhan.</p>
        </div>
        {error ? (
          <Card className="border-destructive/50 bg-destructive/10">
            <CardContent className="flex items-center gap-2 pt-6 text-destructive">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm">{error}</span>
            </CardContent>
          </Card>
        ) : null}
        <PatientForm
          initialValues={patient}
          onSubmit={handleSubmit}
          submitting={isSubmitting}
          submitLabel="Perbarui Pasien"
        />
      </div>
    </RoleGuard>
  );
};

export default PatientEdit;
