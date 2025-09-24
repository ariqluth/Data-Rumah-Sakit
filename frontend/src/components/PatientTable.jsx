import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Button } from "./ui/button";
import { formatDate } from "../utils/date";

const PatientTable = ({ patients, onEdit, onDelete, canEdit = true }) => {
  if (!patients.length) {
    return (
      <div className="rounded-lg border border-dashed bg-muted/20 p-10 text-center text-sm text-muted-foreground">
        Belum ada data pasien.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nama</TableHead>
            <TableHead>Tanggal Lahir</TableHead>
            <TableHead>Tanggal Kunjungan</TableHead>
            <TableHead>Diagnosis</TableHead>
            <TableHead>Tindakan</TableHead>
            <TableHead>Dokter</TableHead>
            {canEdit ? <TableHead className="text-right">Aksi</TableHead> : null}
          </TableRow>
        </TableHeader>
        <TableBody>
          {patients.map((patient) => (
            <TableRow key={patient.id}>
              <TableCell className="font-medium text-foreground">{patient.name}</TableCell>
              <TableCell>{formatDate(patient.tanggal_lahir)}</TableCell>
              <TableCell>{formatDate(patient.tanggal_kunjungan)}</TableCell>
              <TableCell className="max-w-xs whitespace-pre-wrap text-muted-foreground">{patient.diagnosis}</TableCell>
              <TableCell className="max-w-xs whitespace-pre-wrap text-muted-foreground">{patient.tindakan}</TableCell>
              <TableCell>{patient.dokter}</TableCell>
              {canEdit ? (
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={() => onEdit(patient)}>
                      Edit
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => onDelete(patient)}>
                      Hapus
                    </Button>
                  </div>
                </TableCell>
              ) : null}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default PatientTable;
