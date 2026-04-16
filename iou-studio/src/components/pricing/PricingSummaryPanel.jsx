import Card from "../ui/Card.jsx";
import PricingSummarySurface from "./PricingSummarySurface.jsx";

export default function PricingSummaryPanel({ summary }) {
  return (
    <Card className="overflow-hidden p-0 xl:sticky xl:top-28">
      <PricingSummarySurface summary={summary} />
    </Card>
  );
}
