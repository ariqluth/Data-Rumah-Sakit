import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

const SummaryCards = ({ summary }) => (
  <div className="grid gap-4 md:grid-cols-2">
    <Card className="border-none bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Total Pasien</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-4xl font-semibold">{summary.total_patients ?? 0}</p>
        <p className="mt-1 text-xs text-blue-100">Akumulasi seluruh pasien terdata.</p>
      </CardContent>
    </Card>
    <Card className="border-none bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Pasien Hari Ini</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-4xl font-semibold">{summary.total_today ?? 0}</p>
        <p className="mt-1 text-xs text-emerald-100">Jumlah kunjungan pada tanggal hari ini.</p>
      </CardContent>
    </Card>
  </div>
);

export default SummaryCards;
