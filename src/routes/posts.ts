import { Router, Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import Post, { IPost } from '../models/Post';
import config from '../config';

const router = Router();

interface AuthenticatedRequest extends Request {
    user?: { userId: string };
}

const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) return res.status(401).send('Access denied');

    jwt.verify(token, config.jwtSecret, (err, user) => {
        if (err) return res.status(403).send('Invalid token');
        req.user = user as { userId: string };
        next();
    });
};

router.get('/', async (_req: Request, res: Response) => {
    console.log(`Received a GET request on ${_req.url}`);
    try {
        const posts = await Post.find().populate('author', 'username');
        res.json([{ success: true, data: posts }]);

    } catch (error) {
        res.status(400).send('Error fetching posts');
    }
});

router.post('/', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { title, content } = req.body;
        const post: IPost = new Post({ title, content, author: req.user?.userId });
        await post.save();
        res.status(201).json(post);
    } catch (error) {
        res.status(400).send('Error creating post');
    }
});



router.put('/:id', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { title, content } = req.body;
        const post = await Post.findOneAndUpdate(
            { _id: req.params.id, author: req.user?.userId },
            { title, content },
            { new: true }
        );
        if (!post) return res.status(404).send('Post not found');
        res.json(post);
    } catch (error) {
        res.status(400).send('Error updating post');
    }
});

router.delete('/:id', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
        const post = await Post.findOneAndDelete({ _id: req.params.id, author: req.user?.userId });
        if (!post) return res.status(404).send('Post not found');
        res.send('Post deleted');
    } catch (error) {
        res.status(400).send('Error deleting post');
    }
});

export default router;
