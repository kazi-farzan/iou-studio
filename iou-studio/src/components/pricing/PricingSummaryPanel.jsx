import Card from "../ui/Card.jsx";
import PricingSummarySurface from "./PricingSummarySurface.jsx";

export default function PricingSummaryPanel({ summary }) {
  return (
    <div className="xl:sticky xl:top-32">
      <Card className="w-full max-w-[28rem] overflow-hidden p-0 xl:ml-auto 2xl:max-w-[30rem]">
        <PricingSummarySurface summary={summary} />
      </Card>
    </div>
  );
}
