import express, { Router, Request, Response, NextFunction } from 'express';

const router: Router = express.Router();

router.get('/hello', (req, res) => {
  res.json({"hello": "hello"});
})

router.get('/hi', (req: Request, res: Response, next: NextFunction) => {
  throw new Error('error');
});

router.get('/ho', (req, res, next) => {
  throw new Error('whatsapp');
})

router.get('/herro', (req, res) => {
  res.send('homepage');
})

export default router;
