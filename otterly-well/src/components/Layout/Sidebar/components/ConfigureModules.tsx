import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { Fragment } from "react";
import { useModuleContext } from "../../../../context/ModuleContext";
import type { ModuleType } from "../../../../context/ModuleContext";

interface ConfigureModulesProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ConfigureModules({
  isOpen,
  onClose,
}: ConfigureModulesProps) {
  const { visibleModules, toggleModule } = useModuleContext();

  const modules: { id: ModuleType; label: string }[] = [
    { id: "calories", label: "Kalorie" },
    { id: "fitness", label: "Treningi" },
    { id: "finance", label: "Finanse" },
    { id: "tasks", label: "Zadania" },
  ];

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25 backdrop-blur-sm" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel
                className="w-full max-w-md transform overflow-hidden rounded-2xl bg-brand-neutral-dark 
              p-6 text-left align-middle shadow-xl transition-all border border-brand-depth"
              >
                <DialogTitle
                  as="h3"
                  className="text-lg font-medium leading-6 text-brand-neutral-light mb-4"
                >
                  Konfiguracja widoku
                </DialogTitle>
                <div className="mt-2 flex flex-col gap-3">
                  <p className="text-sm text-brand-secondary mb-2">
                    Wybierz moduły, które chcesz widzieć w menu i na pulpicie.
                  </p>
                  {modules.map((module) => (
                    <div
                      key={module.id}
                      className="flex items-center justify-between p-3 rounded-xl bg-brand-neutral-light/5 border border-brand-depth 
                      hover:bg-brand-neutral-light/10 transition-colors cursor-pointer"
                      onClick={() => toggleModule(module.id)}
                    >
                      <span className="text-brand-neutral-light font-medium">
                        {module.label}
                      </span>
                      <div
                        className={`w-6 h-6 rounded-md border flex items-center justify-center transition-colors ${
                          visibleModules[module.id]
                            ? "bg-brand-primary border-brand-primary"
                            : "border-brand-secondary bg-transparent"
                        }`}
                      >
                        {visibleModules[module.id] && (
                          <span className="material-symbols-sharp text-brand-neutral-light text-sm">
                            check
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-brand-primary 
                    px-4 py-2 text-sm font-medium text-brand-neutral-light hover:bg-brand-primary/80 cursor-pointer"
                    onClick={onClose}
                  >
                    Gotowe
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
