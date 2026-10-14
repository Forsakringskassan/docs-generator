import { type DependencyTree } from "./dependency-tree";

declare module "../state-map" {
    export interface StateMap {
        [dependencyTreeState]: DependencyTree;
    }
}

/** @internal */
export const dependencyTreeState = Symbol("dependency-tree");
