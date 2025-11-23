# 🏏 Bat • Ball • Stump — Web Game  
A modern, animated, feature-rich Bat–Ball–Stump game built using HTML, CSS, and JavaScript.  
This project includes sound effects, SVG animations, leaderboard persistence, match rounds, and a polished UI.

---

## 🚀 Features

### 🎮 Core Gameplay
- Choose between **Bat**, **Ball**, or **Stump**
- Computer chooses randomly
- Animated result messages
- Interactive button highlights based on win/lose/tie

---

## ✨ Advanced Features

### 🟦 Animated Score Bars
- Real-time bar animations for both players  
- Smooth transitions using CSS keyframes  
- Bars show score proportion relative to total match rounds

### 🏆 Match Rounds
- Select **Best of 3** or **Best of 5**
- Match ends automatically when win threshold is reached
- Supports early knockout (majority wins)

### 🔊 Sound Effects
- Click sound
- Win sound
- Lose sound
- Tie sound

### 🖼 SVG Animated Effects (Replaces Emojis)
- 🎉 Confetti (for WIN)
- 💀 Skull falling (for LOSE)
- 🤝 Handshake bounce (for TIE)
- Smooth CSS + SVG animations

### 📊 Leaderboard (LocalStorage)
- Tracks total:
  - Matches played
  - You won
  - Computer won
  - Ties
- Automatically updates after every match
- Saved using `localStorage` → data persists even after browser close
- “Clear Leaderboard” button included

### 🔁 Match Reset
- Reset the current match anytime
- Resets scores, round counters, animations, and bars

### ⌨ Keyboard Shortcuts
| Key | Action |
|-----|--------|
| **1** | Pick Bat |
| **2** | Pick Ball |
| **3** | Pick Stump |
| **R** | Reset match |

### 🧩 Accessibility
- Buttons accessible via keyboard
- ARIA labels included
- High contrast UI components

---

## 📂 Project Structure

