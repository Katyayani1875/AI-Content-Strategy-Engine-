import praw
from app.core import config
from app.schemas.trend import RedditData, RedditPost

def fetch_reddit_trends(topic: str) -> RedditData:
    try:
        reddit = praw.Reddit(
            client_id=config.REDDIT_CLIENT_ID,
            client_secret=config.REDDIT_CLIENT_SECRET,
            user_agent=config.REDDIT_USER_AGENT,
        )
        
        # Search across popular, relevant subreddits
        subreddits = ["news", "technology", "askreddit", "todayilearned", "explainlikeimfive"]
        all_posts = []

        for sub in subreddits:
            subreddit = reddit.subreddit(sub)
            # Limit to 5 top posts from this week per subreddit to keep it fast
            for submission in subreddit.search(topic, sort="top", time_filter="week", limit=5):
                all_posts.append(
                    RedditPost(
                        title=submission.title,
                        url=submission.url,
                        subreddit=submission.subreddit.display_name,
                        upvotes=submission.score
                    )
                )
        
        # Sort all collected posts by upvotes and take the top 10 overall
        top_threads = sorted(all_posts, key=lambda p: p.upvotes, reverse=True)[:10]

        return RedditData(top_threads=top_threads)
    except Exception as e:
        print(f"Error fetching Reddit data: {e}")
        return RedditData(top_threads=[])