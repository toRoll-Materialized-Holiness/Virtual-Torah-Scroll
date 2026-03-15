import type data from "../../data/scrolls.json"

/**
 * The type of a single scroll in the data file.
 */
export type Scroll = (typeof data)[number]
