const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

let posts = [
  {
    id: 1,
    username: 'rohit_07',
    userImg: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    mediaUrl: 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=600',
    mediaType: 'image',
    likes: 1245,
    caption: 'Exploring new places! 🚀 #vibes'
  },
  {
    id: 2,
    username: 'priya_99',
    userImg: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    mediaUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600',
    mediaType: 'image',
    likes: 852,
    caption: 'Evening sunset vibes ✨'
  }
];

let userPosts = [
  { url: 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=300', type: 'image' },
  { url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=300', type: 'image' }
];

app.get('/', (req, res) => {
  let feedHtml = posts.map((p, index) => {
    let mediaContent = p.mediaType === 'video' 
      ? `<video class="post-img" controls src="${p.mediaUrl}"></video>` 
      : `<img class="post-img" src="${p.mediaUrl}" alt="">`;

    return `
      <div class="post">
          <div class="post-header">
              <div class="post-user">
                  <img src="${p.userImg}" alt="">
                  <span>${p.username}</span>
              </div>
              <span>⋮</span>
          </div>
          ${mediaContent}
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
    `;
  }).join('');

  let userGridHtml = userPosts.map(item => {
    if (item.type === 'video') {
      return `<div class="grid-item"><video src="${item.url}" style="width:100%; height:100%; object-fit:cover;"></video></div>`;
    } else {
      return `<div class="grid-item"><img src="${item.url}" alt=""></div>`;
    }
  }).join('');

  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Instagram</title>
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
            body { background-color: #000; color: #fff; }
            
            /* Login Screen */
            #login-screen { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; padding: 20px; background: #000; position: fixed; top: 0; left: 0; width: 100%; z-index: 9999; }
            .login-box { width: 100%; max-width: 350px; text-align: center; }
            .insta-logo { font-size: 40px; font-weight: bold; font-family: cursive; margin-bottom: 30px; letter-spacing: 1px; }
            .login-input { width: 100%; padding: 12px; margin-bottom: 10px; background: #121212; border: 1px solid #333; border-radius: 5px; color: #fff; font-size: 14px; }
            .login-btn { width: 100%; padding: 12px; background: #0095f6; color: #fff; border: none; border-radius: 5px; font-weight: 600; font-size: 14px; cursor: pointer; margin-top: 10px; }
            
            /* Main App */
            #main-app { display: none; padding-bottom: 60px; }
            
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
            .grid-item img, .grid-item video { width: 100%; height: 100%; object-fit: cover; }

            /* Settings & Activity Page */
            .settings-header { display: flex; align-items: center; padding: 12px 16px; border-bottom: 1px solid #262626; font-size: 18px; font-weight: bold; gap: 15px; background: #000; position: sticky; top: 0; z-index: 100; }
            .settings-section-title { padding: 15px 16px 8px 16px; font-size: 12px; color: #8e8e8e; font-weight: 600; letter-spacing: 0.5px; text-transform: uppercase; }
            .settings-item { display: flex; align-items: center; justify-content: space-between; padding: 14px 16px; border-bottom: 1px solid #1a1a1a; cursor: pointer; font-size: 14px; }
            .settings-item:hover { background: #121212; }
            .settings-item-left { display: flex; align-items: center; gap: 12px; }
            .settings-item-right { color: #8e8e8e; font-size: 14px; }

            /* Edit Profile Page Styles */
            .edit-profile-container { padding: 16px; max-width: 500px; margin: 0 auto; }
            .edit-avatar-section { display: flex; flex-direction: column; align-items: center; margin-bottom: 20px; }
            .edit-avatar-preview { width: 80px; height: 80px; border-radius: 50%; object-fit: cover; margin-bottom: 10px; background: #333; }
            .edit-form-group { margin-bottom: 15px; }
            .edit-form-label { font-size: 12px; color: #aaa; margin-bottom: 5px; display: block; }
            .edit-form-input, .edit-form-select { width: 100%; padding: 12px; background: #121212; border: 1px solid #333; border-radius: 6px; color: #fff; font-size: 14px; }
        </style>
    </head>
    <body>

        <!-- LOGIN / SIGNUP SCREEN -->
        <div id="login-screen">
            <div class="login-box">
                <div class="insta-logo">Instagram</div>
                <form onsubmit="handleLogin(event)">
                    <input type="text" id="username-input" class="login-input" placeholder="Phone number, username, or email" required>
                    <input type="password" class="login-input" placeholder="Password" required>
                    <input type="text" id="dp-input" class="login-input" placeholder="Profile Picture Link (Image URL) dalein" required>
                    <button type="submit" class="login-btn">Log In</button>
                </form>
                <div style="margin-top: 20px; font-size: 13px; color: #8e8e8e;">
                    Don't have an account? <span style="color: #0095f6; cursor: pointer;">Sign up</span>
                </div>
            </div>
        </div>

        <!-- MAIN APP -->
        <div id="main-app">
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
                        <div class="story-ring"><img id="story-dp" class="story-img" src="" alt=""></div>
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
                    <div style="font-weight: bold; font-size: 16px;">Gallery se Post Dalein</div>
                    <span onclick="switchPage('home', document.querySelectorAll('.nav-item')[0])" style="cursor:pointer; font-size:18px;">✕</span>
                </div>
                <div class="create-container">
                    <form onsubmit="handlePostUpload(event)">
                        <label style="font-size: 13px; color: #aaa; display: block; margin-bottom: 5px;">Photo ya Video Select Karein:</label>
                        <input type="file" id="media-file-input" accept="image/*,video/*" class="create-input" required onchange="previewMedia(event)">
                        <textarea id="caption-input" class="create-input" placeholder="Caption likhein..." rows="4" required></textarea>
                        <button type="submit" class="create-btn">Post Share Karein</button>
                    </form>
                </div>
            </div>

            <!-- REELS PAGE -->
            <div id="reels-page" class="page">
                <div style="height: 80vh; display: flex; align-items: center; justify-content: center; font-size: 16px; color: #888; text-align: center; padding: 20px;">
                    Reels section ready hai! Aap niche '+' button se apni video upload karke yahan dekh sakte hain.
                </div>
            </div>

            <!-- PROFILE PAGE -->
            <div id="profile-page" class="page">
                <div class="header">
                    <div id="profile-username-header" style="font-weight: bold; font-size: 16px;">kartik_official 🔒</div>
                    <div class="header-icons">
                        <span onclick="openSettings()" style="cursor: pointer;">☰</span>
                    </div>
                </div>
                <div class="profile-header">
                    <div class="profile-top">
                        <img id="profile-dp" src="" class="profile-avatar" alt="">
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
                        <b id="profile-name-bio">Kartik Ganapati</b><br>
                        <span id="profile-pronouns-display" style="color: #aaa; font-size: 13px;"></span>
                        <span id="profile-bio-text">⚡ Creator & Developer<br>📍 Kumta, Karnataka</span>
                    </div>
                    <div class="profile-actions">
                        <button class="profile-btn" onclick="openEditProfile()">Edit profile</button>
                        <button class="profile-btn">Share profile</button>
                    </div>
                </div>

                <!-- Profile Grid -->
                <div class="profile-grid">
                    ${userGridHtml}
                </div>
            </div>

            <!-- EDIT PROFILE PAGE -->
            <div id="edit-profile-page" class="page">
                <div class="settings-header">
                    <span onclick="closeEditProfile()" style="cursor: pointer;">✕</span>
                    <span>Edit profile</span>
                    <span onclick="saveProfileChanges(event)" style="color: #0095f6; cursor: pointer; font-size: 16px;">✓</span>
                </div>
                <div class="edit-profile-container">
                    <div class="edit-avatar-section">
                        <img id="edit-dp-preview" src="" class="edit-avatar-preview" alt="">
                        <input type="text" id="edit-dp-url-input" class="edit-form-input" placeholder="New Profile Image URL" oninput="updatePreviewDp(this.value)">
                    </div>
                    <div class="edit-form-group">
                        <label class="edit-form-label">Name</label>
                        <input type="text" id="edit-name-input" class="edit-form-input" placeholder="Name">
                    </div>
                    <div class="edit-form-group">
                        <label class="edit-form-label">Username</label>
                        <input type="text" id="edit-username-input" class="edit-form-input" placeholder="Username">
                    </div>
                    <div class="edit-form-group">
                        <label class="edit-form-label">Pronouns</label>
                        <input type="text" id="edit-pronouns-input" class="edit-form-input" placeholder="Pronouns (e.g. He/Him)">
                    </div>
                    <div class="edit-form-group">
                        <label class="edit-form-label">Bio</label>
                        <textarea id="edit-bio-input" class="edit-form-input" rows="3" placeholder="Bio..."></textarea>
                    </div>
                    <div class="edit-form-group">
                        <label class="edit-form-label">Gender</label>
                        <select id="edit-gender-select" class="edit-form-select">
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Custom">Custom</option>
                            <option value="Prefer not to say">Prefer not to say</option>
                        </select>
                    </div>
                </div>
            </div>

            <!-- SETTINGS AND ACTIVITY PAGE -->
            <div id="settings-page" class="page">
                <div class="settings-header">
                    <span onclick="closeSettings()" style="cursor: pointer;">←</span>
                    <span>Settings and activity</span>
                </div>

                <div class="settings-section-title">Your account</div>
                <div class="settings-item">
                    <div class="settings-item-left"><span>⚙️</span> Accounts Centre</div>
                    <div class="settings-item-right">Password, security, personal details ›</div>
                </div>

                <div class="settings-section-title">How you use Instagram</div>
                <div class="settings-item" onclick="alert('Saved posts feature active!')">
                    <div class="settings-item-left"><span>🔖</span> Saved</div>
                    <div class="settings-item-right">›</div>
                </div>
                <div class="settings-item" onclick="alert('Archive is empty')">
                    <div class="settings-item-left"><span>🕒</span> Archive</div>
                    <div class="settings-item-right">›</div>
                </div>
                <div class="settings-item" onclick="alert('Your activity summary')">
                    <div class="settings-item-left"><span>📈</span> Your activity</div>
                    <div class="settings-item-right">›</div>
                </div>
                <div class="settings-item" onclick="alert('Notification settings')">
                    <div class="settings-item-left"><span>🔔</span> Notifications</div>
                    <div class="settings-item-right">›</div>
                </div>
                <div class="settings-item" onclick="alert('Time management dashboard')">
                    <div class="settings-item-left"><span>⏳</span> Time management</div>
                    <div class="settings-item-right">›</div>
                </div>

                <div class="settings-section-title">Who can see your content</div>
                <div class="settings-item">
                    <div class="settings-item-left"><span>🔒</span> Account privacy</div>
                    <div class="settings-item-right">Public ›</div>
                </div>
                <div class="settings-item">
                    <div class="settings-item-left"><span>⭐</span> Close Friends</div>
                    <div class="settings-item-right">0 ›</div>
                </div>

                <div class="settings-section-title">Your app and media</div>
                <div class="settings-item">
                    <div class="settings-item-left"><span>📱</span> Device permissions</div>
                    <div class="settings-item-right">›</div>
                </div>
                <div class="settings-item">
                    <div class="settings-item-left"><span>📥</span> Archiving and downloading</div>
                    <div class="settings-item-right">›</div>
                </div>
                <div class="settings-item">
                    <div class="settings-item-left"><span>🌐</span> Language and translations</div>
                    <div class="settings-item-right">›</div>
                </div>
                <div class="settings-item" style="margin-bottom: 40px;">
                    <div class="settings-item-left"><span>📊</span> Data usage and media quality</div>
                    <div class="settings-item-right">›</div>
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
        </div>

        <script>
            let currentUsername = "kartik_official";
            let currentDpUrl = "";
            let currentName = "Kartik Ganapati";
            let currentPronouns = "";
            let currentBioText = "⚡ Creator & Developer<br>📍 Kumta, Karnataka";
            let currentGender = "Male";

            let selectedMediaBase64 = "";
            let selectedMediaType = "image";

            function handleLogin(event) {
                event.preventDefault();
                currentUsername = document.getElementById('username-input').value;
                currentDpUrl = document.getElementById('dp-input').value;

                updateProfileUI();

                // Hide login, show main app
                document.getElementById('login-screen').style.display = 'none';
                document.getElementById('main-app').style.display = 'block';
            }

            function updateProfileUI() {
                document.getElementById('profile-dp').src = currentDpUrl;
                document.getElementById('story-dp').src = currentDpUrl;
                document.getElementById('profile-username-header').innerText = currentUsername + ' 🔒';
                document.getElementById('profile-name-bio').innerText = currentName;
                document.getElementById('profile-pronouns-display').innerText = currentPronouns ? currentPronouns + ' • ' : '';
                document.getElementById('profile-bio-text').innerHTML = currentBioText;
            }

            function openEditProfile() {
                document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
                document.getElementById('edit-profile-page').classList.add('active');

                // Populate fields
                document.getElementById('edit-dp-url-input').value = currentDpUrl;
                document.getElementById('edit-dp-preview').src = currentDpUrl;
                document.getElementById('edit-name-input').value = currentName;
                document.getElementById('edit-username-input').value = currentUsername;
                document.getElementById('edit-pronouns-input').value = currentPronouns;
                document.getElementById('edit-bio-input').value = currentBioText.replace(/<br>/g, '\\n');
                document.getElementById('edit-gender-select').value = currentGender;
            }

            function closeEditProfile() {
                document.getElementById('edit-profile-page').classList.remove('active');
                document.getElementById('profile-page').classList.add('active');
            }

            function updatePreviewDp(url) {
                document.getElementById('edit-dp-preview').src = url;
            }

            function saveProfileChanges(event) {
                event.preventDefault();
                currentDpUrl = document.getElementById('edit-dp-url-input').value || currentDpUrl;
                currentName = document.getElementById('edit-name-input').value || currentName;
                currentUsername = document.getElementById('edit-username-input').value || currentUsername;
                currentPronouns = document.getElementById('edit-pronouns-input').value;
                let rawBio = document.getElementById('edit-bio-input').value;
                currentBioText = rawBio.replace(/\\n/g, '<br>');
                currentGender = document.getElementById('edit-gender-select').value;

                updateProfileUI();
                closeEditProfile();
            }

            function previewMedia(event) {
                const file = event.target.files[0];
                if (file) {
                    selectedMediaType = file.type.startsWith('video') ? 'video' : 'image';
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        selectedMediaBase64 = e.target.result;
                    };
                    reader.readAsDataURL(file);
                }
            }

            function handlePostUpload(event) {
                event.preventDefault();
                const caption = document.getElementById('caption-input').value;

                if (!selectedMediaBase64) {
                    alert('Kripya pehle koi photo ya video select karein!');
                    return;
                }

                fetch('/add-post', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        username: currentUsername,
                        userImg: currentDpUrl,
                        mediaUrl: selectedMediaBase64,
                        mediaType: selectedMediaType,
                        caption: caption
                    })
                }).then(res => {
                    if (res.ok) {
                        window.location.reload();
                    }
                });
            }

            function switchPage(pageName, element) {
                document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
                document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
                
                document.getElementById(pageName + '-page').classList.add('active');
                if(element) element.classList.add('active');
            }

            function openSettings() {
                document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
                document.getElementById('settings-page').classList.add('active');
            }

            function closeSettings() {
                document.getElementById('settings-page').classList.remove('active');
                document.getElementById('profile-page').classList.add('active');
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
  const { username, userImg, mediaUrl, mediaType, caption } = req.body;
  if (mediaUrl && caption) {
    posts.unshift({
      id: posts.length + 1,
      username: username || 'kartik_official',
      userImg: userImg || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      mediaUrl: mediaUrl,
      mediaType: mediaType || 'image',
      likes: 1,
      caption: caption
    });
    userPosts.unshift({ url: mediaUrl, type: mediaType || 'image' });
  }
  res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log('Server running on port ' + PORT);
});
