#!/usr/bin/env node
import fs from "fs";
import fsp from "fs/promises";
import YAML from "yaml";
import { Metadata } from "../Metadata";

export async function compile(inputPath: string, outputPath: string) {


    console.log(inputPath, ' -> ', outputPath);
    if(fs.existsSync(outputPath)) {
        fs.rmSync(outputPath);
    }
    fs.writeFileSync(outputPath, "");

    const input = await fsp.open(inputPath, "r");
    const output = await fsp.open(outputPath, "w");

    let firstLine = true;
    let metadataWriting = false;
    let metadataStr = "";
    let callbacks: ((args:any)=>any)[] = [];

    /**
     * Used in the for loop after the metadata is finished reading into metadataStr
     */
    function parseMetadata(): [Metadata, ((args: any) => any)] {

        metadataStr = metadataStr.replace('\t', '  ');
        const allMetadata = YAML.parse(metadataStr);

        if("mdc" in allMetadata) {
            console.log("MCompiler settings here");
            console.log("Metadata:", JSON.stringify(allMetadata, null, 4));
            
            const mdc: Metadata = allMetadata['mdc'];

            return [
                {
                    type: "null"
                },
                (args: any) => {
                    switch(typeof mdc) {
                        case "object":
                            if(mdc) {
                                if('postEval' in mdc) {
                                    eval(mdc.postEval || 'console.log(`somehow not a string`)');
                                }
                            }
                            return
                        default:
                            return
                    }
                }
            ];
        }

        //delete metadataWriting;
        //delete metadataStr;


        // Called at the end of the extract() call.
        return [
            {
                type: "null"
            },
            () => {}
        ];
    }


    /**
     * When this is true, input is written to output.
     */
    let writing = false;
    for await (const line of input.readLines()) {

        if(firstLine) {
            firstLine = false;
            if(line.startsWith("---")) {
                metadataWriting = true;
                continue;
            }
        }

        if(metadataWriting) {
            if(line.startsWith("---")) {
                metadataWriting = false;
                const [metadata, cb] = await parseMetadata();
                callbacks.push(cb);
            } else {
                metadataStr += line + "\n";
            }
        } else if(writing) {
            if(line.trim().startsWith('```')) {
                writing = false;
                await output.write("\n");
            } else {
                await output.write(line + "\n");
            }
        } else {
            if(line.trim().startsWith('```')) {
                writing = true;
            }
        }

    }


    for(let cb of callbacks)
        await cb({});

}