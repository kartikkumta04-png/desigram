const express = require('express');
const session = require('express-session');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DB_FILE = path.join(__dirname, 'desigram_db.json');

app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.json({ limit: '50mb' }));
app.use(session({
    secret: 'desigram_super_secret_key_2026',
    resave: false,
    saveUninitialized: true
}));

function getDB() {
    if (!fs.existsSync(DB_FILE)) {
        const initialData = { users: [], posts: [] };
        fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2));
    }
    return JSON.parse(fs.readFileSync(DB_FILE));
}

function saveDB(data) {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

const headStyles = `
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>DesiGram 🇮🇳</title>
<link rel="icon" type="image/svg+xml" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'%3E%3Cdefs%3E%3ClinearGradient id='desigrad' x1='0%25' y1='100%25' x2='100%25' y2='0%25'%3E%3Cstop offset='0%25' stop-color='%23ff3b30'/%3E%3Cstop offset='50%25' stop-color='%23ff9933'/%3E%3Cstop offset='100%25' stop-color='%237928ca'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='512' height='512' rx='115' fill='url(%23desigrad)'/%3E%3Cpath d='M335 116H177c-34 0-61 27-61 61v158c0 34 27 61 61 61h158c34 0 61-27 61-61V177c0-34-27-61-61-61zm25 107a96 96 0 11-108-108 96 96 0 01108 108z' fill='none' stroke='%23ffffff' stroke-width='32' stroke-linecap='round' stroke-linejoin='round'/%3E%3Ccircle cx='256' cy='223' r='64' fill='none' stroke='%23ffffff' stroke-width='32'/%3E%3Ccircle cx='355' cy='157' r='18' fill='%23ffffff'/%3E%3C/svg%3E">
<style>
  body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #fafafa; margin: 0; padding: 0; color: #262626; }
  .container { max-width: 450px; margin: 0 auto; background: #fff; min-height: 100vh; padding-bottom: 70px; box-shadow: 0 0 10px rgba(0,0,0,0.05); }
  header { display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; border-bottom: 1px solid #dbdbdb; background: #fff; position: sticky; top: 0; z-index: 10; }
  h1 { font-family: 'Billabong', cursive, sans-serif; font-size: 28px; margin: 0; background: linear-gradient(45deg, #ff3b30, #ff9933, #7928ca); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
  .btn { background: #0095f6; color: white; border: none; padding: 8px 16px; border-radius: 8px; font-weight: 600; cursor: pointer; width: 100%; font-size: 14px; text-align: center; display: inline-block; text-decoration: none; }
  input, textarea { width: 100%; padding: 10px; margin: 8px 0; border: 1px solid #dbdbdb; border-radius: 6px; box-sizing: border-box; background: #fafafa; font-size: 14px; }
  .post-card { border-bottom: 1px solid #efefef; margin-bottom: 15px; background: #fff; }
  .post-header { display: flex; align-items: center; padding: 10px 16px; }
  .post-avatar { width: 32px; height: 32px; border-radius: 50%; object-fit: cover; margin-right: 10px; border: 1px solid #dbdbdb; }
  .post-img { width: 100%; max-height: 450px; object-fit: cover; background: #000; }
  .post-body { padding: 10px 16px 16px 16px; }
  .nav-bar { position: fixed; bottom: 0; left: 0; right: 0; background: #fff; border-top: 1px solid #dbdbdb; display: flex; justify-content: space-around; padding: 10px 0; max-width: 450px; margin: 0 auto; z-index: 10; }
  .nav-item { font-size: 22px; text-decoration: none; color: #262626; }
  video { width: 100%; max-height: 300px; border-radius: 8px; background: #000; }
  canvas { display: none; }
</style>
`;

app.get('/', (req, res) => {
    if (!req.session.user) return res.redirect('/login');
    const db = getDB();
    const userPosts = db.posts.reverse();

    let feedHtml = userPosts.map(p => `
        <div class="post-card">
            <div class="post-header">
                <img src="${p.avatar}" class="post-avatar">
                <strong>${p.username}</strong>
            </div>
            <img src="${p.image}" class="post-img">
            <div class="post-body">
                <p><strong>${p.username}</strong> ${p.caption}</p>
            </div>
        </div>
    `).join('');

    if(userPosts.length === 0) {
        feedHtml = '<p style="text-align:center; padding:40px; color:#8e8e8e;">Abhi koi post nahi hai. Pehli post aap daalein!</p>';
    }

    res.send(`<!DOCTYPE html><html><head>${headStyles}</head><body>
    <div class="container">
        <header>
            <h1>DesiGram</h1>
            <a href="/logout" style="color: #ed4956; text-decoration: none; font-weight: 600; font-size: 14px;">Logout</a>
        </header>
        <div>${feedHtml}</div>
        <div class="nav-bar">
            <a href="/" class="nav-item">🏠</a>
            <a href="/create" class="nav-item">➕</a>
            <a href="/profile" class="nav-item">👤</a>
        </div>
    </div>
    </body></html>`);
});

app.get('/login', (req, res) => {
    res.send(`<!DOCTYPE html><html><head>${headStyles}</head><body>
    <div class="container" style="display: flex; flex-direction: column; justify-content: center; padding: 20px; height: 100vh;">
        <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="font-size: 42px;">DesiGram</h1>
            <p style="color: #8e8e8e; font-size: 14px;">Apna Indian Social Network</p>
        </div>
        <form action="/login" method="POST">
            <input type="text" name="username" placeholder="Apna Naam likhein" required>
            <button type="submit" class="btn" style="margin-top: 10px;">Aage Badhein</button>
        </form>
    </div>
    </body></html>`);
});

app.post('/login', (req, res) => {
    const { username } = req.body;
    if (username) {
        req.session.user = { username: username.trim(), avatar: 'https://via.placeholder.com/150' };
        res.redirect('/snapshot');
    } else {
        res.redirect('/login');
    }
});

app.get('/snapshot', (req, res) => {
    if (!req.session.user) return res.redirect('/login');
    res.send(`<!DOCTYPE html><html><head>${headStyles}</head><body>
    <div class="container" style="padding: 20px; text-align: center;">
        <h2>Profile Selfie Khinchein</h2>
        <p style="color: #8e8e8e; font-size: 13px;">Apni live selfie lekar apni profile photo banayein</p>
        <video id="video" autoplay playsinline></video>
        <canvas id="canvas" width="300" height="300"></canvas>
        <button type="button" class="btn" id="snap" style="margin-top: 15px;">Selfie Lein</button>
        <form action="/save-profile" method="POST" style="margin-top: 15px;">
            <input type="hidden" name="avatar" id="avatarInput">
            <button type="submit" class="btn" id="nextBtn" style="background: #0095f6; display: none;">DesiGram Me Pravesh Karein</button>
        </form>
    </div>
    <script>
        const video = document.getElementById('video');
        const canvas = document.getElementById('canvas');
        navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false })
            .then(stream => { video.srcObject = stream; })
            .catch(e => { alert('Camera access nahi mila!'); });

        document.getElementById('snap').addEventListener('click', () => {
            const context = canvas.getContext('2d');
            context.drawImage(video, 0, 0, 300, 300);
            const dataURL = canvas.toDataURL('image/jpeg');
            document.getElementById('avatarInput').value = dataURL;
            video.style.display = 'none';
            canvas.style.display = 'block';
            document.getElementById('snap').style.display = 'none';
            document.getElementById('nextBtn').style.display = 'block';
        });
    </script>
    </body></html>`);
});

app.post('/save-profile', (req, res) => {
    if (!req.session.user) return res.redirect('/login');
    req.session.user.avatar = req.body.avatar || 'https://via.placeholder.com/150';
    res.redirect('/');
});

app.get('/create', (req, res) => {
    if (!req.session.user) return res.redirect('/login');
    res.send(`<!DOCTYPE html><html><head>${headStyles}</head><body>
    <div class="container" style="padding: 20px;">
        <h2>Nayi Post Banayein</h2>
        <form action="/create" method="POST">
            <input type="text" name="image" placeholder="Image URL ya Photo Link dalein" required>
            <textarea name="caption" placeholder="Caption likhein..." rows="4" required></textarea>
            <button type="submit" class="btn" style="margin-top: 10px;">Post Share Karein</button>
        </form>
        <div class="nav-bar">
            <a href="/" class="nav-item">🏠</a>
            <a href="/create" class="nav-item">➕</a>
            <a href="/profile" class="nav-item">👤</a>
        </div>
    </div>
    </body></html>`);
});

app.post('/create', (req, res) => {
    if (!req.session.user) return res.redirect('/login');
    const { image, caption } = req.body;
    const db = getDB();
    db.posts.push({
        username: req.session.user.username,
        avatar: req.session.user.avatar,
        image: image,
        caption: caption
    });
    saveDB(db);
    res.redirect('/');
});

app.get('/profile', (req, res) => {
    if (!req.session.user) return res.redirect('/login');
    res.send(`<!DOCTYPE html><html><head>${headStyles}</head><body>
    <div class="container" style="padding: 20px; text-align: center;">
        <img src="${req.session.user.avatar}" style="width: 100px; height: 100px; border-radius: 50%; object-fit: cover; border: 2px solid #dbdbdb; margin-top: 20px;">
        <h2>${req.session.user.username}</h2>
        <p style="color: #8e8e8e;">DesiGram Member</p>
        <a href="/logout" class="btn" style="background: #ed4956; margin-top: 30px;">Account se Bahar Aayein (Logout)</a>
        <div class="nav-bar">
            <a href="/" class="nav-item">🏠</a>
            <a href="/create" class="nav-item">➕</a>
            <a href="/profile" class="nav-item">👤</a>
        </div>
    </div>
    </body></html>`);
});

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
});

app.listen(PORT, () => {
    console.log('DesiGram server is running on port ' + PORT);
});
      
