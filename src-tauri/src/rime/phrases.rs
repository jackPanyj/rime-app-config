use serde::{Deserialize, Serialize};
use std::path::Path;
use super::paths::get_config_path;

const DEFAULT_HEADER: &str = "# Rime custom phrase\n# encoding: utf-8\n#\n# format: phrase<TAB>code<TAB>weight\n#\n";

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct PhraseEntry {
    pub phrase: String,
    pub code: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub weight: Option<i64>,
}

#[derive(Debug, Serialize)]
pub struct PhrasesData {
    pub header: String,
    pub entries: Vec<PhraseEntry>,
}

/// Read and parse custom_phrase.txt
pub fn read_phrases() -> PhrasesData {
    let filepath = get_config_path("custom_phrase.txt");
    let content = match std::fs::read_to_string(&filepath) {
        Ok(c) => c,
        Err(_) => return PhrasesData { header: DEFAULT_HEADER.into(), entries: vec![] },
    };

    parse_custom_phrases(&content)
}

fn parse_custom_phrases(content: &str) -> PhrasesData {
    let mut header_lines: Vec<String> = Vec::new();
    let mut entries: Vec<PhraseEntry> = Vec::new();
    let mut header_done = false;

    for line in content.lines() {
        if !header_done {
            if line.starts_with('#') || line.trim().is_empty() {
                header_lines.push(line.to_string());
                continue;
            }
            header_done = true;
        }

        let trimmed = line.trim();
        if trimmed.is_empty() || trimmed.starts_with('#') {
            continue;
        }

        let parts: Vec<&str> = trimmed.split('\t').collect();
        if parts.len() < 2 {
            continue;
        }

        let weight = if parts.len() >= 3 && !parts[2].is_empty() {
            parts[2].parse::<i64>().ok()
        } else {
            None
        };

        entries.push(PhraseEntry {
            phrase: parts[0].to_string(),
            code: parts[1].to_string(),
            weight,
        });
    }

    let header = if header_lines.is_empty() {
        DEFAULT_HEADER.into()
    } else {
        header_lines.join("\n") + "\n"
    };

    PhrasesData { header, entries }
}

/// Serialize and atomically write custom_phrase.txt
pub fn write_phrases(header: &str, entries: &[PhraseEntry]) -> Result<(), String> {
    let filepath = get_config_path("custom_phrase.txt");
    let dir = filepath.parent().unwrap_or(Path::new("."));

    std::fs::create_dir_all(dir).map_err(|e| format!("Failed to create directory: {}", e))?;

    // Backup if exists
    if filepath.exists() {
        let bak = filepath.with_extension("txt.bak");
        let _ = std::fs::copy(&filepath, &bak);
    }

    // Serialize
    let mut lines: Vec<String> = vec![header.trim_end().to_string()];
    for entry in entries {
        let mut parts = vec![entry.phrase.clone(), entry.code.clone()];
        if let Some(w) = entry.weight {
            parts.push(w.to_string());
        }
        lines.push(parts.join("\t"));
    }
    let content = lines.join("\n") + "\n";

    // Atomic write
    let temp_path = filepath.with_extension(format!(
        "txt.tmp.{}",
        std::time::SystemTime::now()
            .duration_since(std::time::UNIX_EPOCH)
            .unwrap_or_default()
            .as_millis()
    ));

    std::fs::write(&temp_path, &content)
        .map_err(|e| format!("Failed to write temp file: {}", e))?;

    std::fs::rename(&temp_path, &filepath)
        .map_err(|e| format!("Failed to rename temp file: {}", e))?;

    Ok(())
}
