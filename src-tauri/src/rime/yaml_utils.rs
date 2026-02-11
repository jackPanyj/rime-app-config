use serde_yaml::Value;
use std::collections::HashSet;

/// BGR color key names used in Rime squirrel.yaml
fn bgr_color_keys() -> HashSet<&'static str> {
    [
        "back_color",
        "border_color",
        "text_color",
        "hilited_text_color",
        "hilited_back_color",
        "hilited_candidate_text_color",
        "hilited_candidate_back_color",
        "hilited_candidate_label_color",
        "hilited_comment_text_color",
        "candidate_text_color",
        "candidate_back_color",
        "comment_text_color",
        "label_color",
        "preedit_back_color",
    ]
    .into_iter()
    .collect()
}

/// Parse YAML content into a serde_json::Value
pub fn parse_yaml(content: &str) -> serde_json::Value {
    let yaml_val: serde_yaml::Value = serde_yaml::from_str(content).unwrap_or(Value::Null);
    yaml_to_json(yaml_val)
}

/// Parse YAML and convert BGR integer colors to "0xHHHHHH" strings
pub fn parse_yaml_with_colors(content: &str) -> serde_json::Value {
    let yaml_val: serde_yaml::Value = serde_yaml::from_str(content).unwrap_or(Value::Null);
    let json_val = yaml_to_json(yaml_val);
    let color_keys = bgr_color_keys();
    preserve_bgr_colors(json_val, &color_keys)
}

/// Recursively convert integer color values to 0xHHHHHH strings
fn preserve_bgr_colors(val: serde_json::Value, color_keys: &HashSet<&str>) -> serde_json::Value {
    match val {
        serde_json::Value::Object(map) => {
            let mut result = serde_json::Map::new();
            for (key, value) in map {
                let converted = if color_keys.contains(key.as_str()) {
                    match &value {
                        serde_json::Value::Number(n) => {
                            if let Some(i) = n.as_u64() {
                                let hex = format!("{:X}", i);
                                let padded = if hex.len() > 6 {
                                    format!("{:0>8}", hex)
                                } else {
                                    format!("{:0>6}", hex)
                                };
                                serde_json::Value::String(format!("0x{}", padded))
                            } else {
                                preserve_bgr_colors(value, color_keys)
                            }
                        }
                        _ => preserve_bgr_colors(value, color_keys),
                    }
                } else {
                    preserve_bgr_colors(value, color_keys)
                };
                result.insert(key, converted);
            }
            serde_json::Value::Object(result)
        }
        serde_json::Value::Array(arr) => {
            serde_json::Value::Array(
                arr.into_iter()
                    .map(|v| preserve_bgr_colors(v, color_keys))
                    .collect(),
            )
        }
        other => other,
    }
}

/// Convert serde_yaml::Value to serde_json::Value
fn yaml_to_json(yaml: serde_yaml::Value) -> serde_json::Value {
    match yaml {
        Value::Null => serde_json::Value::Null,
        Value::Bool(b) => serde_json::Value::Bool(b),
        Value::Number(n) => {
            if let Some(i) = n.as_i64() {
                serde_json::Value::Number(i.into())
            } else if let Some(u) = n.as_u64() {
                serde_json::Value::Number(u.into())
            } else if let Some(f) = n.as_f64() {
                serde_json::Number::from_f64(f)
                    .map(serde_json::Value::Number)
                    .unwrap_or(serde_json::Value::Null)
            } else {
                serde_json::Value::Null
            }
        }
        Value::String(s) => serde_json::Value::String(s),
        Value::Sequence(seq) => {
            serde_json::Value::Array(seq.into_iter().map(yaml_to_json).collect())
        }
        Value::Mapping(map) => {
            let mut obj = serde_json::Map::new();
            for (k, v) in map {
                let key = match k {
                    Value::String(s) => s,
                    Value::Number(n) => n.to_string(),
                    Value::Bool(b) => b.to_string(),
                    _ => continue,
                };
                obj.insert(key, yaml_to_json(v));
            }
            serde_json::Value::Object(obj)
        }
        Value::Tagged(tagged) => yaml_to_json(tagged.value),
    }
}

/// Serialize a patch object to YAML in Rime patch format
pub fn serialize_patch(patch: &serde_json::Value) -> String {
    let yaml_val = json_to_yaml(patch);
    let mut wrapper = serde_yaml::Mapping::new();
    wrapper.insert(Value::String("patch".into()), yaml_val);
    serde_yaml::to_string(&Value::Mapping(wrapper)).unwrap_or_else(|_| "patch: {}\n".into())
}

/// Convert serde_json::Value to serde_yaml::Value
fn json_to_yaml(json: &serde_json::Value) -> serde_yaml::Value {
    match json {
        serde_json::Value::Null => Value::Null,
        serde_json::Value::Bool(b) => Value::Bool(*b),
        serde_json::Value::Number(n) => {
            if let Some(i) = n.as_i64() {
                Value::Number(i.into())
            } else if let Some(u) = n.as_u64() {
                Value::Number(u.into())
            } else if let Some(f) = n.as_f64() {
                Value::Number(serde_yaml::Number::from(f))
            } else {
                Value::Null
            }
        }
        serde_json::Value::String(s) => Value::String(s.clone()),
        serde_json::Value::Array(arr) => {
            Value::Sequence(arr.iter().map(json_to_yaml).collect())
        }
        serde_json::Value::Object(map) => {
            let mut m = serde_yaml::Mapping::new();
            for (k, v) in map {
                m.insert(Value::String(k.clone()), json_to_yaml(v));
            }
            Value::Mapping(m)
        }
    }
}
