mod rime;
mod commands;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![
            commands::get_health,
            commands::get_schemas,
            commands::read_config,
            commands::write_config,
            commands::deploy,
            commands::read_phrases,
            commands::write_phrases,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
