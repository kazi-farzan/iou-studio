import Card from "../ui/Card.jsx";
import PricingSummarySurface from "./PricingSummarySurface.jsx";

export default function PricingSummaryPanel({ summary }) {
  return (
    <div className="xl:sticky xl:top-32">
      <Card className="w-full max-w-[30rem] overflow-hidden p-0 xl:ml-auto 2xl:max-w-[31rem]">
        <PricingSummarySurface summary={summary} surface="panel" />
      </Card>
    </div>
  );
}
