import Button from "../components/ui/Button.jsx";
import Card from "../components/ui/Card.jsx";
import Section from "../components/ui/Section.jsx";
import usePackageBuilder, {
  formatPrice,
} from "../hooks/usePackageBuilder.js";

export default function Pricing() {
  const {
    addOnFeatures,
    basePackages,
    featuresTotal,
    resetBuilder,
    requestPreview,
    selectBase,
    selectedBase,
    selectedBaseId,
    selectedFeatureIds,
    selectedFeatures,
    submittedRequest,
    submitRequest,
    toggleFeature,
    total,
  } = usePackageBuilder();

  return (
    <div className="w-full">
      <Section
        className="pt-4 sm:pt-8"
        description="Choose a base package, add the right features, and review the estimate in real time before sending your request."
        eyebrow="Pricing"
        title="Build Your Package"
        width="full"
      >
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_380px] xl:items-start">
          <div className="space-y-6">
            <Card className="p-7 sm:p-8">
              <div className="space-y-6">
                <div className="space-y-3">
                  <p className="text-xs font-medium uppercase tracking-[0.28em] text-[var(--accent-secondary)]">
                    Step 1
                  </p>
                  <h2 className="text-2xl font-semibold tracking-[-0.03em] text-white sm:text-3xl">
                    Select your base package
                  </h2>
                  <p className="text-sm leading-7 text-[var(--text-secondary)] sm:text-base">
                    Start with the package that best matches the level of execution
                    you need right now.
                  </p>
                </div>

                <div className="grid gap-4 lg:grid-cols-3">
                  {basePackages.map((item) => (
                    <label key={item.id} className="block cursor-pointer">
                      <input
                        checked={selectedBaseId === item.id}
                        className="peer sr-only"
                        name="base-package"
                        onChange={() => selectBase(item.id)}
                        type="radio"
                        value={item.id}
                      />

                      <Card
                        className="h-full border-white/10 p-6 transition-all duration-300 peer-checked:border-violet-300/35 peer-checked:bg-violet-500/10 peer-checked:shadow-[0_24px_70px_rgba(124,58,237,0.18)]"
                        interactive
                      >
                        <div className="flex h-full flex-col">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-xs font-medium uppercase tracking-[0.24em] text-[var(--text-muted)]">
                                {item.timeline}
                              </p>
                              <h3 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-white">
                                {item.name}
                              </h3>
                            </div>

                            <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-medium text-white">
                              {formatPrice(item.price)}
                            </span>
                          </div>

                          <p className="mt-5 text-sm leading-7 text-[var(--text-secondary)]">
                            {item.description}
                          </p>

                          <div className="mt-auto pt-6">
                            <span className="text-sm font-medium text-[var(--accent-secondary)]">
                              {selectedBaseId === item.id ? "Selected" : "Choose package"}
                            </span>
                          </div>
                        </div>
                      </Card>
                    </label>
                  ))}
                </div>
              </div>
            </Card>

            <Card className="p-7 sm:p-8">
              <div className="space-y-6">
                <div className="space-y-3">
                  <p className="text-xs font-medium uppercase tracking-[0.28em] text-[var(--accent-secondary)]">
                    Step 2
                  </p>
                  <h2 className="text-2xl font-semibold tracking-[-0.03em] text-white sm:text-3xl">
                    Add the features you need
                  </h2>
                  <p className="text-sm leading-7 text-[var(--text-secondary)] sm:text-base">
                    Layer in the extras that strengthen the project without
                    overbuilding the scope.
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  {addOnFeatures.map((feature) => (
                    <label key={feature.id} className="block cursor-pointer">
                      <input
                        checked={selectedFeatureIds.includes(feature.id)}
                        className="peer sr-only"
                        onChange={() => toggleFeature(feature.id)}
                        type="checkbox"
                      />

                      <div className="flex h-full items-start gap-4 rounded-[24px] border border-white/10 bg-white/[0.03] p-5 transition-all duration-300 hover:border-violet-300/22 hover:bg-white/[0.05] peer-checked:border-violet-300/35 peer-checked:bg-violet-500/10 peer-checked:shadow-[0_18px_50px_rgba(124,58,237,0.14)]">
                        <div className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-md border border-white/15 bg-black/20 text-xs text-white transition-all duration-300 peer-checked:border-violet-300/40 peer-checked:bg-violet-400/20">
                          {selectedFeatureIds.includes(feature.id) ? "X" : ""}
                        </div>

                        <div className="flex-1">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <p className="text-base font-medium text-white">
                              {feature.name}
                            </p>
                            <span className="text-sm font-medium text-[var(--accent-secondary)]">
                              {formatPrice(feature.price)}
                            </span>
                          </div>

                          <p className="mt-2 text-sm leading-7 text-[var(--text-secondary)]">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          <Card className="p-7 sm:p-8 xl:sticky xl:top-28">
            <div className="space-y-6">
              <div className="space-y-3">
                <p className="text-xs font-medium uppercase tracking-[0.28em] text-[var(--accent-secondary)]">
                  Step 3
                </p>
                <h2 className="text-2xl font-semibold tracking-[-0.03em] text-white">
                  Review your live total
                </h2>
                <p className="text-sm leading-7 text-[var(--text-secondary)]">
                  Your estimate updates instantly as you build the package.
                </p>
              </div>

              <div className="space-y-4 rounded-[24px] border border-white/10 bg-black/20 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-[var(--text-muted)]">
                      Base Package
                    </p>
                    <p className="mt-2 text-base font-medium text-white">
                      {selectedBase ? selectedBase.name : "Select a package to begin"}
                    </p>
                  </div>
                  <span className="text-sm font-medium text-white">
                    {selectedBase ? formatPrice(selectedBase.price) : "--"}
                  </span>
                </div>

                <div className="border-t border-white/8 pt-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.24em] text-[var(--text-muted)]">
                        Add-On Features
                      </p>
                      <div className="mt-2 space-y-2">
                        {selectedFeatures.length ? (
                          selectedFeatures.map((feature) => (
                            <p
                              key={feature.id}
                              className="text-sm leading-6 text-[var(--text-secondary)]"
                            >
                              {feature.name}
                            </p>
                          ))
                        ) : (
                          <p className="text-sm leading-6 text-[var(--text-secondary)]">
                            No features selected yet.
                          </p>
                        )}
                      </div>
                    </div>
                    <span className="text-sm font-medium text-white">
                      {formatPrice(featuresTotal)}
                    </span>
                  </div>
                </div>

                <div className="border-t border-white/8 pt-4">
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-sm font-medium uppercase tracking-[0.24em] text-[var(--text-muted)]">
                      Estimated Total
                    </p>
                    <p className="text-3xl font-semibold tracking-[-0.04em] text-white">
                      {formatPrice(total)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Button
                  className="w-full"
                  disabled={!selectedBase}
                  onClick={submitRequest}
                  size="lg"
                >
                  Submit Request
                </Button>
                <Button
                  className="w-full"
                  onClick={resetBuilder}
                  size="lg"
                  variant="secondary"
                >
                  Reset Builder
                </Button>
              </div>

              <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5">
                <p className="text-xs font-medium uppercase tracking-[0.24em] text-[var(--text-muted)]">
                  Request Preview
                </p>
                <pre className="mt-4 overflow-x-auto whitespace-pre-wrap font-[inherit] text-sm leading-7 text-[var(--text-secondary)]">
                  {submittedRequest?.preview ||
                    requestPreview ||
                    "Choose a base package to generate your request summary."}
                </pre>
              </div>
            </div>
          </Card>
        </div>
      </Section>
    </div>
  );
}
