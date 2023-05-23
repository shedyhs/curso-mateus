import { Router } from 'express';
import { db } from './../database/prisma-client.mjs'
import { randomUUID } from 'node:crypto'

export const userRouter = Router();

userRouter.post('/users', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(422).json({ requiredFields: ['email', 'password'] });
  }
  const emailAlreadyExists = await db.user.findUnique({ where: { email } })
  if (emailAlreadyExists) {
    return res.status(409).json({ error: 'Email already exists' })
  }
  const user = await db.user.create({
    data: {
      id: randomUUID(),
      email,
      password,
    }
  });
  return res.status(201).json({ id: user.id });
});

userRouter.get('/users', async (_, res) => {
  const users = await db.user.findMany();
  return res.status(200).json({ users });
});

userRouter.put('/users/:id', async (req, res) => {
  const { id } = req.params;
  const { password } = req.body

  if(!password) {
    return res.status(422).json({requiredFields: ['password']})
  }

  const foundUser = await db.user.findUnique({ where: { id } });
  if (!foundUser) {
    return res.status(404).json({ error: 'User not found' });
  }
  await db.user.update({
    where: { id },
    data: { password }
  });
  return res.status(200).json({ id })
})

userRouter.get('/users/:id', async (req, res) => {
  const { id } = req.params;
  const user = await db.user.findUnique({ where: { id } });
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  return res.status(200).json({ user });
})

userRouter.delete('/users/:id', async (req, res) => {
  const { id } = req.params;
  await db.user.delete({ where: { id } });
  return res.status(204);
})