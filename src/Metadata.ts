export interface IMetadata {
    type: string;
    output_path?: string;
    postEval?: string;
    emitComments?: boolean;
}


export type MetadataTypeScript = IMetadata & {
    type: "typescript"
}

export type MetadataHTML = IMetadata & {
    type: "html"
}

export type MetadataSCSS = IMetadata & {
    type: "sass"
}

export type MetadataNull = IMetadata & {
    type: "null"
}

export type Metadata = MetadataTypeScript | MetadataHTML | MetadataSCSS | MetadataNull;
export const DefaultMetadata: Metadata = {
    type: "null"
}