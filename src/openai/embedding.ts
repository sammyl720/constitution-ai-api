import { OpenAIApi } from "openai";
import { cosineSimilarity } from "../util";


export interface IEmbeddingTextResponse {
  embedding: Array<number>;
  text: string;
}

export interface IEmbeddingTextInputItem extends IEmbeddingTextResponse {
  start: number;
  end: number;
}

export interface IEmbeddingTextOutputItem extends Omit<IEmbeddingTextInputItem, 'embedding'> {
  similarity: number;
}

export interface IEmbeddingAPI {
  getEmbedding: (text: string) => Promise<IEmbeddingTextResponse>;
  getResults: (text: string, dataToSearch: IEmbeddingTextInputItem[], resultCount: number) => Promise<IEmbeddingTextOutputItem[]>;
}
export default class OpenAIEmbedding implements IEmbeddingAPI {
  private readonly model = 'text-embedding-ada-002';
  constructor(private openai: OpenAIApi) {
  }

  async getEmbedding(text: string) {
    const apiResult = await this.openai.createEmbedding({
      input: text,
      model: this.model
    });

    const { data: [{ embedding }] } = apiResult.data;
    return {
      embedding,
      text
    }
  }

  async getResults(text: string, dataToSearch: IEmbeddingTextInputItem[], resultCount = 3) {
    const { embedding } = await this.getEmbedding(text);

    return dataToSearch.map<IEmbeddingTextOutputItem>(data => {
      const similarity = cosineSimilarity(embedding, data.embedding);
      const { start, end, text } = data;
      return { start, end, similarity, text }
    }).sort((a, b) => b.similarity - a.similarity).slice(0, resultCount);
  }
}