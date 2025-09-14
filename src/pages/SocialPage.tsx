import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  CardActions,
  CardMedia,
  Avatar,
  IconButton,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Chip,
  Stack,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Fab,
  Alert,
  Grid,
  Paper,
  Badge,
  Tooltip
} from '@mui/material';
import {
  Favorite,
  FavoriteBorder,
  Comment as CommentIcon,
  Share,
  Add,
  Image,
  VideoFile,
  Send,
  Verified,
  TrendingUp,
  PersonAdd,
  Star
} from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth';
import { SocialPost, Comment, MediaType } from '../models';
import { demoAthletes, motivationalQuotes, AthleteProfile } from '../data/demoData';
import AthleteProfileView from '../components/AthleteProfileView';

const SocialPage: React.FC = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [openCreatePost, setOpenCreatePost] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [commentInputs, setCommentInputs] = useState<{ [key: string]: string }>({});
  const [selectedAthlete, setSelectedAthlete] = useState<AthleteProfile | null>(null);
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  // Load demo posts on mount
  useEffect(() => {
    const demoPosts: SocialPost[] = [
      {
        id: '1',
        athleteId: 'sarah_johnson',
        athleteName: 'Sarah Johnson',
        athleteProfilePicture: '',
        content: 'Just smashed my PR in the 100m! 🏃‍♀️⚡ 11.15 seconds - feeling unstoppable! Months of hard training finally paying off. Next goal: sub-11! #SprintLife #PersonalRecord #NeverSettle',
        mediaUrl: '',
        mediaType: MediaType.IMAGE,
        likes: 47,
        likedBy: ['mike_chen', 'alex_rivera', 'emma_wilson', 'jordan_smith'],
        comments: [
          {
            id: 'c1',
            athleteId: 'mike_chen',
            athleteName: 'Mike Chen',
            content: 'INCREDIBLE time Sarah! That sub-11 is definitely coming soon 🔥🏆',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000)
          },
          {
            id: 'c1b',
            athleteId: 'coach_martinez',
            athleteName: 'Coach Martinez',
            content: 'Excellent work! Your form improvements really showed today. Keep this momentum!',
            timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000)
          }
        ],
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000)
      },
      {
        id: '2',
        athleteId: 'mike_chen',
        athleteName: 'Mike Chen',
        athleteProfilePicture: '',
        content: '🧘‍♂️ Recovery day wisdom: Your body builds strength during rest, not just during training. Today\'s agenda: yoga, massage, proper nutrition, and 8+ hours of sleep. Tomorrow we go again! #RecoveryDay #MindfulTraining #Balance',
        mediaUrl: '',
        mediaType: MediaType.IMAGE,
        likes: 32,
        likedBy: ['sarah_johnson', 'emma_wilson', 'tyler_brooks'],
        comments: [
          {
            id: 'c2a',
            athleteId: 'emma_wilson',
            athleteName: 'Emma Wilson',
            content: 'This! Rest days are when the magic happens 💯 Thanks for the reminder',
            timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000)
          }
        ],
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000)
      },
      {
        id: '3',
        athleteId: 'alex_rivera',
        athleteName: 'Alex Rivera',
        athleteProfilePicture: '',
        content: '🏀 Incredible team practice today! Our ball movement and defensive rotations are looking crisp. 3 weeks until playoffs and we\'re peaking at the right time. This group has something special! #TeamWork #PlayoffBound #Basketball',
        mediaUrl: '',
        mediaType: MediaType.VIDEO,
        likes: 56,
        likedBy: ['sarah_johnson', 'jordan_smith', 'tyler_brooks', 'emma_wilson'],
        comments: [
          {
            id: 'c3a',
            athleteId: 'sarah_johnson',
            athleteName: 'Sarah Johnson',
            content: 'The chemistry you all have is amazing! Rooting for you in playoffs 🏆',
            timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000)
          },
          {
            id: 'c3b',
            athleteId: 'emma_wilson',
            athleteName: 'Emma Wilson',
            content: 'That defensive pressure looked intense! Championship level for sure 💪',
            timestamp: new Date(Date.now() - 30 * 60 * 1000)
          },
          {
            id: 'c3c',
            athleteId: 'coach_thompson',
            athleteName: 'Coach Thompson',
            content: 'Proud of this team\'s growth. Keep executing like this!',
            timestamp: new Date(Date.now() - 15 * 60 * 1000)
          }
        ],
        timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000)
      },
      {
        id: '4',
        athleteId: 'emma_wilson',
        athleteName: 'Emma Wilson',
        athleteProfilePicture: '',
        content: '🏊‍♀️ 6AM pool session complete! ✅ 3000m freestyle, working on breathing technique and stroke efficiency. The grind doesn\'t stop, even when it\'s cold and dark outside. Championships are won in moments like these! #SwimLife #EarlyBird #Dedication',
        mediaUrl: '',
        mediaType: MediaType.IMAGE,
        likes: 39,
        likedBy: ['mike_chen', 'alex_rivera', 'tyler_brooks', 'jordan_smith'],
        comments: [
          {
            id: 'c4a',
            athleteId: 'tyler_brooks',
            athleteName: 'Tyler Brooks',
            content: '6AM?! You\'re a machine Emma! 🤖💪 Inspiring dedication',
            timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000)
          },
          {
            id: 'c4b',
            athleteId: 'mike_chen',
            athleteName: 'Mike Chen',
            content: 'The commitment is unreal! Your technique has improved so much this season',
            timestamp: new Date(Date.now() - 5.5 * 60 * 60 * 1000)
          }
        ],
        timestamp: new Date(Date.now() - 7 * 60 * 60 * 1000)
      },
      {
        id: '5',
        athleteId: 'jordan_smith',
        athleteName: 'Jordan Smith',
        athleteProfilePicture: '',
        content: '⚽ What a match today! Scored 2 goals and had an assist, but more importantly we secured our spot in the finals! 🏆 This team has been through everything together. One more game to achieve our dream! #Soccer #Finals #TeamFirst #DreamsComeTrue',
        mediaUrl: '',
        mediaType: MediaType.VIDEO,
        likes: 73,
        likedBy: ['sarah_johnson', 'mike_chen', 'alex_rivera', 'emma_wilson', 'tyler_brooks'],
        comments: [
          {
            id: 'c5a',
            athleteId: 'sarah_johnson',
            athleteName: 'Sarah Johnson',
            content: 'What a performance! You were unstoppable out there ⚽🔥',
            timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000)
          },
          {
            id: 'c5b',
            athleteId: 'alex_rivera',
            athleteName: 'Alex Rivera',
            content: 'Those goals were pure class! Good luck in the finals! 🏆',
            timestamp: new Date(Date.now() - 2.5 * 60 * 60 * 1000)
          },
          {
            id: 'c5c',
            athleteId: 'coach_rodriguez',
            athleteName: 'Coach Rodriguez',
            content: 'Outstanding leadership on the field today Jordan. This is why you\'re our captain!',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000)
          }
        ],
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000)
      },
      {
        id: '6',
        athleteId: 'tyler_brooks',
        athleteName: 'Tyler Brooks',
        athleteProfilePicture: '',
        content: '🏋️‍♂️ New deadlift PR! 405lbs x 3 reps! 💪 Been working on this for months. Proper form, progressive overload, and consistency paying off. Remember: strength isn\'t just physical - it\'s mental too! #StrengthTraining #PowerLifting #MindOverMatter #PR',
        mediaUrl: '',
        mediaType: MediaType.IMAGE,
        likes: 28,
        likedBy: ['mike_chen', 'jordan_smith', 'alex_rivera'],
        comments: [
          {
            id: 'c6a',
            athleteId: 'mike_chen',
            athleteName: 'Mike Chen',
            content: 'Beast mode activated! 405 is serious weight 🦍💪',
            timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000)
          },
          {
            id: 'c6b',
            athleteId: 'alex_rivera',
            athleteName: 'Alex Rivera',
            content: 'Form looked perfect too! That\'s how you lift safely and effectively 👌',
            timestamp: new Date(Date.now() - 11 * 60 * 60 * 1000)
          }
        ],
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000)
      },
      {
        id: '7',
        athleteId: 'maya_patel',
        athleteName: 'Maya Patel',
        athleteProfilePicture: '',
        content: '🏃‍♀️ Marathon training update: Just completed a 20-mile long run! Average pace 7:15/mile. Legs are tired but spirit is strong. 6 weeks until race day and I\'m feeling more confident than ever! Boston Marathon here I come! 🏃‍♀️🇺🇸 #MarathonTraining #BostonBound #RunStrong',
        mediaUrl: '',
        mediaType: MediaType.IMAGE,
        likes: 45,
        likedBy: ['sarah_johnson', 'emma_wilson', 'mike_chen', 'tyler_brooks'],
        comments: [
          {
            id: 'c7a',
            athleteId: 'emma_wilson',
            athleteName: 'Emma Wilson',
            content: '20 miles at that pace?! You\'re ready for Boston! 🔥🏃‍♀️',
            timestamp: new Date(Date.now() - 18 * 60 * 60 * 1000)
          },
          {
            id: 'c7b',
            athleteId: 'sarah_johnson',
            athleteName: 'Sarah Johnson',
            content: 'Incredible endurance Maya! That qualifying time is definitely happening 💪',
            timestamp: new Date(Date.now() - 17 * 60 * 60 * 1000)
          }
        ],
        timestamp: new Date(Date.now() - 19 * 60 * 60 * 1000)
      },
      {
        id: '8',
        athleteId: 'carlos_mendez',
        athleteName: 'Carlos Mendez',
        athleteProfilePicture: '',
        content: '🥊 Sparring session was intense today! Working on footwork, head movement, and counter-punching. Every round teaches you something new. Big fight coming up in 3 weeks - time to dial in the final details! #Boxing #SparringDay #FightPrep #StayHungry',
        mediaUrl: '',
        mediaType: MediaType.VIDEO,
        likes: 34,
        likedBy: ['tyler_brooks', 'jordan_smith', 'alex_rivera'],
        comments: [
          {
            id: 'c8a',
            athleteId: 'tyler_brooks',
            athleteName: 'Tyler Brooks',
            content: 'Your combinations are getting sharper! Looking dangerous in there 🥊',
            timestamp: new Date(Date.now() - 22 * 60 * 60 * 1000)
          },
          {
            id: 'c8b',
            athleteId: 'trainer_garcia',
            athleteName: 'Trainer Garcia',
            content: 'Great work today Carlos. Your defense has improved tremendously.',
            timestamp: new Date(Date.now() - 21 * 60 * 60 * 1000)
          }
        ],
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000)
      }
    ];
    
    // Load posts from localStorage or use demo data
    const storedPosts = localStorage.getItem('athletex_social_posts');
    if (storedPosts) {
      try {
        const parsedPosts = JSON.parse(storedPosts).map((post: any) => ({
          ...post,
          timestamp: new Date(post.timestamp),
          comments: post.comments.map((comment: any) => ({
            ...comment,
            timestamp: new Date(comment.timestamp)
          }))
        }));
        setPosts(parsedPosts);
      } catch {
        setPosts(demoPosts);
      }
    } else {
      setPosts(demoPosts);
    }
  }, []);

  // Save posts to localStorage whenever posts change
  useEffect(() => {
    localStorage.setItem('athletex_social_posts', JSON.stringify(posts));
  }, [posts]);

  const handleLike = (postId: string) => {
    if (!user) return;
    
    setPosts(prevPosts => 
      prevPosts.map(post => {
        if (post.id === postId) {
          const isLiked = post.likedBy.includes(user.uid);
          return {
            ...post,
            likes: isLiked ? post.likes - 1 : post.likes + 1,
            likedBy: isLiked 
              ? post.likedBy.filter(id => id !== user.uid)
              : [...post.likedBy, user.uid]
          };
        }
        return post;
      })
    );
  };

  const handleComment = (postId: string) => {
    if (!user || !commentInputs[postId]?.trim()) return;
    
    const newComment: Comment = {
      id: 'c_' + Date.now(),
      athleteId: user.uid,
      athleteName: user.displayName || 'Athlete',
      content: commentInputs[postId].trim(),
      timestamp: new Date()
    };

    setPosts(prevPosts => 
      prevPosts.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            comments: [...post.comments, newComment]
          };
        }
        return post;
      })
    );

    setCommentInputs(prev => ({ ...prev, [postId]: '' }));
  };

  const handleCreatePost = () => {
    if (!user || !newPostContent.trim()) return;

    const newPost: SocialPost = {
      id: 'p_' + Date.now(),
      athleteId: user.uid,
      athleteName: user.displayName || 'Athlete',
      athleteProfilePicture: '',
      content: newPostContent.trim(),
      mediaUrl: selectedFile ? URL.createObjectURL(selectedFile) : '',
      mediaType: selectedFile?.type.startsWith('video/') ? MediaType.VIDEO : MediaType.IMAGE,
      likes: 0,
      likedBy: [],
      comments: [],
      timestamp: new Date()
    };

    setPosts(prevPosts => [newPost, ...prevPosts]);
    setNewPostContent('');
    setSelectedFile(null);
    setOpenCreatePost(false);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    return 'Just now';
  };

  const handleAthleteClick = (athleteId: string) => {
    const athlete = demoAthletes.find(a => a.id === athleteId);
    if (athlete) {
      setSelectedAthlete(athlete);
      setProfileModalOpen(true);
    }
  };

  const handleCloseProfileModal = () => {
    setProfileModalOpen(false);
    setSelectedAthlete(null);
  };

  const getRandomQuote = () => motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
  const featuredAthletes = demoAthletes.slice(0, 5); // Show top 5 athletes
  const trendingHashtags = ['#TrainingDay', '#PersonalRecord', '#TeamWork', '#NeverGiveUp', '#ChampionMindset'];

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Grid container spacing={3}>
        {/* Main Content */}
        <Grid item xs={12} md={8}>
          <Typography variant="h4" component="h1" gutterBottom>
            Social Feed
          </Typography>
          
          {posts.length === 0 && (
            <Alert severity="info" sx={{ mb: 3 }}>
              No posts yet! Create your first post to get started.
            </Alert>
          )}

          {/* Posts Feed */}
          <Stack spacing={3}>
            {posts.map((post) => (
              <Card key={post.id} elevation={2}>
            {/* Post Header */}
            <CardContent sx={{ pb: 1 }}>
              <Box display="flex" alignItems="center" mb={2}>
                <Avatar sx={{ mr: 2 }}>
                  {post.athleteName.charAt(0).toUpperCase()}
                </Avatar>
                <Box flex={1}>
                  <Box display="flex" alignItems="center" gap={0.5}>
                    <Typography 
                      variant="subtitle1" 
                      fontWeight="bold"
                      sx={{ 
                        cursor: 'pointer', 
                        '&:hover': { color: 'primary.main' } 
                      }}
                      onClick={() => handleAthleteClick(post.athleteId)}
                    >
                      {post.athleteName}
                    </Typography>
                    {/* Show verified badge for some demo athletes */}
                    {['sarah_johnson', 'emma_wilson', 'jordan_smith'].includes(post.athleteId) && (
                      <Tooltip title="Verified Athlete">
                        <Verified color="primary" sx={{ fontSize: 16 }} />
                      </Tooltip>
                    )}
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    {formatTimestamp(post.timestamp)}
                  </Typography>
                </Box>
              </Box>
              
              {/* Post Content */}
              <Typography variant="body1" mb={2}>
                {post.content}
              </Typography>
            </CardContent>

            {/* Media */}
            {post.mediaUrl && (
              <CardMedia
                component={post.mediaType === MediaType.VIDEO ? 'video' : 'img'}
                sx={{ height: 300 }}
                image={post.mediaType === MediaType.IMAGE ? post.mediaUrl : undefined}
                src={post.mediaType === MediaType.VIDEO ? post.mediaUrl : undefined}
                controls={post.mediaType === MediaType.VIDEO}
              />
            )}

            {/* Post Actions */}
            <CardActions sx={{ px: 2, py: 1 }}>
              <Button
                startIcon={
                  user && post.likedBy.includes(user.uid) ? 
                    <Favorite color="error" /> : 
                    <FavoriteBorder />
                }
                onClick={() => handleLike(post.id)}
                size="small"
              >
                {post.likes}
              </Button>
              <Button startIcon={<CommentIcon />} size="small">
                {post.comments.length}
              </Button>
              <Button startIcon={<Share />} size="small">
                Share
              </Button>
            </CardActions>

            <Divider />

            {/* Comments */}
            <CardContent sx={{ pt: 1 }}>
              {post.comments.length > 0 && (
                <List dense sx={{ mb: 2 }}>
                  {post.comments.map((comment) => (
                    <ListItem key={comment.id} sx={{ px: 0 }}>
                      <ListItemAvatar>
                        <Avatar sx={{ width: 32, height: 32 }}>
                          {comment.athleteName.charAt(0).toUpperCase()}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box>
                            <Typography variant="subtitle2" component="span" fontWeight="bold">
                              {comment.athleteName}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                              {formatTimestamp(comment.timestamp)}
                            </Typography>
                          </Box>
                        }
                        secondary={comment.content}
                      />
                    </ListItem>
                  ))}
                </List>
              )}
              
              {/* Comment Input */}
              <Box display="flex" alignItems="center" gap={1}>
                <Avatar sx={{ width: 32, height: 32 }}>
                  {user?.displayName?.charAt(0).toUpperCase() || 'U'}
                </Avatar>
                <TextField
                  fullWidth
                  placeholder="Write a comment..."
                  variant="outlined"
                  size="small"
                  value={commentInputs[post.id] || ''}
                  onChange={(e) => setCommentInputs(prev => ({
                    ...prev,
                    [post.id]: e.target.value
                  }))}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleComment(post.id);
                    }
                  }}
                />
                <IconButton
                  color="primary"
                  onClick={() => handleComment(post.id)}
                  disabled={!commentInputs[post.id]?.trim()}
                >
                  <Send />
                </IconButton>
              </Box>
            </CardContent>
          </Card>
            ))}
          </Stack>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          <Stack spacing={3}>
            {/* Daily Motivation */}
            <Paper sx={{ p: 2, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
              <Box display="flex" alignItems="center" mb={1}>
                <Star sx={{ mr: 1 }} />
                <Typography variant="h6">Daily Motivation</Typography>
              </Box>
              <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                "{getRandomQuote()}"
              </Typography>
            </Paper>

            {/* Featured Athletes */}
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Featured Athletes
              </Typography>
              <Stack spacing={2}>
                {featuredAthletes.map((athlete) => (
                  <Box key={athlete.id} display="flex" alignItems="center" gap={2}>
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                      {athlete.name.charAt(0)}
                    </Avatar>
                    <Box 
                      flex={1} 
                      sx={{ cursor: 'pointer' }}
                      onClick={() => handleAthleteClick(athlete.id)}
                    >
                      <Box display="flex" alignItems="center" gap={0.5}>
                        <Typography 
                          variant="subtitle2" 
                          fontWeight="bold"
                          sx={{ '&:hover': { color: 'primary.main' } }}
                        >
                          {athlete.name}
                        </Typography>
                        {athlete.verified && (
                          <Verified color="primary" sx={{ fontSize: 14 }} />
                        )}
                      </Box>
                      <Typography variant="caption" color="text.secondary">
                        {athlete.sport} • {athlete.location}
                      </Typography>
                      <Typography variant="caption" display="block" color="text.secondary">
                        {athlete.followers.toLocaleString()} followers
                      </Typography>
                    </Box>
                    <Button size="small" startIcon={<PersonAdd />} variant="outlined">
                      Follow
                    </Button>
                  </Box>
                ))}
              </Stack>
            </Paper>

            {/* Trending Hashtags */}
            <Paper sx={{ p: 2 }}>
              <Box display="flex" alignItems="center" mb={2}>
                <TrendingUp sx={{ mr: 1 }} />
                <Typography variant="h6">Trending</Typography>
              </Box>
              <Stack spacing={1}>
                {trendingHashtags.map((hashtag, index) => (
                  <Box key={hashtag} display="flex" alignItems="center" justifyContent="space-between">
                    <Typography variant="body2" color="primary" sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>
                      {hashtag}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {Math.floor(Math.random() * 100) + 50}k posts
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Paper>

            {/* Quick Stats */}
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Community Stats
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="h4" color="primary" fontWeight="bold">
                    {demoAthletes.length}
                  </Typography>
                  <Typography variant="caption">Active Athletes</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="h4" color="secondary" fontWeight="bold">
                    {posts.length}
                  </Typography>
                  <Typography variant="caption">Recent Posts</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="h4" color="success.main" fontWeight="bold">
                    {Math.floor(Math.random() * 50) + 100}
                  </Typography>
                  <Typography variant="caption">PRs This Week</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="h4" color="warning.main" fontWeight="bold">
                    {Math.floor(Math.random() * 20) + 30}
                  </Typography>
                  <Typography variant="caption">Competitions</Typography>
                </Grid>
              </Grid>
            </Paper>
          </Stack>
        </Grid>
      </Grid>

      {/* Floating Action Button */}
      <Fab
        color="primary"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={() => setOpenCreatePost(true)}
      >
        <Add />
      </Fab>

      {/* Create Post Dialog */}
      <Dialog open={openCreatePost} onClose={() => setOpenCreatePost(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Post</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            multiline
            rows={4}
            fullWidth
            placeholder="What's on your mind?"
            variant="outlined"
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
            sx={{ mt: 1, mb: 2 }}
          />
          
          <Box display="flex" gap={1} mb={2}>
            <Button
              component="label"
              variant="outlined"
              startIcon={<Image />}
              size="small"
            >
              Add Photo
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleFileSelect}
              />
            </Button>
            <Button
              component="label"
              variant="outlined"
              startIcon={<VideoFile />}
              size="small"
            >
              Add Video
              <input
                type="file"
                hidden
                accept="video/*"
                onChange={handleFileSelect}
              />
            </Button>
          </Box>
          
          {selectedFile && (
            <Chip
              label={`Selected: ${selectedFile.name}`}
              onDelete={() => setSelectedFile(null)}
              color="primary"
              variant="outlined"
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setOpenCreatePost(false);
            setNewPostContent('');
            setSelectedFile(null);
          }}>
            Cancel
          </Button>
          <Button
            onClick={handleCreatePost}
            variant="contained"
            disabled={!newPostContent.trim()}
          >
            Post
          </Button>
        </DialogActions>
      </Dialog>

      {/* Athlete Profile Modal */}
      <Dialog 
        open={profileModalOpen} 
        onClose={handleCloseProfileModal} 
        maxWidth="lg" 
        fullWidth
        PaperProps={{
          sx: { minHeight: '80vh' }
        }}
      >
        <DialogContent sx={{ p: 0 }}>
          {selectedAthlete && (
            <AthleteProfileView 
              athlete={selectedAthlete}
              onFollow={() => {
                console.log('Following', selectedAthlete.name);
                // Add follow functionality here
              }}
              onMessage={() => {
                console.log('Messaging', selectedAthlete.name);
                // Add messaging functionality here
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default SocialPage;
