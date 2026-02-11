use std::path::PathBuf;

pub fn get_rime_config_dir() -> PathBuf {
    if let Ok(dir) = std::env::var("RIME_CONFIG_DIR") {
        return PathBuf::from(dir);
    }

    let home = dirs::home_dir().unwrap_or_default();

    if cfg!(target_os = "macos") {
        home.join("Library").join("Rime")
    } else if cfg!(target_os = "linux") {
        home.join(".config").join("fcitx").join("rime")
    } else if cfg!(target_os = "windows") {
        if let Ok(appdata) = std::env::var("APPDATA") {
            PathBuf::from(appdata).join("Rime")
        } else {
            home.join("AppData").join("Roaming").join("Rime")
        }
    } else {
        home.join("Library").join("Rime")
    }
}

pub fn get_config_path(filename: &str) -> PathBuf {
    get_rime_config_dir().join(filename)
}

pub fn get_custom_filename(basename: &str) -> String {
    format!("{}.custom.yaml", basename)
}

pub fn get_base_filename(basename: &str) -> String {
    match basename {
        "default" | "squirrel" | "weasel" => format!("{}.yaml", basename),
        _ => format!("{}.schema.yaml", basename),
    }
}
