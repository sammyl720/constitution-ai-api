import express from 'express';
import dotenv from 'dotenv';
import { Configuration, OpenAIApi } from 'openai';
import getEmbeddingRoutes from './routes/embedding.route';
import OpenAIEmbedding, { IEmbeddingTextInputItem } from './openai/embedding';
import { getJsonFileContent } from './util';

if (process.env.NODE_ENV !== 'productopm') {
  dotenv.config();
}

const configuration = new Configuration({
  apiKey: process.env.OPENAI_KEY
});
const openai = new OpenAIApi(configuration);
const embeddingApiWrapper = new OpenAIEmbedding(openai);
const embeddedData = getJsonFileContent<IEmbeddingTextInputItem[]>('data.json');


const PORT = process.env.PORT || 3000;
const app = express();
app.use(express.json());

const embeddingRouter = getEmbeddingRoutes(embeddingApiWrapper, embeddedData);
app.use('/embedding', embeddingRouter);

app.listen(PORT, () => {
  console.log(`Local server running on http://localhost:${PORT}`);
})