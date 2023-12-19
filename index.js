import { searchVector } from "@orama/orama";
//@ts-ignore
import { restoreFromFile } from "@orama/plugin-data-persistence/server";
import { program } from "commander";
import {
  pipeline,
  env,
} from "https://cdn.jsdelivr.net/npm/@xenova/transformers@2.12.0";
program
  .argument("<queryEmbedding>", "queryEmbedding")
  .option("-s, --similarity <number>", "similarity threshold between 0 and 1");
program.parse();
const query = program.args[0];

const APP_PATH = "/Users/nichwch/Library/Application Support/nomad-hypertext";
/** @param {string} text*/
const getHFEmbedding = async (text) => {
  env.cacheDir = `${APP_PATH}/.cache`;
  const embeddingFunction = await pipeline(
    "feature-extraction",
    "Supabase/gte-small"
  );
  const embeddingResponse = await embeddingFunction(text, {
    pooling: "mean",
    normalize: true,
  });
  const embedding = embeddingResponse.data;
  return Array.from(embedding);
};

const path = ``;
const db = await restoreFromFile("binary", path);
console.log("restored from file!");

const queryEmbedding = await getHFEmbedding(query);
const allDocuments = await searchVector(db, {
  vector: queryEmbedding,
  property: "embedding",
  similarity: 0,
  includeVectors: false,
  limit: 5000,
});

console.dir(allDocuments, { depth: null });
