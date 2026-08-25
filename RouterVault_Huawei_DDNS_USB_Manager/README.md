# RouterVault — Huawei DDNS & USB Storage Manager

## Idea

Create a portable Windows application and PowerShell toolkit for configuring and using supported Huawei router features without requiring administrator rights.

Initial target device:

- Huawei EchoLife HG8145V5
- Hardware: 15AD.A
- Firmware family: V5R019C00S107
- ISP-customized Bharti interface
- Router address: `192.168.100.1`

## Core goals

1. Detect the router and show whether it is reachable.
2. Guide the user to `Network Application > DDNS`.
3. Configure supported DDNS providers such as No-IP, Dynu, and DynDNS.
4. Detect USB storage connected to the router.
5. Enable and test LAN-only FTP sharing.
6. Open the USB share from Windows.
7. Copy, upload, rename, create folders, download, and delete files.
8. Measure actual upload/download speed.
9. Detect whether WAN access is blocked by CGNAT.
10. Export and restore non-sensitive application settings.

## Proposed Windows deliverables

- `RouterVault.ps1` — portable PowerShell application.
- `Start-RouterVault.bat` — launcher that bypasses no security controls and requires no admin installation.
- Optional HTML/PowerShell GUI.
- Optional WinSCP Portable integration for dependable FTP file operations.

## Important device observations

The HG8145V5 interface exposes:

- `Network Application > USB Application`
- FTP client configuration, used to download from an external FTP server to router USB storage.
- FTP server configuration, used to share the attached USB drive.
- Fields for enablement, username, password, port, USB device, and root path.
- The router currently reports `No USB Device` until storage is inserted and detected.

Depending on ISP firmware and login privileges, DDNS, Samba, DLNA, WAN-side FTP, or access-control options may be hidden.

## Expected performance

Typical real-world FTP estimates:

| Connection | Expected throughput |
|---|---:|
| Gigabit Ethernet | 5–15 MB/s |
| 5 GHz Wi-Fi near router | 4–12 MB/s |
| 2.4 GHz Wi-Fi | 2–6 MB/s |

Actual speed depends on the USB drive, filesystem, Wi-Fi conditions, router CPU, and firmware FTP implementation. The router's USB 2.0 theoretical maximum should not be treated as achievable file-sharing throughput.

## Security requirements

- Default to LAN-only access.
- Never expose ordinary unencrypted FTP directly to the internet.
- Do not store router administrator passwords in scripts or Git.
- Use a separate FTP username and strong unique password.
- Redact router serial numbers, public IPs, credentials, and DDNS tokens from logs.
- Detect private/CGNAT WAN addresses before suggesting external access.
- Recommend VPN-based remote access when possible.
- Require confirmation before file deletion or overwriting.
- Provide a safe USB-eject/disable reminder to reduce filesystem corruption risk.

## Automation feasibility

A universal configuration script is not possible across all Huawei firmware because authentication, CSRF tokens, page names, and internal APIs vary. Development should proceed in two layers:

1. Safe universal layer: reachability, public/WAN IP comparison, FTP connection, file operations, transfer testing, and opening the correct admin page.
2. Firmware adapter: configuration calls implemented only after capturing and documenting the specific HG8145V5 web requests without embedding credentials.

## Suggested milestones

1. Build a read-only diagnostic PowerShell script.
2. Add FTP browse/upload/download/delete operations.
3. Add speed testing and connection diagnostics.
4. Inspect the HG8145V5 DDNS menu and supported providers.
5. Add an opt-in firmware-specific configuration adapter.
6. Package as a portable no-admin application.
