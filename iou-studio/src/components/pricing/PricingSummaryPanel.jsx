import Card from "../ui/Card.jsx";
import PricingSummarySurface from "./PricingSummarySurface.jsx";

export default function PricingSummaryPanel({ summary }) {
  return (
    <div className="xl:sticky xl:top-32">
      <Card className="w-full max-w-[28rem] overflow-hidden p-0 xl:ml-auto xl:flex xl:max-h-[calc(100vh-9rem)] xl:flex-col 2xl:max-w-[30rem]">
        <PricingSummarySurface summary={summary} />
      </Card>
    </div>
  );
}
