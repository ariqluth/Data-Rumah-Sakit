import { useEffect, useMemo, useState } from "react";

import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";

import PatientActions from "../components/PatientActions";
import PatientDistributionChart from "../components/PatientDistributionChart";
import PatientFilters from "../components/PatientFilters";
import PatientTable from "../components/PatientTable";
import SummaryCards from "../components/SummaryCards";
import LoadingScreen from "../components/LoadingScreen";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { useAppDispatch, useAppSelector } from "../hooks/storeHooks";
import {
  deletePatient,
  fetchPatientReport,
  fetchPatients,
  importPatients,
  setFilters,
} from "../features/patients/patientSlice";
import { downloadPatientReport } from "../services/export";

const Dashboard = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isLoading: authLoading } = useAuth0();
  const { report, filters, status, items } = useAppSelector((state) => state.patients);
  const accessToken = useAppSelector((state) => state.auth.accessToken);
  const role = useAppSelector((state) => state.auth.account?.role);

  const canManage = role === "dokter";

  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    if (accessToken) {
      dispatch(fetchPatientReport({}));
      dispatch(fetchPatients({}));
    }
  }, [accessToken, dispatch]);

  const handleApplyFilters = (newFilters) => {
    const normalized = {
      name: newFilters.name ?? "",
      startDate: newFilters.startDate ?? "",
      endDate: newFilters.endDate ?? "",
    };
    dispatch(setFilters(normalized));
    dispatch(fetchPatientReport(normalized));
    dispatch(fetchPatients(normalized));
  };

  const handleImport = async (payload) => {
    const result = await dispatch(importPatients(payload));
    if (importPatients.fulfilled.match(result)) {
      await Promise.all([
        dispatch(fetchPatientReport(filters)),
        dispatch(fetchPatients(filters)),
      ]);
    } else {
      throw new Error(result.payload ?? "Gagal mengimpor data");
    }
  };

  const handleExport = () => {
    if (accessToken) {
      downloadPatientReport(accessToken, filters);
    }
  };

  const handleEdit = (patient) => {
    navigate(`/patients/${patient.id}/edit`);
  };

  const handleDelete = async (patient) => {
    const confirmed = window.confirm(`Hapus pasien ${patient.name}?`);
    if (!confirmed) return;
    const result = await dispatch(deletePatient(patient.id));
    if (deletePatient.fulfilled.match(result)) {
      dispatch(fetchPatientReport(filters));
      dispatch(fetchPatients(filters));
    }
  };

  const patients = useMemo(() => report.patients ?? items ?? [], [report.patients, items]);

  const chartData = useMemo(() => {
    if (!patients.length) return [];
    const counts = new Map();
    patients.forEach((patient) => {
      const label = patient.dokter?.trim() || "Belum ditugaskan";
      counts.set(label, (counts.get(label) ?? 0) + 1);
    });
    return Array.from(counts.entries()).map(([label, value]) => ({ label, value }));
  }, [patients]);

  const isFetching = status === "loading" || authLoading;

  if (isFetching && !patients.length) {
    return <LoadingScreen message="Memuat data pasien" />;
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2 border-none bg-card shadow-lg">
          <CardHeader className="flex flex-col gap-2">
            <CardTitle className="text-xl font-semibold">Ringkasan Pasien</CardTitle>
            <CardDescription>
              Pantau perkembangan pasien dan kelola tindakan langsung dari dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SummaryCards summary={report.summary} />
          </CardContent>
        </Card>
        <PatientDistributionChart data={chartData} />
      </div>

      <Card>
        <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle>Daftar Pasien</CardTitle>
            <CardDescription>Kelola data pasien dan lakukan tindakan lanjutan.</CardDescription>
          </div>
          <PatientActions
            canManage={canManage}
            onAddPatient={() => navigate("/patients/new")}
            onExport={handleExport}
            onImport={handleImport}
            onToggleFilters={() => setFiltersOpen((prev) => !prev)}
            filtersOpen={filtersOpen}
          />
        </CardHeader>
        <CardContent className="space-y-4">
          {filtersOpen ? <PatientFilters initialFilters={filters} onApply={handleApplyFilters} /> : null}
          <PatientTable
            patients={patients}
            canEdit={canManage}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
