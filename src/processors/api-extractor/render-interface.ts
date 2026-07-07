import {
    type ApiInterface,
    type ApiItem,
    type ApiMethodSignature,
    type ApiPackage,
    type ApiPropertySignature,
    type Excerpt,
    ApiItemKind,
} from "@microsoft/api-extractor-model";
import { formatCode } from "../../utils";
import { documentation, documentationComment } from "./documentation";

function isApiInterface(item: ApiItem): item is ApiInterface {
    return item.kind === ApiItemKind.Interface;
}

function findMemberByName(
    name: string,
    pkg: ApiPackage,
): ApiInterface | undefined {
    for (const entryPoint of pkg.entryPoints) {
        for (const member of entryPoint.findMembersByName(name)) {
            if (isApiInterface(member)) {
                return member;
            }
        }
    }
    return undefined;
}

function getNameFromExcerpt(excerpt: Excerpt): string {
    const [token] = excerpt.tokens.slice(
        excerpt.tokenRange.startIndex,
        excerpt.tokenRange.endIndex,
    );
    return token.text;
}

function getInheritance(item: ApiInterface): ApiInterface[] {
    const pkg = item.getAssociatedPackage();
    if (!pkg) {
        return [];
    }

    const hierarchy: ApiInterface[] = [];
    const visited = new Set<string>();

    function traverseParents(current: ApiInterface, pkg: ApiPackage): void {
        if (visited.has(current.name)) {
            return;
        }
        visited.add(current.name);
        for (const { excerpt } of current.extendsTypes) {
            const name = getNameFromExcerpt(excerpt);
            const parentInterface = findMemberByName(name, pkg);
            if (parentInterface) {
                traverseParents(parentInterface, pkg);
                hierarchy.push(parentInterface);
            }
        }
    }

    traverseParents(item, pkg);
    hierarchy.push(item);

    return hierarchy;
}

function collectMembers(
    item: ApiInterface,
    inherit: boolean,
): Array<ApiPropertySignature | ApiMethodSignature> {
    if (!inherit) {
        return item.members.filter(isSupported);
    }

    const hierarchy = getInheritance(item);
    const members = new Map<
        string,
        ApiPropertySignature | ApiMethodSignature
    >();

    for (const iface of hierarchy) {
        for (const member of iface.members) {
            if (!isSupported(member)) {
                /* eslint-disable-next-line unicorn/no-break-in-nested-loop -- technical debt */
                continue;
            }
            /* intentionally load the last seen member: overloaded members should only be displayed once */
            members.set(member.name, member);
        }
    }

    return [...members.values()];
}

function isSupported(item: {
    kind: ApiItemKind;
}): item is ApiPropertySignature | ApiMethodSignature {
    return [
        ApiItemKind.PropertySignature,
        ApiItemKind.MethodSignature,
    ].includes(item.kind);
}

function renderCode(
    item: ApiInterface,
    members: Array<ApiPropertySignature | ApiMethodSignature>,
    options: RenderInterfaceOptions,
): string {
    const inherit = options.inherit ?? false;
    const renderedMembers = members.map((it) => {
        const summary = documentationComment(it);
        const comment = summary ? `\n${summary}` : "";
        return `${comment}\n${it.excerpt.text}`;
    });
    const header = item.excerpt.text.replace(/^export /, "").trimEnd();
    const extendsIndex = header.indexOf(" extends ");
    const declaration =
        inherit && extendsIndex !== -1 ? header.slice(0, extendsIndex) : header;
    const source = `${declaration} { ${renderedMembers.join("")} }`;
    return [
        "```ts nocompile nolint",
        formatCode(source, "docs/api-interface.ts"),
        "```",
    ].join("\n");
}

function renderProperties(
    members: Array<ApiPropertySignature | ApiMethodSignature>,
): string {
    return members
        .map((it) => {
            const optional = it.isOptional ? " {@optional}" : "";
            const summary = documentation(it);
            const lines = summary
                ? summary.split("\n").map((it, i) => {
                      if (it.trim() === "") {
                          return "\n";
                      }
                      const prefix = i === 0 ? ": " : "    ";
                      return `${prefix}${it.trim()}\n`;
                  })
                : [": &dash;\n"];
            return [`\`${it.excerpt.text}\`${optional}\n`, ...lines].join("");
        })
        .join("\n");
}

/**
 * @internal
 */
export interface RenderInterfaceOptions {
    inherit?: boolean;
}

/**
 * @internal
 */
export function renderInterface(): {
    default(
        this: void,
        item: ApiInterface,
        options: RenderInterfaceOptions,
    ): string;
    interface(
        this: void,
        item: ApiInterface,
        options: RenderInterfaceOptions,
    ): string;
    properties(
        this: void,
        item: ApiInterface,
        options: RenderInterfaceOptions,
    ): string;
} {
    return {
        default(item, options) {
            const inherit = options.inherit ?? false;
            return renderCode(item, collectMembers(item, inherit), options);
        },
        interface(item, options) {
            const inherit = options.inherit ?? false;
            return renderCode(item, collectMembers(item, inherit), options);
        },
        properties(item, options) {
            const inherit = options.inherit ?? true;
            return renderProperties(collectMembers(item, inherit));
        },
    };
}
