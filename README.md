# 🎵 CLI Music Player

A simple **command-line music player** built with **Node.js** and **VLC**.
It allows you to browse songs, play/pause tracks, navigate between songs, seek through audio, control volume, and enable repeat mode — all directly from the terminal.

## ✨ Features

* 🎵 List songs directly in the terminal
* ▶️ Play selected songs
* ⏸️ Pause / resume playback
* ⏭️ Skip to the next song
* ⏮️ Go back to the previous song
* ⬆️⬇️ Navigate through the song list
* ⏩ Seek forward by 10 seconds
* ⏪ Seek backward by 10 seconds
* 🔊 Increase volume
* 🔉 Decrease volume
* 🔁 Repeat the current song
* 📊 Display a live progress bar
* ⏱️ Display elapsed time and total duration
* 🖥️ Terminal-based interface using keyboard controls

---

## 🛠️ Technologies Used

* **Node.js**
* **VLC Media Player**
* **JavaScript**
* Node.js built-in modules:

  * `fs`
  * `path`
  * `child_process`

The project uses VLC's **Remote Control (RC) interface** to control playback directly from Node.js.

---

## 📁 Project Structure

```text
CLI-Music-Player/
│
├── songs/
│   ├── song1.mp3
│   ├── song2.mp3
│   └── ...
│
├── index.js
├── package.json
└── README.md
```

Place your audio files inside the `songs` directory.

---

## ⚙️ Requirements

Before running the project, make sure you have:

* [Node.js](https://nodejs.org/) installed
* [VLC Media Player](https://www.videolan.org/vlc/) installed
* macOS (the current version uses `afinfo` to retrieve audio duration)

### Check Node.js

```bash
node --version
```

### Check VLC

```bash
vlc --version
```

---

## 🚀 Installation

### 1. Clone the repository

```bash
git clone <your-repository-url>
```

### 2. Navigate into the project

```bash
cd CLI-Music-Player
```

### 3. Add your songs

Create a `songs` folder if it doesn't already exist:

```bash
mkdir songs
```

Then place your `.mp3` or other supported audio files inside it.

### 4. Run the application

```bash
node index.js
```

---

# 🎮 Controls

| Key        | Action                   |
| ---------- | ------------------------ |
| `↑`        | Select previous song     |
| `↓`        | Select next song         |
| `Enter`    | Play selected song       |
| `←`        | Play previous song       |
| `→`        | Play next song           |
| `Space`    | Pause / Resume           |
| `L`        | Seek forward 10 seconds  |
| `J`        | Seek backward 10 seconds |
| `R`        | Toggle repeat mode       |
| `-`        | Decrease volume          |
| `=`        | Increase volume          |
| `Ctrl + C` | Exit application         |

> **Note:** Keyboard controls are case-sensitive where applicable.

---

## 📊 Terminal Interface

The player displays the available songs along with the currently selected track.

While a song is playing, the terminal also shows a progress bar:

```text
> song1.mp3
  song2.mp3
  song3.mp3

██████████████░░░░░░░░░░░░░░░░
          01:24/03:45
```

The progress bar is updated every second while the song is playing.

---

## 🔧 How It Works

### 1. Reading Songs

The application reads the contents of the `songs` directory using Node.js's `fs` module:

```javascript
output = readdirSync(songPath)
```

The selected song is tracked using an index:

```javascript
let i = 0
```

---

### 2. Playing Music

The project uses Node.js's `child_process.spawn()` to launch VLC:

```javascript
processPlay = spawn('vlc', ["--intf", "rc", finalDir])
```

The `--intf rc` option starts VLC with its **Remote Control interface**, allowing the Node.js application to send commands to VLC.

---

### 3. Getting Song Duration

On macOS, the project uses Apple's `afinfo` command to retrieve the audio file's duration:

```javascript
const info = spawn('afinfo', [finalDir])
```

The duration is then extracted from VLC/player-related metadata and used to calculate the progress bar.

---

### 4. Controlling VLC

Commands are sent to VLC through its standard input.

For example, pausing playback:

```javascript
processPlay.stdin.write('pause\n')
```

Seeking forward:

```javascript
processPlay.stdin.write('seek +10\n')
```

Changing volume:

```javascript
processPlay.stdin.write('volup 10\n')
```

---

### 5. Keyboard Input

The application enables raw terminal input:

```javascript
process.stdin.setRawMode(true)
```

This allows individual key presses to be detected without requiring the user to press Enter.

Arrow keys are detected by checking their escape sequences:

```javascript
if(data[0] == 0x1b && data[1] == 0x5b)
```

---

### 6. Automatic Song Progression

A timer runs every second:

```javascript
setInterval(() => {
    ...
}, 1000)
```

It updates the elapsed playback time and refreshes the terminal interface.

When the current song finishes, the player automatically moves to the next song.

If repeat mode is enabled, the current song starts again instead.

---

## 🧠 Key Concepts Learned

This project helped me understand and practice:

* Node.js `fs` module
* Node.js `path` module
* `child_process.spawn()`
* Process management
* Standard input/output
* Terminal raw mode
* Keyboard event handling
* Escape sequences
* VLC RC commands
* Timers using `setInterval()`
* Audio metadata extraction
* State management in a CLI application
* Building interactive terminal applications

---

## 🔮 Future Improvements

Some features that can be added in future versions:

* [ ] Shuffle mode
* [ ] Playlist support
* [ ] Multiple audio format support
* [ ] Better terminal UI
* [ ] Song search
* [ ] Current song information
* [ ] Album artwork in supported terminals
* [ ] Playback speed control
* [ ] Persistent playlists
* [ ] Better cross-platform support for Windows and Linux
* [ ] More accurate playback-time synchronization with VLC

---

## 🎯 Project Goal

The main goal of this project was to build an interactive music player **without relying on a graphical user interface**, while learning how Node.js can interact with external processes and control applications such as VLC.

---

## 👨‍💻 Author

**Priyanshu**

B.Tech — Computer Science & Artificial Intelligence

---

## ⭐ If you like the project

Feel free to ⭐ the repository and experiment with the code!
