"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Heart, MessageCircle, MoreHorizontal, User, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LikeButton } from "./LikeButton";
import { ReplyBox } from "./ReplyBox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

interface Comment {
  _id: string;
  content: string;
  author: {
    _id: string;
    username: string;
    profilePicture?: string;
  };
  likes: string[];
  likesCount: number;
  replies: Comment[];
  createdAt: string;
  parentId?: string;
}

interface CommentCardProps {
  comment: Comment;
  onReply?: (commentId: string, content: string) => void;
  onLike?: (commentId: string) => void;
  onEdit?: (commentId: string, content: string) => void;
  onDelete?: (commentId: string) => void;
  currentUserId?: string;
  level?: number;
}

export function CommentCard({ 
  comment, 
  onReply, 
  onLike, 
  onEdit,
  onDelete,
  currentUserId, 
  level = 0 
}: CommentCardProps) {
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);

  const handleReply = (content: string) => {
    if (onReply) {
      onReply(comment._id, content);
      setShowReplyBox(false);
    }
  };

  const handleEdit = () => {
    if (onEdit && editContent.trim()) {
      onEdit(comment._id, editContent);
      setIsEditing(false);
    }
  };

  const handleDelete = () => {
    if (onDelete && confirm('Are you sure you want to delete this comment?')) {
      onDelete(comment._id);
    }
  };

  const isLiked = currentUserId && comment.likes ? comment.likes.includes(currentUserId) : false;
  const isOwner = currentUserId === comment.author._id;

  return (
    <div className={`${level > 0 ? 'ml-8 border-l-2 border-muted pl-4' : ''}`}>
      <div className="bg-card rounded-lg p-4 mb-4 border border-border">
        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
            {comment.author?.profilePicture ? (
              <img 
                src={comment.author.profilePicture} 
                alt={comment.author?.username || 'User'}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <User className="w-5 h-5 text-primary-foreground" />
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Link href={`/profile/${comment.author?.username || ''}`}>
                  <h4 className="font-semibold text-sm hover:text-primary cursor-pointer">
                    {comment.author?.username || 'Unknown User'}
                  </h4>
                </Link>
                <span className="text-xs text-muted-foreground">
                  {comment.createdAt ? formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true }) : 'Unknown time'}
                </span>
              </div>
              {isOwner && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setIsEditing(true)} className="cursor-pointer">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleDelete} className="text-destructive cursor-pointer focus:text-destructive">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
            
            {isEditing ? (
              <div className="mt-2">
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full p-3 border border-border rounded-lg resize-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background"
                  rows={3}
                  placeholder="Edit your comment..."
                />
                <div className="flex justify-end space-x-2 mt-3">
                  <Button size="sm" variant="outline" onClick={() => {
                    setIsEditing(false);
                    setEditContent(comment.content);
                  }}>
                    Cancel
                  </Button>
                  <Button size="sm" onClick={handleEdit} disabled={!editContent.trim()}>
                    Save Changes
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-sm mt-2 text-foreground">{comment.content}</p>
            )}
            
            <div className="flex items-center space-x-4 mt-3">
              <LikeButton
                isLiked={isLiked}
                likesCount={comment.likesCount}
                onLike={() => onLike?.(comment._id)}
              />
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowReplyBox(!showReplyBox)}
                className="text-muted-foreground hover:text-foreground"
              >
                <MessageCircle className="w-4 h-4 mr-1" />
                Reply
              </Button>
              
              {comment.replies && comment.replies.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowReplies(!showReplies)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  {showReplies ? 'Hide' : 'Show'} {comment.replies.length} replies
                </Button>
              )}
            </div>
          </div>
        </div>
        
        {showReplyBox && (
          <div className="mt-4">
            <ReplyBox onSubmit={handleReply} />
          </div>
        )}
      </div>
      
      {showReplies && comment.replies && comment.replies.length > 0 && (
        <div>
          {comment.replies.map((reply) => (
            <CommentCard
              key={`reply-${reply._id}`}
              comment={reply}
              onReply={onReply}
              onLike={onLike}
              onEdit={onEdit}
              onDelete={onDelete}
              currentUserId={currentUserId}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}