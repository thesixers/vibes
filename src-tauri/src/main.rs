#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::command;
use lofty::{read_from_path, Accessor, AudioFile, TaggedFileExt};
use walkdir::WalkDir;
use regex::Regex;
use std::borrow::Cow;
use dirs::audio_dir; // Make sure to run `cargo add dirs`

#[derive(serde::Serialize)]
struct Track {
    title: String,
    artist: String,
    album: String,
    duration: u64,
    path: String,
    filename: String,
    query: String,
}

// 🧹 CLEANING LOGIC
fn clean_title(title_opt: Option<&str>, filename: &str) -> String {
    let junks = vec![
        "ft.", "feat.", "feat", "ft", "prod.", "via:", "prod:", 
        "via", "prod", "-", "9jaflaver.com", "x", "&", 
        "tooxclusive.com", "krizbeatz"
    ];

    let raw_title = if let Some(t) = title_opt {
        t.replace("(", "")
         .replace(")", "")
         .split('|')
         .next()
         .unwrap_or("")
         .to_string()
    } else {
        filename.replace("_", " ")
                .replace("-", " ")
                .replace("(", "")
                .replace(")", "")
                .replace("%20", " ")
                .split('.')
                .next()
                .unwrap_or(filename)
                .to_string()
    };

    let ext_pattern = Regex::new(r"\..+$").unwrap();
    let parts: Vec<&str> = raw_title.split_whitespace().collect();

    let cleaned_parts: Vec<&str> = parts
        .iter()
        .enumerate()
        .filter_map(|(i, word)| {
            let word = *word; // deref &&str → &str
            let lower = word.to_lowercase();
            if junks.contains(&lower.as_str()) { return None; }
            if i == parts.len() - 1 {
                if ext_pattern.is_match(word) { return None; }
                if word.starts_with('@') { return None; }
                if word.parse::<f64>().is_ok() { return None; }
            }
            if word.starts_with('%') { return None; }
            Some(word)
        })
        .collect();

    cleaned_parts.join(" ")
}

// 📂 SCANNING COMMAND
#[command]
fn load_music_library() -> Vec<Track> {
    let mut tracks = Vec::new();

    let music_path = match audio_dir() {
        Some(p) => p,
        None => return tracks,
    };

    for entry in WalkDir::new(&music_path).into_iter().filter_map(|e| e.ok()) {
        let path = entry.path();
        let path_str = path.to_string_lossy().to_string();
        let filename = path.file_name().unwrap_or_default().to_string_lossy().to_string();

        if path_str.ends_with(".mp3") || path_str.ends_with(".flac") || path_str.ends_with(".m4a") {
            let mut artist = Cow::Borrowed("Unknown Artist").to_string();
            let mut album = Cow::Borrowed("Unknown Album").to_string();
            let mut title_raw = None;
            let mut duration = 0;

            if let Ok(tagged_file) = read_from_path(path) {
                duration = tagged_file.properties().duration().as_secs();

                if let Some(tag) = tagged_file.primary_tag() {
                    artist = tag.artist().unwrap_or(Cow::Borrowed("Unknown Artist")).to_string();
                    album = tag.album().unwrap_or(Cow::Borrowed("Unknown Album")).to_string();
                    title_raw = tag.title().map(|s| s.to_string());
                }
            }

            let clean_t = clean_title(title_raw.as_deref(), &filename);
            let query = format!("{} {}", clean_t, artist)
                .replace('.', "")
                .replace(',', "")
                .replace(':', "");

            tracks.push(Track {
                title: clean_t,
                artist,
                album,
                duration,
                path: path_str,
                filename,
                query,
            });
        }
    }

    tracks
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_log::Builder::default().build())
        .invoke_handler(tauri::generate_handler![load_music_library])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
