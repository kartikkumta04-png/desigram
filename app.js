const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// In-memory database for posts
let posts = [
  {
    id: 1,
    username: 'rohit_07',
    userImg: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    postImg: 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=600',
    likes: 1245,
    caption: 'Exploring new places! 🚀 #vibes'
  },
  {
    id: 2,
    username: 'priya_99',
    userImg: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    postImg: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600',
    likes: 852,
    caption: 'Evening sunset vibes ✨'
  }
];

let userPosts = [
  'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=300',
  'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=300',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300'
];

app.get('/', (req, res) => {
  let feedHtml = posts.map(p => `
    <div class="post">
        <div class="post-header">
            <div class="post-user">
                <img src="${p.userImg}" alt="">
                <span>${p.username}</span>
            </div>
            <span>⋮</span>
        </div>
        <img class="post-img" src="${p.postImg}" alt="">
        <div class="post-actions">
            <div class="post-actions-left">
                <span onclick="toggleLike(this)" style="cursor:pointer;">♡</span>
                <span>💬</span>
                <span>✈️</span>
            </div>
            <span>🔖</span>
        </div>
        <div class="post-likes">${p.likes} likes</div>
        <div class="post-caption"><span>${p.username}</span> ${p.caption}</div>
    </div>
  `).join('');

  let userGridHtml = userPosts.map(img => `
    <div class="grid-item"><img src="${img}" alt=""></div>
  `).join('');

  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Instagram</title>
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
            body { background-color: #000; color: #fff; padding-bottom: 60px; }
            
            /* Header */
            .header { display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; border-bottom: 1px solid #262626; position: sticky; top: 0; background: #000; z-index: 100; }
            .logo { font-size: 24px; font-weight: bold; font-family: cursive; letter-spacing: 1px; }
            .header-icons span { font-size: 22px; margin-left: 20px; cursor: pointer; }
            
            /* Stories */
            .stories { display: flex; overflow-x: auto; padding: 10px 0; border-bottom: 1px solid #262626; scrollbar-width: none; }
            .stories::-webkit-scrollbar { display: none; }
            .story { display: flex; flex-direction: column; align-items: center; margin-left: 12px; cursor: pointer; flex-shrink: 0; }
            .story-ring { width: 68px; height: 68px; border-radius: 50%; background: linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888); padding: 2px; display: flex; align-items: center; justify-content: center; }
            .story-img { width: 64px; height: 64px; border-radius: 50%; border: 2px solid #000; object-fit: cover; background: #333; }
            .story-name { font-size: 11px; margin-top: 4px; color: #f5f5f5; width: 72px; text-align: center; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

            /* Feed Posts */
            .post { margin-bottom: 15px; border-bottom: 1px solid #262626; }
            .post-header { display: flex; align-items: center; justify-content: space-between; padding: 10px 12px; }
            .post-user { display: flex; align-items: center; gap: 10px; }
            .post-user img { width: 32px; height: 32px; border-radius: 50%; object-fit: cover; }
            .post-user span { font-size: 14px; font-weight: 600; }
            .post-img { width: 100%; max-height: 450px; object-fit: cover; background: #111; }
            .post-actions { display: flex; justify-content: space-between; padding: 10px 12px; font-size: 22px; }
            .post-actions-left { display: flex; gap: 15px; }
            .post-likes { padding: 0 12px; font-size: 14px; font-weight: 600; margin-bottom: 4px; }
            .post-caption { padding: 0 12px 10px 12px; font-size: 14px; }
            .post-caption span { font-weight: 600; margin-right: 6px; }

            /* Bottom Nav */
            .bottom-nav { position: fixed; bottom: 0; left: 0; width: 100%; background: #000; border-top: 1px solid #262626; display: flex; justify-content: space-around; padding: 12px 0; z-index: 1000; }
            .nav-item { font-size: 24px; cursor: pointer; color: #8e8e8e; background: none; border: none; }
            .nav-item.active { color: #fff; }

            /* Pages */
            .page { display: none; }
            .page.active { display: block; }

            /* Create Post Form */
            .create-container { padding: 20px; max-width: 500px; margin: 0 auto; }
            .create-input { width: 100%; padding: 12px; margin-bottom: 15px; background: #262626; border: 1px solid #333; border-radius: 8px; color: #fff; font-size: 14px; }
            .create-btn { width: 100%; padding: 12px; background: #0095f6; color: #fff; border: none; border-radius: 8px; font-weight: 600; font-size: 14px; cursor: pointer; }

            /* Profile Page Styles */
            .profile-header { padding: 16px; }
            .profile-top { display: flex; align-items: center; justify-content: space-between; }
            .profile-avatar { width: 80px; height: 80px; border-radius: 50%; object-fit: cover; background: #333; }
            .profile-stats { display: flex; gap: 20px; text-align: center; }
            .stat-num { font-size: 18px; font-weight: bold; }
            .stat-label { font-size: 12px; color: #aaa; }
            .profile-bio { margin-top: 12px; font-size: 14px; line-height: 1.4; }
            .profile-bio b { font-weight: 600; }
            .profile-actions { display: flex; gap: 8px; margin-top: 15px; }
            .profile-btn { flex: 1; background: #262626; color: #fff; border: none; padding: 7px; border-radius: 6px; font-weight: 600; font-size: 14px; cursor: pointer; }
            .profile-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2px; margin-top: 15px; }
            .grid-item { aspect-ratio: 1; background: #222; }
            .grid-item img { width: 100%; height: 100%; object-fit: cover; }
        </style>
    </head>
    <body>

        <!-- HOME PAGE -->
        <div id="home-page" class="page active">
            <div class="header">
                <div class="logo">Instagram</div>
                <div class="header-icons">
                    <span>♡</span>
                    <span>✈️</span>
                </div>
            </div>

            <!-- Stories Bar -->
            <div class="stories">
                <div class="story">
                    <div class="story-ring"><img class="story-img" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150" alt=""></div>
                    <div class="story-name">Your Story</div>
                </div>
                <div class="story">
                    <div class="story-ring"><img class="story-img" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150" alt=""></div>
                    <div class="story-name">rohit_07</div>
                </div>
                <div class="story">
                    <div class="story-ring"><img class="story-img" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150" alt=""></div>
                    <div class="story-name">priya_99</div>
                </div>
            </div>

            <!-- Feed Posts -->
            ${feedHtml}
        </div>

        <!-- SEARCH PAGE -->
        <div id="search-page" class="page">
            <div style="padding: 12px;">
                <input type="text" placeholder="Search" style="width: 100%; padding: 10px; background: #262626; border: none; border-radius: 8px; color: #fff; font-size: 14px;">
            </div>
            <div class="profile-grid">
                ${userGridHtml}
                <div class="grid-item"><img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300" alt=""></div>
                <div class="grid-item"><img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300" alt=""></div>
            </div>
        </div>

        <!-- CREATE POST PAGE -->
        <div id="create-page" class="page">
            <div class="header">
                <div style="font-weight: bold; font-size: 16px;">Nayi Post Banayein</div>
                <span onclick="switchPage('home', document.querySelectorAll('.nav-item')[0])" style="cursor:pointer; font-size:18px;">✕</span>
            </div>
            <div class="create-container">
                <form action="/add-post" method="POST">
                    <input type="text" name="imageUrl" class="create-input" placeholder="Image URL ya Photo Link dalein" required>
                    <textarea name="caption" class="create-input" placeholder="Caption likhein..." rows="4" required></textarea>
                    <button type="submit" class="create-btn">Post Share Karein</button>
                </form>
            </div>
        </div>

        <!-- REELS PAGE -->
        <div id="reels-page" class="page">
            <div style="height: 80vh; display: flex; align-items: center; justify-content: center; font-size: 16px; color: #888;">
                Reels feed coming soon...
            </div>
        </div>

        <!-- PROFILE PAGE -->
        <div id="profile-page" class="page">
            <div class="header">
                <div style="font-weight: bold; font-size: 16px;">kartik_official 🔒</div>
                <div class="header-icons">
                    <span>☰</span>
                </div>
            </div>
            <div class="profile-header">
                <div class="profile-top">
                    <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150" class="profile-avatar" alt="">
                    <div class="profile-stats">
                        <div>
                            <div class="stat-num">${userPosts.length}</div>
                            <div class="stat-label">Posts</div>
                        </div>
                        <div>
                            <div class="stat-num">1.2K</div>
                            <div class="stat-label">Followers</div>
                        </div>
                        <div>
                            <div class="stat-num">240</div>
                            <div class="stat-label">Following</div>
                        </div>
                    </div>
                </div>
                <div class="profile-bio">
                    <b>Kartik Ganapati</b><br>
                    ⚡ Creator & Developer<br>
                    📍 Kumta, Karnataka
                </div>
                <div class="profile-actions">
                    <button class="profile-btn">Edit profile</button>
                    <button class="profile-btn">Share profile</button>
                </div>
            </div>

            <!-- Profile Grid -->
            <div class="profile-grid">
                ${userGridHtml}
            </div>
        </div>

        <!-- BOTTOM NAVIGATION -->
        <div class="bottom-nav">
            <button class="nav-item active" onclick="switchPage('home', this)">🏠</button>
            <button class="nav-item" onclick="switchPage('search', this)">🔍</button>
            <button class="nav-item" onclick="switchPage('create', this)">➕</button>
            <button class="nav-item" onclick="switchPage('reels', this)">▶️</button>
            <button class="nav-item" onclick="switchPage('profile', this)">👤</button>
        </div>

        <script>
            function switchPage(pageName, element) {
                document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
                document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
                
                document.getElementById(pageName + '-page').classList.add('active');
                if(element) element.classList.add('active');
            }

            function toggleLike(btn) {
                if (btn.innerText === '♡') {
                    btn.innerText = '❤️';
                    btn.style.color = '#ff3040';
                } else {
                    btn.innerText = '♡';
                    btn.style.color = '#fff';
                }
            }
        </script>
    </body>
    </html>
  `);
});

app.post('/add-post', (req, res) => {
  const { imageUrl, caption } = req.body;
  if (imageUrl && caption) {
    posts.unshift({
      id: posts.length + 1,
      username: 'kartik_official',
      userImg: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      postImg: imageUrl,
      likes: 1,
      caption: caption
    });
    userPosts.unshift(imageUrl);
  }
  res.redirect('/');
});

app.listen(PORT, () => {
  console.log('Server running on port ' + PORT);
});
