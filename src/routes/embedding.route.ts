import express from 'express';
import { IEmbeddingAPI, IEmbeddingTextInputItem, IEmbeddingTextResponse } from '../openai';


export default function (embeddingWrapper: IEmbeddingAPI, embeddedData: IEmbeddingTextInputItem[]) {
  const embeddingRouter = express.Router();

  embeddingRouter.post('/', async (req, res) => {
    const { text } = req.body;
    if (typeof text != 'string') {
      return res.status(401).json({ error: 'Please provide a text field in your post request body' });
    }

    const result = await embeddingWrapper.getEmbedding(text);
    return res.send(result)
  });

  embeddingRouter.post('/constitution', async (req, res) => {
    const { text, resultCount = 5 } = req.body;
    if (typeof text != 'string') {
      return res.status(401).json({ error: 'Please provide a text field in your post request body' });
    }

    const result = await embeddingWrapper.getResults(text, embeddedData, resultCount);
    return res.send(result)
  })
  return embeddingRouter;
}