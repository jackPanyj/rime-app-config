use std::process::Command;

/// Trigger Rime deploy (re-read config files).
pub fn trigger_deploy() -> (bool, String) {
    if cfg!(target_os = "macos") {
        deploy_macos()
    } else if cfg!(target_os = "linux") {
        deploy_linux()
    } else if cfg!(target_os = "windows") {
        deploy_windows()
    } else {
        (false, "不支持的平台".into())
    }
}

fn deploy_macos() -> (bool, String) {
    let result = Command::new("/Library/Input Methods/Squirrel.app/Contents/MacOS/Squirrel")
        .arg("--reload")
        .output();

    match result {
        Ok(output) => {
            if output.status.success() {
                (true, "已通知鼠须管重新部署".into())
            } else {
                let stderr = String::from_utf8_lossy(&output.stderr);
                (false, format!("部署失败: {}", stderr))
            }
        }
        Err(e) => (false, format!("部署失败: {}", e)),
    }
}

fn deploy_linux() -> (bool, String) {
    // Try fcitx5 first
    if let Ok(output) = Command::new("fcitx5-remote").arg("-r").output() {
        if output.status.success() {
            return (true, "Fcitx5 Rime 已重新部署".into());
        }
    }
    // Fallback to ibus
    if let Ok(output) = Command::new("ibus").arg("write-cache").output() {
        if output.status.success() {
            return (true, "IBus Rime 已重新部署".into());
        }
    }
    (false, "部署失败: 未找到支持的输入框架".into())
}

fn deploy_windows() -> (bool, String) {
    let result = Command::new("C:\\Program Files (x86)\\Rime\\weasel-0.15.0\\WeaselDeployer.exe")
        .arg("/deploy")
        .output();

    match result {
        Ok(output) => {
            if output.status.success() {
                (true, "小狼毫已重新部署".into())
            } else {
                let stderr = String::from_utf8_lossy(&output.stderr);
                (false, format!("部署失败: {}", stderr))
            }
        }
        Err(e) => (false, format!("部署失败: {}", e)),
    }
}
