use super::paths::{get_config_path, get_base_filename, get_custom_filename};
use super::yaml_utils::{parse_yaml, parse_yaml_with_colors};

/// Read a base config file (e.g., default.yaml or rime_ice.schema.yaml)
pub fn read_base_config(basename: &str) -> serde_json::Value {
    let filename = get_base_filename(basename);
    let filepath = get_config_path(&filename);
    match std::fs::read_to_string(&filepath) {
        Ok(content) => {
            if basename == "squirrel" {
                parse_yaml_with_colors(&content)
            } else {
                parse_yaml(&content)
            }
        }
        Err(_) => serde_json::Value::Object(serde_json::Map::new()),
    }
}

/// Read a custom config file and extract the patch key
pub fn read_custom_config(basename: &str) -> serde_json::Value {
    let filename = get_custom_filename(basename);
    let filepath = get_config_path(&filename);
    match std::fs::read_to_string(&filepath) {
        Ok(content) => {
            let parsed = if basename == "squirrel" {
                parse_yaml_with_colors(&content)
            } else {
                parse_yaml(&content)
            };
            match parsed {
                serde_json::Value::Object(map) => {
                    map.get("patch")
                        .cloned()
                        .unwrap_or(serde_json::Value::Object(serde_json::Map::new()))
                }
                _ => serde_json::Value::Object(serde_json::Map::new()),
            }
        }
        Err(_) => serde_json::Value::Object(serde_json::Map::new()),
    }
}
