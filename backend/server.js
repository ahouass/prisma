import express from 'express';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();

app.use(express.json());

app.get('/', (req, res) => {
    res.json({ message: 'Hello, world!' });
});

app.post('/add', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            error: 'Missing email or password'
        });
    }

    try {
        const user = await prisma.user.create({
            data: {
                email: email,
                passwordHash: password
            },
            select: {
                id: true,
                email: true,
                createdAt: true
            }
        });

        res.json(user);
    } catch (err) {
        console.error(err);

        res.status(500).json({
            error: 'db error'
        });
    }
});

app.get('/users', async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                email: true,
                createdAt: true
            },
            orderBy: {
                id: 'asc'
            }
        });

        res.json(users);
    } catch (err) {
        console.error(err);

        res.status(500).json({
            error: 'db error'
        });
    }
});

app.get('/users/emails', async (req, res) => {
  try {
      const users = await prisma.user.findMany({
          select: {
              id: true,
              email: true,
              createdAt: true
          },
          orderBy: {
              email: 'asc'
          }
      });

      res.json(users);
  } catch (err) {
      console.error(err);

      res.status(500).json({
          error: 'db error'
      });
  }
});

app.listen(3000, () => {
    console.log('listening on :3000');
});