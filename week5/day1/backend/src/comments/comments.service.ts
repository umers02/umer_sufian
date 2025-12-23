import { Injectable } from '@nestjs/common';
import { Comment } from './comment.interface';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CommentsService {
  private comments: Comment[] = [];

  getAllComments(): Comment[] {
    return this.buildCommentTree();
  }

  addComment(username: string, message: string, parentId?: string): Comment {
    const comment: Comment = {
      id: uuidv4(),
      username,
      message,
      timestamp: new Date(),
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=random&size=40`,
      parentId,
      replies: [],
      likes: 0,
      likedBy: []
    };
    
    this.comments.push(comment);
    return comment;
  }

  deleteComment(commentId: string, username: string): boolean {
    const comment = this.comments.find(c => c.id === commentId && c.username === username);
    if (!comment) return false;

    // Collect all replies recursively
    const toDelete = new Set<string>();
    const stack = [commentId];
    
    while (stack.length > 0) {
      const id = stack.pop()!;
      toDelete.add(id);
      // Find all replies to this comment
      this.comments.forEach(c => {
        if (c.parentId === id) {
          stack.push(c.id);
        }
      });
    }

    // Remove all collected comments
    this.comments = this.comments.filter(c => !toDelete.has(c.id));
    return true;
  }

  likeComment(commentId: string, username: string): boolean {
    const comment = this.comments.find(c => c.id === commentId);
    if (!comment) return false;

    // Initialize likes fields if they don't exist
    if (!comment.likedBy) comment.likedBy = [];
    if (comment.likes === undefined) comment.likes = 0;

    const likedIndex = comment.likedBy.indexOf(username);
    if (likedIndex > -1) {
      comment.likedBy.splice(likedIndex, 1);
      comment.likes--;
    } else {
      comment.likedBy.push(username);
      comment.likes++;
    }
    return true;
  }

  private buildCommentTree(): Comment[] {
    const commentMap = new Map<string, Comment>();
    const rootComments: Comment[] = [];

    // First pass: create map of all comments with empty replies
    this.comments.forEach(comment => {
      commentMap.set(comment.id, { 
        ...comment, 
        replies: [],
        likes: comment.likes || 0,
        likedBy: comment.likedBy || []
      });
    });

    // Second pass: build tree structure
    this.comments.forEach(comment => {
      const commentWithReplies = commentMap.get(comment.id);
      if (comment.parentId && commentMap.has(comment.parentId)) {
        const parent = commentMap.get(comment.parentId);
        if (parent && parent.replies) {
          parent.replies.push(commentWithReplies);
          // Sort replies by timestamp
          parent.replies.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
        }
      } else {
        rootComments.push(commentWithReplies);
      }
    });

    // Sort root comments by timestamp
    return rootComments.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }
}