import { overridableComponent } from "@dojoengine/recs";
import { defineContractComponents } from "./contractComponents";

export type ContractComponents = Awaited<
    ReturnType<typeof defineContractComponents>
>;

export type ClientComponents = ReturnType<typeof createClientComponents>;

export function createClientComponents({
    contractComponents,
}: {
    contractComponents: ContractComponents;
}) {
    return {
        ...contractComponents,
        Position: overridableComponent(contractComponents.Position),
        Player: overridableComponent(contractComponents.Player),
    };
}