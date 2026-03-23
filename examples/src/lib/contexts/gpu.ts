import { createContext } from 'svelte';

import type { GPUContext } from 'voyd';

export const [getGPUContext, setGPUContext] = createContext<GPUContext>();
     