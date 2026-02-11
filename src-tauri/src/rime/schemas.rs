use serde::Serialize;
use super::paths::get_rime_config_dir;
use super::yaml_utils::parse_yaml;

#[derive(Debug, Serialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct SchemaMetadata {
    pub schema_id: String,
    pub name: String,
    pub version: String,
    pub author: Vec<String>,
    pub description: String,
    pub switches: Vec<SchemaSwitch>,
    pub has_fuzzy_pinyin: bool,
}

#[derive(Debug, Serialize, Clone)]
pub struct SchemaSwitch {
    pub name: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub states: Option<Vec<String>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub reset: Option<i64>,
}

/// Discover all *.schema.yaml files and extract metadata.
pub fn discover_schemas() -> Vec<SchemaMetadata> {
    let config_dir = get_rime_config_dir();
    let entries = match std::fs::read_dir(&config_dir) {
        Ok(e) => e,
        Err(_) => return vec![],
    };

    let mut schemas = Vec::new();

    for entry in entries.flatten() {
        let name = entry.file_name().to_string_lossy().to_string();
        if !name.ends_with(".schema.yaml") {
            continue;
        }
        let path = entry.path();
        if let Ok(content) = std::fs::read_to_string(&path) {
            if let Some(meta) = parse_schema_metadata(&content) {
                schemas.push(meta);
            }
        }
    }

    schemas
}

fn parse_schema_metadata(content: &str) -> Option<SchemaMetadata> {
    let parsed = parse_yaml(content);
    let obj = parsed.as_object()?;

    let schema_obj = obj.get("schema")?.as_object()?;
    let schema_id = schema_obj.get("schema_id")?.as_str()?.to_string();

    let name = schema_obj
        .get("name")
        .and_then(|v| v.as_str())
        .unwrap_or(&schema_id)
        .to_string();
    let version = schema_obj
        .get("version")
        .and_then(|v| v.as_str().map(|s| s.to_string()).or_else(|| Some(v.to_string())))
        .unwrap_or_default();
    let author = schema_obj
        .get("author")
        .and_then(|v| v.as_array())
        .map(|arr| {
            arr.iter()
                .filter_map(|v| v.as_str().map(|s| s.to_string()))
                .collect()
        })
        .unwrap_or_default();
    let description = schema_obj
        .get("description")
        .and_then(|v| v.as_str())
        .unwrap_or("")
        .to_string();

    // Parse switches
    let switches = obj
        .get("switches")
        .and_then(|v| v.as_array())
        .map(|arr| {
            arr.iter()
                .filter_map(|sw| {
                    let sw_obj = sw.as_object()?;
                    let name = sw_obj.get("name")?.as_str()?.to_string();
                    let states = sw_obj.get("states").and_then(|v| {
                        v.as_array().map(|arr| {
                            arr.iter()
                                .filter_map(|v| v.as_str().map(|s| s.to_string()))
                                .collect()
                        })
                    });
                    let reset = sw_obj.get("reset").and_then(|v| v.as_i64());
                    Some(SchemaSwitch { name, states, reset })
                })
                .collect()
        })
        .unwrap_or_default();

    // Check for fuzzy pinyin rules
    let has_fuzzy_pinyin = obj
        .get("speller")
        .and_then(|v| v.as_object())
        .and_then(|s| s.get("algebra"))
        .and_then(|v| v.as_array())
        .map(|arr| {
            arr.iter().any(|rule| {
                rule.as_str()
                    .map(|s| s.starts_with("# - derive/"))
                    .unwrap_or(false)
            })
        })
        .unwrap_or(false);

    Some(SchemaMetadata {
        schema_id,
        name,
        version,
        author,
        description,
        switches,
        has_fuzzy_pinyin,
    })
}
