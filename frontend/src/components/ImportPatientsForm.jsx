import { useState } from "react";

import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";

const examplePayload = [
  {
    name: "Budi Hartono",
    tanggal_kunjungan: "2025-09-24",
  },
];

const ImportPatientsForm = ({ onImport, isLoading = false }) => {
  const [payload, setPayload] = useState(JSON.stringify(examplePayload, null, 2));
  const [error, setError] = useState(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    try {
      const parsed = JSON.parse(payload);
      if (!Array.isArray(parsed)) {
        throw new Error("Format harus berupa array JSON");
      }
      onImport({ patients: parsed });
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Import Pasien (Dummy)</CardTitle>
        <CardDescription>
          Tempel data JSON sederhana untuk menambahkan pasien baru secara massal. Minimal membutuhkan <code>name</code>
          dan <code>tanggal_kunjungan</code>.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="dummy-json">JSON Pasien</Label>
            <Textarea
              id="dummy-json"
              rows={8}
              className="font-mono text-xs"
              value={payload}
              onChange={(event) => setPayload(event.target.value)}
            />
          </div>
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
          <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
            {isLoading ? "Mengimpor..." : "Import Pasien"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ImportPatientsForm;
