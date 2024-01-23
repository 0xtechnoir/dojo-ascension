// import { createClientComponents } from "./createClientComponents";
// import { createSystemCalls } from "./createSystemCalls";
// import { setupNetwork } from "./setupNetwork";
// import { getSyncEntities } from "@dojoengine/react";

// export type SetupResult = Awaited<ReturnType<typeof setup>>;

// /**
//  * Sets up the necessary components and network utilities.
//  *
//  * @returns An object containing network configurations, client components, and system calls.
//  */
// export async function setup() {
//     // Initialize the network configuration.
//     const network = await setupNetwork();

//     // Create client components based on the network setup.
//     const components = createClientComponents(network);

//     // fetch all existing entities from torii
//     await getSyncEntities(
//         network.toriiClient,
//         network.contractComponents as any
//     );

//     return {
//         network,
//         components,
//         systemCalls: createSystemCalls(network, components),
//     };
// }


import { getSyncEntities } from "@dojoengine/state";
import { DojoProvider } from "@dojoengine/core";
import * as torii from "@dojoengine/torii-client";
import { createClientComponents } from "./createClientComponents";
import { createSystemCalls } from "./createSystemCalls";
import { defineContractComponents } from "./contractComponents";
import { world } from "./world";
import { Config } from "./dojoConfig";
import { setupWorld } from "../generated/generated";

export type SetupResult = Awaited<ReturnType<typeof setup>>;

export async function setup({ ...config }: Config) {
    // torii client
    const toriiClient = await torii.createClient([], {
        rpcUrl: config.rpcUrl,
        toriiUrl: config.toriiUrl,
        worldAddress: config.manifest.world.address || "",
    });

    // create contract components
    const contractComponents = defineContractComponents(world);

    // create client components
    const clientComponents = createClientComponents({ contractComponents });

    // fetch all existing entities from torii
    await getSyncEntities(toriiClient, contractComponents as any);

    const client = await setupWorld(
        new DojoProvider(config.manifest, config.rpcUrl)
    );

    return {
        client,
        clientComponents,
        contractComponents,
        systemCalls: createSystemCalls(
            { client },
            contractComponents,
            clientComponents
        ),
        config,
    };
}