use std::path::Path;
use super::paths::{get_config_path, get_custom_filename};
use super::yaml_utils::serialize_patch;

/// Atomically write a custom.yaml file with backup.
pub fn write_custom_config(basename: &str, patch: &serde_json::Value) -> Result<(), String> {
    let filename = get_custom_filename(basename);
    let filepath = get_config_path(&filename);
    let dir = filepath.parent().unwrap_or(Path::new("."));

    // Ensure directory exists
    std::fs::create_dir_all(dir).map_err(|e| format!("Failed to create directory: {}", e))?;

    // Create backup if file exists
    if filepath.exists() {
        let bak = filepath.with_extension("yaml.bak");
        let _ = std::fs::copy(&filepath, &bak);
    }

    // Serialize the patch
    let content = serialize_patch(patch);

    // Atomic write: write to temp file, then rename
    let temp_path = filepath.with_extension(format!(
        "yaml.tmp.{}",
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
