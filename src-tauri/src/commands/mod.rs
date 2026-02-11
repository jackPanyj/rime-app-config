use serde::Serialize;
use crate::rime::{paths, reader, writer, schemas, deploy, phrases};

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct HealthData {
    platform: String,
    config_dir: String,
    config_dir_exists: bool,
    installation: Option<InstallationInfo>,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct InstallationInfo {
    distribution_name: String,
    distribution_version: String,
    rime_version: String,
    install_time: String,
}

#[tauri::command]
pub fn get_health() -> HealthData {
    let config_dir = paths::get_rime_config_dir();
    let config_dir_str = config_dir.to_string_lossy().to_string();
    let config_dir_exists = config_dir.is_dir();

    let installation = {
        let install_path = paths::get_config_path("installation.yaml");
        std::fs::read_to_string(&install_path)
            .ok()
            .map(|content| {
                let parsed = crate::rime::yaml_utils::parse_yaml(&content);
                let obj = parsed.as_object();
                InstallationInfo {
                    distribution_name: obj
                        .and_then(|o| o.get("distribution_name"))
                        .and_then(|v| v.as_str())
                        .unwrap_or("")
                        .to_string(),
                    distribution_version: obj
                        .and_then(|o| o.get("distribution_version"))
                        .and_then(|v| v.as_str())
                        .unwrap_or("")
                        .to_string(),
                    rime_version: obj
                        .and_then(|o| o.get("rime_version"))
                        .and_then(|v| v.as_str())
                        .unwrap_or("")
                        .to_string(),
                    install_time: obj
                        .and_then(|o| o.get("install_time"))
                        .and_then(|v| v.as_str())
                        .unwrap_or("")
                        .to_string(),
                }
            })
    };

    let platform = if cfg!(target_os = "macos") {
        "darwin"
    } else if cfg!(target_os = "linux") {
        "linux"
    } else if cfg!(target_os = "windows") {
        "win32"
    } else {
        "unknown"
    };

    HealthData {
        platform: platform.into(),
        config_dir: config_dir_str,
        config_dir_exists,
        installation,
    }
}

#[derive(Debug, Serialize)]
pub struct SchemasResponse {
    schemas: Vec<schemas::SchemaMetadata>,
}

#[tauri::command]
pub fn get_schemas() -> SchemasResponse {
    SchemasResponse {
        schemas: schemas::discover_schemas(),
    }
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct ConfigResponse {
    base: serde_json::Value,
    custom_patch: serde_json::Value,
}

#[tauri::command]
pub fn read_config(basename: String, config_type: Option<String>) -> ConfigResponse {
    let config_type = config_type.unwrap_or_else(|| "all".into());

    match config_type.as_str() {
        "base" => ConfigResponse {
            base: reader::read_base_config(&basename),
            custom_patch: serde_json::Value::Object(serde_json::Map::new()),
        },
        "custom" => ConfigResponse {
            base: serde_json::Value::Object(serde_json::Map::new()),
            custom_patch: reader::read_custom_config(&basename),
        },
        _ => ConfigResponse {
            base: reader::read_base_config(&basename),
            custom_patch: reader::read_custom_config(&basename),
        },
    }
}

#[tauri::command]
pub fn write_config(basename: String, patch: serde_json::Value) -> Result<(), String> {
    writer::write_custom_config(&basename, &patch)
}

#[derive(Debug, Serialize)]
pub struct DeployResponse {
    success: bool,
    message: String,
}

#[tauri::command]
pub fn deploy() -> DeployResponse {
    let (success, message) = deploy::trigger_deploy();
    DeployResponse { success, message }
}

#[tauri::command]
pub fn read_phrases() -> phrases::PhrasesData {
    phrases::read_phrases()
}

#[tauri::command]
pub fn write_phrases(header: String, entries: Vec<phrases::PhraseEntry>) -> Result<(), String> {
    phrases::write_phrases(&header, &entries)
}
